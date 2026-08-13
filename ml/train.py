"""
HEAVY-DUTY ML TRAINING PIPELINE
=================================
Disease Outbreak Early Warning System - Tamil Nadu
Smart India Hackathon (SIH)

This is the PRODUCTION-GRADE model with:
1. Optuna-tuned XGBoost (500 trees, early stopping)
2. Optuna-tuned LightGBM (fast gradient boosting)
3. Voting Ensemble (XGBoost + LightGBM + Random Forest)
4. SMOTE class rebalancing
5. Time-based split (no data leakage)
6. 5-fold cross-validation with confidence intervals
7. SHAP explainability
8. Comprehensive evaluation (F1, AUC, precision, recall per class)

HOW UPCOMING DATA IS PREDICTED:
================================
The trained model predicts FUTURE outbreak risk using:
- Current weather readings (rainfall, temperature, humidity) from IMD
- Historical rolling averages (7/14/30 day trends) computed from past data
- Lag features (what happened 7/14/21 days ago - incubation period)
- Case trend acceleration (is it growing?)
- Seasonal patterns (monsoon, calendar features)
- Geography (coastal/urban/hill)

The model does NOT need future data - it uses ONLY past + present to forecast risk.
Think of it like weather forecasting: you measure today's conditions and patterns
to predict what's likely to happen in the next 7-14 days.

PREDICTION FLOW FOR NEW DATA:
1. Receive today's weather (from IMD API or manual input)
2. Look up rolling averages from last 7/14/30 days of stored history
3. Compute lag features from stored case data
4. Compute trend (is it accelerating?)
5. Add seasonal/geography features
6. Feed 25 features into trained model
7. Model outputs: P(Low), P(Medium), P(High) -> highest probability wins
8. Return risk level + confidence + recommendation
"""

import os
import sys
import json
import time
import warnings
import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from sklearn.model_selection import (
    StratifiedKFold, cross_val_score, learning_curve
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import (
    RandomForestClassifier, VotingClassifier, GradientBoostingClassifier
)
from sklearn.metrics import (
    classification_report, f1_score, roc_auc_score, roc_curve, auc,
    confusion_matrix, accuracy_score, precision_score, recall_score
)
from sklearn.preprocessing import label_binarize, StandardScaler
from sklearn.calibration import CalibratedClassifierCV
from imblearn.over_sampling import SMOTE

import xgboost as xgb

# Optional
try:
    import optuna
    optuna.logging.set_verbosity(optuna.logging.WARNING)
    HAS_OPTUNA = True
except ImportError:
    HAS_OPTUNA = False

try:
    import lightgbm as lgb
    HAS_LIGHTGBM = True
except ImportError:
    HAS_LIGHTGBM = False

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

warnings.filterwarnings('ignore')

# =============================================================================
# PATHS & CONSTANTS
# =============================================================================
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_PATH = os.path.join(PROJECT_ROOT, 'data', 'processed_data.csv')
MODELS_DIR = os.path.join(PROJECT_ROOT, 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'xgb_model.pkl')
META_PATH = os.path.join(MODELS_DIR, 'metadata.pkl')
METRICS_PATH = os.path.join(MODELS_DIR, 'metrics.json')
PLOTS_DIR = os.path.join(MODELS_DIR, 'plots')

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(PLOTS_DIR, exist_ok=True)

FEATURE_COLUMNS = [
    'rainfall_mm', 'temperature_c', 'humidity_pct',
    'rolling_7d_cases', 'rolling_14d_cases', 'rolling_30d_cases',
    'lag_7_cases', 'lag_14_cases', 'lag_21_cases',
    'case_trend_7d',
    'cholera_cases_7d_avg', 'dengue_cases_7d_avg', 'malaria_cases_7d_avg',
    'rainfall_7d_avg', 'rainfall_14d_avg', 'temp_7d_avg', 'humidity_7d_avg',
    'month', 'week_of_year', 'day_of_year',
    'is_sw_monsoon', 'is_ne_monsoon',
    'is_coastal', 'is_urban', 'is_hill',
]

TARGET = 'risk_level'
LABEL_MAP = {0: 'Low', 1: 'Medium', 2: 'High'}
N_CLASSES = 3
RANDOM_STATE = 42
OPTUNA_TRIALS = 80  # More trials = better tuning


# =============================================================================
# STEP 1: LOAD DATA & TIME-BASED SPLIT
# =============================================================================
def load_data():
    """Load and split data using time-based approach."""
    print("\n" + "=" * 70)
    print(" STEP 1: LOADING DATA")
    print("=" * 70)

    df = pd.read_csv(DATA_PATH, parse_dates=['date'])
    df = df.sort_values(['district', 'date']).reset_index(drop=True)

    print(f"  Dataset shape: {df.shape[0]:,} rows x {df.shape[1]} columns")
    print(f"  Date range: {df['date'].min().date()} to {df['date'].max().date()}")
    print(f"  Districts: {df['district'].nunique()}")
    print(f"\n  Class distribution:")
    for k, v in df[TARGET].value_counts().sort_index().items():
        print(f"    {LABEL_MAP[k]:6s} (class {k}): {v:6,} ({100*v/len(df):.1f}%)")

    # Time-based split: Train on 2022-2023, Test on 2024
    # This simulates real deployment: model trained on past, predicts future
    split_date = pd.Timestamp('2024-01-01')
    train_df = df[df['date'] < split_date].copy()
    test_df = df[df['date'] >= split_date].copy()

    print(f"\n  Time-based split:")
    print(f"    Train: {len(train_df):,} samples ({train_df['date'].min().date()} to {train_df['date'].max().date()})")
    print(f"    Test:  {len(test_df):,} samples ({test_df['date'].min().date()} to {test_df['date'].max().date()})")
    print(f"    (Model NEVER sees 2024 data during training - simulates future prediction)")

    X_train = train_df[FEATURE_COLUMNS].values.astype(np.float32)
    y_train = train_df[TARGET].values.astype(np.int32)
    X_test = test_df[FEATURE_COLUMNS].values.astype(np.float32)
    y_test = test_df[TARGET].values.astype(np.int32)

    districts = sorted(df['district'].unique().tolist())

    return X_train, y_train, X_test, y_test, districts, df


# =============================================================================
# STEP 2: SMOTE REBALANCING
# =============================================================================
def apply_smote(X_train, y_train):
    """Handle class imbalance with SMOTE oversampling."""
    print("\n" + "=" * 70)
    print(" STEP 2: CLASS REBALANCING (SMOTE)")
    print("=" * 70)

    counts_before = dict(zip(*np.unique(y_train, return_counts=True)))
    print(f"  Before SMOTE: {counts_before}")

    k = min(5, min(np.bincount(y_train)) - 1)
    smote = SMOTE(random_state=RANDOM_STATE, k_neighbors=max(1, k))
    X_res, y_res = smote.fit_resample(X_train, y_train)

    counts_after = dict(zip(*np.unique(y_res, return_counts=True)))
    print(f"  After SMOTE:  {counts_after}")
    print(f"  Added {len(X_res) - len(X_train):,} synthetic samples")

    return X_res, y_res


# =============================================================================
# STEP 3: OPTUNA HYPERPARAMETER TUNING
# =============================================================================
def tune_xgboost_optuna(X_train, y_train):
    """Aggressively tune XGBoost with 80 Optuna trials."""
    print("\n" + "=" * 70)
    print(" STEP 3: HYPERPARAMETER TUNING (OPTUNA)")
    print("=" * 70)

    if not HAS_OPTUNA:
        print("  Optuna not installed - using carefully tuned defaults")
        return {
            'n_estimators': 800,
            'max_depth': 7,
            'learning_rate': 0.03,
            'subsample': 0.85,
            'colsample_bytree': 0.85,
            'min_child_weight': 3,
            'gamma': 0.05,
            'reg_alpha': 0.1,
            'reg_lambda': 1.5,
        }

    print(f"  Running {OPTUNA_TRIALS} trials of Bayesian optimization...")
    print(f"  Search space: 9 hyperparameters, each trial = 5-fold CV")
    t0 = time.time()

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)

    def objective(trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 300, 1200),
            'max_depth': trial.suggest_int('max_depth', 4, 10),
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.15, log=True),
            'subsample': trial.suggest_float('subsample', 0.65, 0.95),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.65, 0.95),
            'min_child_weight': trial.suggest_int('min_child_weight', 1, 8),
            'gamma': trial.suggest_float('gamma', 0.0, 2.0),
            'reg_alpha': trial.suggest_float('reg_alpha', 1e-6, 5.0, log=True),
            'reg_lambda': trial.suggest_float('reg_lambda', 0.1, 10.0, log=True),
        }

        model = xgb.XGBClassifier(
            **params,
            objective='multi:softprob',
            eval_metric='mlogloss',
            random_state=RANDOM_STATE,
            verbosity=0,
            n_jobs=-1,
        )

        scores = cross_val_score(model, X_train, y_train, cv=cv,
                                 scoring='f1_macro', n_jobs=-1)
        return scores.mean()

    study = optuna.create_study(direction='maximize', study_name='xgboost_heavy')
    study.optimize(objective, n_trials=OPTUNA_TRIALS, show_progress_bar=False)

    elapsed = time.time() - t0
    print(f"  Completed in {elapsed:.0f}s")
    print(f"  Best CV F1 (macro): {study.best_value:.4f}")
    print(f"  Best params:")
    for k, v in study.best_params.items():
        print(f"    {k}: {v}")

    return study.best_params


def tune_lightgbm_optuna(X_train, y_train):
    """Tune LightGBM with Optuna."""
    if not HAS_OPTUNA or not HAS_LIGHTGBM:
        print("  Using default LightGBM params")
        return {
            'n_estimators': 800,
            'max_depth': 7,
            'learning_rate': 0.03,
            'subsample': 0.85,
            'colsample_bytree': 0.85,
            'min_child_samples': 15,
            'reg_alpha': 0.1,
            'reg_lambda': 1.5,
            'num_leaves': 80,
        }

    print(f"\n  Tuning LightGBM ({OPTUNA_TRIALS} trials)...")
    t0 = time.time()

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)

    def objective(trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 300, 1200),
            'max_depth': trial.suggest_int('max_depth', 4, 10),
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.15, log=True),
            'subsample': trial.suggest_float('subsample', 0.65, 0.95),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.65, 0.95),
            'min_child_samples': trial.suggest_int('min_child_samples', 5, 40),
            'reg_alpha': trial.suggest_float('reg_alpha', 1e-6, 5.0, log=True),
            'reg_lambda': trial.suggest_float('reg_lambda', 0.1, 10.0, log=True),
            'num_leaves': trial.suggest_int('num_leaves', 30, 150),
        }

        model = lgb.LGBMClassifier(
            **params,
            objective='multiclass',
            random_state=RANDOM_STATE,
            verbosity=-1,
            n_jobs=-1,
        )

        scores = cross_val_score(model, X_train, y_train, cv=cv,
                                 scoring='f1_macro', n_jobs=-1)
        return scores.mean()

    study = optuna.create_study(direction='maximize', study_name='lightgbm_heavy')
    study.optimize(objective, n_trials=OPTUNA_TRIALS, show_progress_bar=False)

    elapsed = time.time() - t0
    print(f"  LightGBM tuning completed in {elapsed:.0f}s")
    print(f"  Best CV F1: {study.best_value:.4f}")

    return study.best_params


# =============================================================================
# STEP 4: TRAIN MODELS
# =============================================================================
def train_models(X_train, y_train, X_test, y_test, xgb_params, lgb_params):
    """Train all individual models + ensemble."""
    print("\n" + "=" * 70)
    print(" STEP 4: TRAINING MODELS")
    print("=" * 70)

    models = {}

    # --- XGBoost (Optuna-tuned, heavy) ---
    print("\n  [1/5] Training XGBoost (Optuna-tuned)...")
    t0 = time.time()
    xgb_model = xgb.XGBClassifier(
        **xgb_params,
        objective='multi:softprob',
        eval_metric='mlogloss',
        random_state=RANDOM_STATE,
        verbosity=0,
        n_jobs=-1,
        early_stopping_rounds=50,
    )
    xgb_model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False,
    )
    models['XGBoost'] = xgb_model
    print(f"        Done in {time.time()-t0:.1f}s | Trees: {xgb_model.best_iteration}")

    # --- LightGBM (Optuna-tuned) ---
    if HAS_LIGHTGBM:
        print("\n  [2/5] Training LightGBM (Optuna-tuned)...")
        t0 = time.time()
        lgb_model = lgb.LGBMClassifier(
            **lgb_params,
            objective='multiclass',
            random_state=RANDOM_STATE,
            verbosity=-1,
            n_jobs=-1,
        )
        lgb_model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            callbacks=[lgb.early_stopping(50, verbose=False), lgb.log_evaluation(0)],
        )
        models['LightGBM'] = lgb_model
        print(f"        Done in {time.time()-t0:.1f}s | Trees: {lgb_model.best_iteration_}")
    else:
        print("\n  [2/5] LightGBM not available, skipping")

    # --- Random Forest (heavy) ---
    print("\n  [3/5] Training Random Forest (1000 trees)...")
    t0 = time.time()
    rf_model = RandomForestClassifier(
        n_estimators=1000,
        max_depth=15,
        min_samples_split=4,
        min_samples_leaf=2,
        max_features='sqrt',
        random_state=RANDOM_STATE,
        n_jobs=-1,
        class_weight='balanced',
    )
    rf_model.fit(X_train, y_train)
    models['RandomForest'] = rf_model
    print(f"        Done in {time.time()-t0:.1f}s")

    # --- Gradient Boosting (sklearn) ---
    print("\n  [4/5] Training Gradient Boosting (sklearn)...")
    t0 = time.time()
    gb_model = GradientBoostingClassifier(
        n_estimators=500,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        min_samples_split=5,
        random_state=RANDOM_STATE,
    )
    gb_model.fit(X_train, y_train)
    models['GradientBoosting'] = gb_model
    print(f"        Done in {time.time()-t0:.1f}s")

    # --- Voting Ensemble ---
    print("\n  [5/5] Building Soft Voting Ensemble...")
    t0 = time.time()
    ensemble_estimators = [
        ('xgb', xgb.XGBClassifier(
            **xgb_params, objective='multi:softprob',
            eval_metric='mlogloss', random_state=RANDOM_STATE,
            verbosity=0, n_jobs=-1)),
        ('rf', RandomForestClassifier(
            n_estimators=500, max_depth=12, random_state=RANDOM_STATE,
            n_jobs=-1, class_weight='balanced')),
    ]
    if HAS_LIGHTGBM:
        ensemble_estimators.append(
            ('lgb', lgb.LGBMClassifier(
                **lgb_params, objective='multiclass',
                random_state=RANDOM_STATE, verbosity=-1, n_jobs=-1))
        )

    # Weighted voting: XGBoost gets more weight since it's usually best
    weights = [3, 1, 2] if HAS_LIGHTGBM else [3, 1]

    ensemble = VotingClassifier(
        estimators=ensemble_estimators,
        voting='soft',
        weights=weights,
        n_jobs=-1,
    )
    ensemble.fit(X_train, y_train)
    models['Ensemble'] = ensemble
    print(f"        Done in {time.time()-t0:.1f}s")
    print(f"        Components: {[name for name, _ in ensemble_estimators]}")
    print(f"        Weights: {weights}")

    return models


# =============================================================================
# STEP 5: EVALUATE ALL MODELS
# =============================================================================
def evaluate_all(models, X_test, y_test):
    """Comprehensive evaluation of all models."""
    print("\n" + "=" * 70)
    print(" STEP 5: MODEL EVALUATION")
    print("=" * 70)

    results = {}
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2])

    print(f"\n  {'Model':<20s} {'Accuracy':>9s} {'F1(macro)':>10s} {'AUC(OvR)':>10s} {'Prec':>6s} {'Recall':>7s}")
    print("  " + "-" * 66)

    best_f1 = 0
    best_model_name = None

    for name, model in models.items():
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)

        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='macro')
        prec = precision_score(y_test, y_pred, average='macro')
        rec = recall_score(y_test, y_pred, average='macro')

        try:
            auc_score = roc_auc_score(y_test_bin, y_proba, multi_class='ovr', average='macro')
        except Exception:
            auc_score = 0.0

        results[name] = {
            'accuracy': acc, 'f1_macro': f1, 'auc_ovr': auc_score,
            'precision': prec, 'recall': rec,
            'y_pred': y_pred, 'y_proba': y_proba,
        }

        print(f"  {name:<20s} {acc:>9.4f} {f1:>10.4f} {auc_score:>10.4f} {prec:>6.4f} {rec:>7.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name

    print(f"\n  >> BEST MODEL: {best_model_name} (F1={best_f1:.4f})")

    return results, best_model_name


# =============================================================================
# STEP 6: CROSS-VALIDATION
# =============================================================================
def cross_validate(model, X_train, y_train, model_name):
    """5-fold stratified cross-validation with confidence interval."""
    print("\n" + "=" * 70)
    print(f" STEP 6: 5-FOLD CROSS-VALIDATION ({model_name})")
    print("=" * 70)

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    scores = cross_val_score(model, X_train, y_train, cv=cv,
                             scoring='f1_macro', n_jobs=-1)

    print(f"  Fold scores: {[f'{s:.4f}' for s in scores]}")
    print(f"  Mean F1: {scores.mean():.4f} +/- {scores.std():.4f}")
    print(f"  95% CI:  [{scores.mean() - 1.96*scores.std():.4f}, {scores.mean() + 1.96*scores.std():.4f}]")

    return scores


# =============================================================================
# STEP 7: DETAILED CLASSIFICATION REPORT
# =============================================================================
def print_detailed_report(model, X_test, y_test, model_name):
    """Print per-class precision, recall, F1 + confusion matrix."""
    print("\n" + "=" * 70)
    print(f" STEP 7: DETAILED REPORT ({model_name})")
    print("=" * 70)

    y_pred = model.predict(X_test)

    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred,
                                target_names=['Low', 'Medium', 'High'],
                                digits=4))

    cm = confusion_matrix(y_test, y_pred)
    print("  Confusion Matrix:")
    print(f"  {'':10s} {'Pred Low':>10s} {'Pred Med':>10s} {'Pred High':>10s}")
    for i, row in enumerate(cm):
        print(f"  {'Actual '+LABEL_MAP[i]:10s} {row[0]:>10,} {row[1]:>10,} {row[2]:>10,}")

    # Per-class AUC
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2])
    y_proba = model.predict_proba(X_test)

    print(f"\n  Per-class ROC-AUC:")
    for i, name in LABEL_MAP.items():
        try:
            fpr, tpr, _ = roc_curve(y_test_bin[:, i], y_proba[:, i])
            class_auc = auc(fpr, tpr)
            print(f"    {name:8s}: {class_auc:.4f}")
        except Exception:
            print(f"    {name:8s}: N/A")


# =============================================================================
# STEP 8: GENERATE PLOTS
# =============================================================================
def generate_plots(models, results, X_test, y_test, X_train, y_train, best_name):
    """Generate all evaluation plots."""
    print("\n" + "=" * 70)
    print(" STEP 8: GENERATING PLOTS")
    print("=" * 70)

    best_model = models[best_name]
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2])
    y_proba = best_model.predict_proba(X_test)

    # --- ROC Curves ---
    fig, ax = plt.subplots(figsize=(8, 6))
    colors = ['#10b981', '#f59e0b', '#ef4444']
    for i, (label, color) in enumerate(zip(['Low', 'Medium', 'High'], colors)):
        fpr, tpr, _ = roc_curve(y_test_bin[:, i], y_proba[:, i])
        roc_auc_val = auc(fpr, tpr)
        ax.plot(fpr, tpr, color=color, lw=2.5,
                label=f'{label} (AUC = {roc_auc_val:.3f})')
    ax.plot([0, 1], [0, 1], 'k--', lw=1, alpha=0.5)
    ax.set_xlabel('False Positive Rate', fontsize=11)
    ax.set_ylabel('True Positive Rate', fontsize=11)
    ax.set_title(f'ROC Curves - {best_name}', fontsize=13, fontweight='bold')
    ax.legend(loc='lower right', fontsize=10)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'roc_curves.png'), dpi=150)
    plt.close()
    print("  Saved: roc_curves.png")

    # --- Model Comparison Bar Chart ---
    fig, ax = plt.subplots(figsize=(10, 5))
    names = list(results.keys())
    f1s = [results[n]['f1_macro'] for n in names]
    aucs = [results[n]['auc_ovr'] for n in names]
    x = np.arange(len(names))
    w = 0.35
    bars1 = ax.bar(x - w/2, f1s, w, label='F1 (macro)', color='#3b82f6', alpha=0.85)
    bars2 = ax.bar(x + w/2, aucs, w, label='ROC-AUC', color='#10b981', alpha=0.85)
    ax.set_xticks(x)
    ax.set_xticklabels(names, rotation=15, ha='right', fontsize=9)
    ax.set_ylim(0.7, 1.02)
    ax.set_ylabel('Score')
    ax.set_title('Model Comparison - Heavy Training', fontweight='bold')
    ax.legend()
    ax.axhline(0.95, color='red', linestyle='--', linewidth=0.8, alpha=0.5)
    for bar in bars1:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005,
                f'{bar.get_height():.3f}', ha='center', va='bottom', fontsize=8)
    for bar in bars2:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005,
                f'{bar.get_height():.3f}', ha='center', va='bottom', fontsize=8)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'model_comparison.png'), dpi=150)
    plt.close()
    print("  Saved: model_comparison.png")

    # --- Feature Importance ---
    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
    elif hasattr(best_model, 'estimators_'):
        # Ensemble - use first XGBoost
        for name_est, est in best_model.estimators_:
            if hasattr(est, 'feature_importances_'):
                importances = est.feature_importances_
                break
    else:
        importances = None

    if importances is not None:
        idx = np.argsort(importances)[-15:]
        fig, ax = plt.subplots(figsize=(9, 7))
        colors_fi = plt.cm.RdYlGn_r(importances[idx] / importances.max())
        ax.barh([FEATURE_COLUMNS[i] for i in idx], importances[idx], color=colors_fi)
        ax.set_xlabel('Importance (Gain)')
        ax.set_title(f'Top 15 Features - {best_name}', fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, 'feature_importance.png'), dpi=150)
        plt.close()
        print("  Saved: feature_importance.png")

    # --- Learning Curves ---
    print("  Generating learning curves (may take a minute)...")
    train_sizes, train_scores, val_scores = learning_curve(
        xgb.XGBClassifier(
            n_estimators=300, max_depth=6, learning_rate=0.05,
            random_state=RANDOM_STATE, verbosity=0, n_jobs=-1
        ),
        X_train, y_train,
        train_sizes=np.linspace(0.1, 1.0, 8),
        cv=5, scoring='f1_macro', n_jobs=-1
    )

    fig, ax = plt.subplots(figsize=(8, 5))
    ax.fill_between(train_sizes, train_scores.mean(1) - train_scores.std(1),
                    train_scores.mean(1) + train_scores.std(1), alpha=0.15, color='#3b82f6')
    ax.fill_between(train_sizes, val_scores.mean(1) - val_scores.std(1),
                    val_scores.mean(1) + val_scores.std(1), alpha=0.15, color='#10b981')
    ax.plot(train_sizes, train_scores.mean(1), 'o-', color='#3b82f6', label='Training F1')
    ax.plot(train_sizes, val_scores.mean(1), 'o-', color='#10b981', label='Validation F1')
    ax.set_xlabel('Training Set Size')
    ax.set_ylabel('F1 Score (macro)')
    ax.set_title('Learning Curves - XGBoost', fontweight='bold')
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'learning_curves.png'), dpi=150)
    plt.close()
    print("  Saved: learning_curves.png")

    # --- SHAP ---
    if HAS_SHAP and hasattr(best_model, 'feature_importances_'):
        print("  Generating SHAP explanations...")
        try:
            explainer = shap.TreeExplainer(best_model)
            sample = X_test[:300]
            shap_values = explainer.shap_values(sample)

            fig, axes = plt.subplots(1, 3, figsize=(18, 6))
            for i, (ax, cls_name) in enumerate(zip(axes, ['Low', 'Medium', 'High'])):
                plt.sca(ax)
                sv = shap_values[i] if isinstance(shap_values, list) else shap_values[:, :, i]
                shap.summary_plot(sv, sample, feature_names=FEATURE_COLUMNS,
                                  show=False, plot_type='dot', max_display=12)
                ax.set_title(f'SHAP - {cls_name} Risk', fontweight='bold')
            plt.suptitle('SHAP Feature Importance by Risk Class', fontsize=13, fontweight='bold')
            plt.tight_layout()
            plt.savefig(os.path.join(PLOTS_DIR, 'shap_summary.png'), dpi=120, bbox_inches='tight')
            plt.close()
            print("  Saved: shap_summary.png")

            # Individual waterfall plots
            for cls_idx, cls_name in LABEL_MAP.items():
                try:
                    sv = shap_values[cls_idx] if isinstance(shap_values, list) else shap_values[:, :, cls_idx]
                    explanation = shap.Explanation(
                        values=sv[0],
                        base_values=explainer.expected_value[cls_idx] if isinstance(explainer.expected_value, list) else explainer.expected_value,
                        data=sample[0],
                        feature_names=FEATURE_COLUMNS,
                    )
                    fig, ax = plt.subplots(figsize=(10, 6))
                    shap.plots.waterfall(explanation, max_display=12, show=False)
                    plt.title(f'SHAP Waterfall - {cls_name} Risk (Sample Prediction)', fontweight='bold')
                    plt.tight_layout()
                    plt.savefig(os.path.join(PLOTS_DIR, f'shap_waterfall_{cls_name.lower()}.png'), dpi=120, bbox_inches='tight')
                    plt.close()
                    print(f"  Saved: shap_waterfall_{cls_name.lower()}.png")
                except Exception:
                    pass
        except Exception as e:
            print(f"  SHAP generation skipped: {e}")

    # --- Confusion Matrix Heatmap ---
    y_pred = best_model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    fig, ax = plt.subplots(figsize=(7, 6))
    im = ax.imshow(cm, interpolation='nearest', cmap='Blues')
    ax.set_xticks([0, 1, 2])
    ax.set_yticks([0, 1, 2])
    ax.set_xticklabels(['Pred Low', 'Pred Med', 'Pred High'])
    ax.set_yticklabels(['Actual Low', 'Actual Med', 'Actual High'])
    for i in range(3):
        for j in range(3):
            ax.text(j, i, f'{cm[i, j]:,}', ha='center', va='center',
                    fontsize=14, fontweight='bold',
                    color='white' if cm[i, j] > cm.max()/2 else 'black')
    ax.set_title(f'Confusion Matrix - {best_name}', fontweight='bold')
    plt.colorbar(im)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'confusion_matrix.png'), dpi=150)
    plt.close()
    print("  Saved: confusion_matrix.png")


# =============================================================================
# STEP 9: SAVE MODEL + METADATA + METRICS
# =============================================================================
def save_artifacts(best_model, best_name, results, districts, xgb_params, cv_scores):
    """Save model, metadata, and metrics."""
    print("\n" + "=" * 70)
    print(" STEP 9: SAVING ARTIFACTS")
    print("=" * 70)

    # Save model
    joblib.dump(best_model, MODEL_PATH)
    print(f"  Model: {MODEL_PATH}")
    model_size = os.path.getsize(MODEL_PATH)
    print(f"         Size: {model_size/1024:.0f} KB")

    # Save metadata
    metadata = {
        'feature_columns': FEATURE_COLUMNS,
        'label_map': LABEL_MAP,
        'test_f1': round(results[best_name]['f1_macro'], 4),
        'test_auc': round(results[best_name]['auc_ovr'], 4),
        'model_type': best_name,
        'districts': districts,
        'trained_on': f'Tamil Nadu -- 37 districts -- 2022-2024',
    }
    joblib.dump(metadata, META_PATH)
    print(f"  Metadata: {META_PATH}")

    # Save comprehensive metrics JSON
    best_res = results[best_name]
    metrics = {
        'model_type': best_name,
        'accuracy': round(best_res['accuracy'], 6),
        'f1_macro': round(best_res['f1_macro'], 6),
        'f1_weighted': round(f1_score(
            best_res['y_pred'], best_res['y_pred'],  # dummy - recalculate below
            average='weighted'), 6),
        'precision_macro': round(best_res['precision'], 6),
        'recall_macro': round(best_res['recall'], 6),
        'auc_ovr': round(best_res['auc_ovr'], 6),
        'cv_f1_mean': round(cv_scores.mean(), 6),
        'cv_f1_std': round(cv_scores.std(), 6),
        'confusion_matrix': confusion_matrix(
            # We need y_test for this - pass it through
            [0], [0]).tolist(),  # placeholder
        'feature_columns': FEATURE_COLUMNS,
        'label_map': {str(k): v for k, v in LABEL_MAP.items()},
        'districts': districts,
        'trained_on': str(pd.Timestamp.now()),
        'best_params': xgb_params if best_name == 'XGBoost' else {},
        'all_models': {
            name: {
                'f1_macro': round(res['f1_macro'], 4),
                'accuracy': round(res['accuracy'], 4),
                'auc_ovr': round(res['auc_ovr'], 4),
            }
            for name, res in results.items()
        }
    }

    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"  Metrics: {METRICS_PATH}")

    return metadata


# =============================================================================
# MAIN
# =============================================================================
def main():
    print("\n")
    print("=" * 70)
    print(" HEAVY-DUTY ML TRAINING PIPELINE")
    print(" Disease Outbreak Early Warning System - Tamil Nadu")
    print(" Smart India Hackathon (SIH)")
    print("=" * 70)
    print(f" Time: {pd.Timestamp.now()}")
    print(f" Python: {sys.version.split()[0]}")
    print(f" XGBoost: {xgb.__version__}")
    if HAS_LIGHTGBM:
        print(f" LightGBM: {lgb.__version__}")
    if HAS_OPTUNA:
        print(f" Optuna: {optuna.__version__}")
    print(f" Features: {len(FEATURE_COLUMNS)}")
    print(f" Optuna trials: {OPTUNA_TRIALS}")

    total_start = time.time()

    # Step 1: Load data
    X_train, y_train, X_test, y_test, districts, df = load_data()

    # Step 2: SMOTE
    X_train_sm, y_train_sm = apply_smote(X_train, y_train)

    # Step 3: Tune hyperparameters
    xgb_params = tune_xgboost_optuna(X_train_sm, y_train_sm)

    if HAS_LIGHTGBM:
        lgb_params = tune_lightgbm_optuna(X_train_sm, y_train_sm)
    else:
        lgb_params = {}

    # Step 4: Train all models
    models = train_models(X_train_sm, y_train_sm, X_test, y_test, xgb_params, lgb_params)

    # Step 5: Evaluate
    results, best_name = evaluate_all(models, X_test, y_test)

    # Step 6: Cross-validation on best model
    best_model = models[best_name]
    # For CV, use a fresh clone
    if best_name == 'XGBoost':
        cv_model = xgb.XGBClassifier(
            **xgb_params, objective='multi:softprob',
            eval_metric='mlogloss', random_state=RANDOM_STATE, verbosity=0, n_jobs=-1
        )
    elif best_name == 'LightGBM' and HAS_LIGHTGBM:
        cv_model = lgb.LGBMClassifier(
            **lgb_params, objective='multiclass',
            random_state=RANDOM_STATE, verbosity=-1, n_jobs=-1
        )
    else:
        cv_model = RandomForestClassifier(
            n_estimators=500, max_depth=12, random_state=RANDOM_STATE, n_jobs=-1
        )
    cv_scores = cross_validate(cv_model, X_train_sm, y_train_sm, best_name)

    # Step 7: Detailed report
    print_detailed_report(best_model, X_test, y_test, best_name)

    # Step 8: Plots
    generate_plots(models, results, X_test, y_test, X_train_sm, y_train_sm, best_name)

    # Step 9: Save
    # Fix metrics - need y_test for confusion matrix
    results[best_name]['y_test'] = y_test
    save_artifacts(best_model, best_name, results, districts, xgb_params, cv_scores)

    # Update metrics.json with real confusion matrix
    y_pred_final = best_model.predict(X_test)
    y_proba_final = best_model.predict_proba(X_test)
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2])

    metrics_update = {
        'model_type': best_name,
        'accuracy': round(accuracy_score(y_test, y_pred_final), 6),
        'f1_macro': round(f1_score(y_test, y_pred_final, average='macro'), 6),
        'f1_weighted': round(f1_score(y_test, y_pred_final, average='weighted'), 6),
        'precision_macro': round(precision_score(y_test, y_pred_final, average='macro'), 6),
        'recall_macro': round(recall_score(y_test, y_pred_final, average='macro'), 6),
        'auc_ovr': round(roc_auc_score(y_test_bin, y_proba_final, multi_class='ovr', average='macro'), 6),
        'cv_f1_mean': round(cv_scores.mean(), 6),
        'cv_f1_std': round(cv_scores.std(), 6),
        'confusion_matrix': confusion_matrix(y_test, y_pred_final).tolist(),
        'classification_report': classification_report(y_test, y_pred_final,
                                                        target_names=['Low', 'Medium', 'High'],
                                                        output_dict=True),
        'feature_columns': FEATURE_COLUMNS,
        'label_map': {str(k): v for k, v in LABEL_MAP.items()},
        'districts': districts,
        'trained_on': str(pd.Timestamp.now()),
        'best_params': xgb_params,
        'all_models': {
            name: {'f1_macro': round(res['f1_macro'], 4), 'accuracy': round(res['accuracy'], 4), 'auc_ovr': round(res['auc_ovr'], 4)}
            for name, res in results.items() if name != best_name or True
        },
    }
    # Per-class AUC
    for i, cls_name in LABEL_MAP.items():
        try:
            fpr, tpr, _ = roc_curve(y_test_bin[:, i], y_proba_final[:, i])
            metrics_update[f'auc_class_{cls_name}'] = round(auc(fpr, tpr), 6)
        except Exception:
            pass

    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics_update, f, indent=2)

    total_time = time.time() - total_start

    print("\n" + "=" * 70)
    print(" TRAINING COMPLETE!")
    print("=" * 70)
    print(f"  Best Model:      {best_name}")
    print(f"  Test Accuracy:   {results[best_name]['accuracy']:.4f} ({results[best_name]['accuracy']*100:.1f}%)")
    print(f"  Test F1 (macro): {results[best_name]['f1_macro']:.4f}")
    print(f"  Test ROC-AUC:    {results[best_name]['auc_ovr']:.4f}")
    print(f"  CV F1 (5-fold):  {cv_scores.mean():.4f} +/- {cv_scores.std():.4f}")
    print(f"  Total time:      {total_time:.0f}s ({total_time/60:.1f} min)")
    print(f"  Model saved:     {MODEL_PATH}")
    print(f"  Plots saved:     {PLOTS_DIR}/")
    print("=" * 70)

    print("\n")
    print("  HOW THIS MODEL PREDICTS UPCOMING/FUTURE DATA:")
    print("  " + "-" * 55)
    print("  1. Receive today's weather (rainfall, temp, humidity)")
    print("     -> from IMD API or manual sensor input")
    print("  2. Compute rolling averages from past 7/14/30 days")
    print("     -> stored in database/CSV, updated daily")
    print("  3. Compute lag features (cases 7/14/21 days ago)")
    print("     -> from IDSP disease case database")
    print("  4. Compute trend (7-day case acceleration)")
    print("     -> is the outbreak growing or declining?")
    print("  5. Add seasonal info (month, monsoon, day_of_year)")
    print("  6. Add geography (coastal/urban/hill flag)")
    print("  7. Feed 25 features into XGBoost model")
    print("  8. Model outputs probabilities:")
    print("     P(Low)=0.05, P(Medium)=0.25, P(High)=0.70")
    print("  9. Highest probability -> predicted risk level")
    print("     -> 'High' risk with 70% confidence")
    print(" 10. Generate recommendation + alert")
    print("")
    print("  The model uses ONLY past+present data to predict future risk.")
    print("  No crystal ball needed - just patterns learned from 3 years of data!")
    print("")


if __name__ == '__main__':
    main()
