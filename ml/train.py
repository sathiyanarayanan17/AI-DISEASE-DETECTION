"""
Early Warning System - ML Model Training Script
Trains XGBoost, LightGBM, Random Forest, and Voting Ensemble
for disease outbreak risk prediction across Tamil Nadu districts.
"""

import os
import sys
import time
import json
import warnings
import datetime
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from sklearn.model_selection import cross_val_score, StratifiedKFold, learning_curve
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, classification_report,
    confusion_matrix, roc_curve, auc, precision_recall_fscore_support
)
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.preprocessing import label_binarize
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

warnings.filterwarnings('ignore')

# Optional imports
try:
    from lightgbm import LGBMClassifier
    HAS_LGBM = True
    print("[INFO] LightGBM available")
except ImportError:
    HAS_LGBM = False
    print("[INFO] LightGBM not available, skipping")

try:
    import shap
    HAS_SHAP = True
    print("[INFO] SHAP available")
except ImportError:
    HAS_SHAP = False
    print("[INFO] SHAP not available, skipping explanations")

# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_PATH = os.path.join(PROJECT_ROOT, 'data', 'processed_data.csv')
MODELS_DIR = os.path.join(PROJECT_ROOT, 'models')
PLOTS_DIR = os.path.join(MODELS_DIR, 'plots')

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(PLOTS_DIR, exist_ok=True)

FEATURE_COLUMNS = [
    'rainfall_mm', 'temperature_c', 'humidity_pct',
    'rolling_7d_cases', 'rolling_14d_cases', 'rolling_30d_cases',
    'lag_7_cases', 'lag_14_cases', 'lag_21_cases',
    'case_trend_7d',
    'cholera_cases_7d_avg', 'dengue_cases_7d_avg', 'malaria_cases_7d_avg',
    'rainfall_7d_avg', 'rainfall_14d_avg',
    'temp_7d_avg', 'humidity_7d_avg',
    'month', 'week_of_year', 'day_of_year',
    'is_sw_monsoon', 'is_ne_monsoon',
    'is_coastal', 'is_urban', 'is_hill'
]

TARGET = 'risk_level'
LABEL_MAP = {0: 'Low', 1: 'Medium', 2: 'High'}
NUM_CLASSES = len(LABEL_MAP)

SPLIT_DATE = '2024-01-01'


def load_data():
    """Load and validate processed data."""
    print("\n" + "=" * 60)
    print("STEP 1: Loading Data")
    print("=" * 60)
    start = time.time()

    if not os.path.exists(DATA_PATH):
        print(f"[ERROR] Data file not found: {DATA_PATH}")
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)
    df['date'] = pd.to_datetime(df['date'])

    print(f"  Loaded {len(df):,} rows, {len(df.columns)} columns")
    print(f"  Districts: {df['district'].nunique()}")
    print(f"  Date range: {df['date'].min().date()} to {df['date'].max().date()}")
    print(f"  Target distribution:")
    for val, label in LABEL_MAP.items():
        count = (df[TARGET] == val).sum()
        print(f"    {label} ({val}): {count:,} ({100*count/len(df):.1f}%)")

    # Check for missing features
    missing_cols = [c for c in FEATURE_COLUMNS if c not in df.columns]
    if missing_cols:
        print(f"[ERROR] Missing columns: {missing_cols}")
        sys.exit(1)

    elapsed = time.time() - start
    print(f"  Done in {elapsed:.1f}s")
    return df


def split_data(df):
    """Time-based train/test split."""
    print("\n" + "=" * 60)
    print("STEP 2: Train/Test Split (time-based)")
    print("=" * 60)
    start = time.time()

    train_df = df[df['date'] < SPLIT_DATE].copy()
    test_df = df[df['date'] >= SPLIT_DATE].copy()

    X_train = train_df[FEATURE_COLUMNS].values
    y_train = train_df[TARGET].values
    X_test = test_df[FEATURE_COLUMNS].values
    y_test = test_df[TARGET].values

    print(f"  Train: {len(train_df):,} rows (before {SPLIT_DATE})")
    print(f"  Test:  {len(test_df):,} rows (from {SPLIT_DATE} onwards)")
    print(f"  Train target dist: {dict(zip(*np.unique(y_train, return_counts=True)))}")
    print(f"  Test target dist:  {dict(zip(*np.unique(y_test, return_counts=True)))}")

    elapsed = time.time() - start
    print(f"  Done in {elapsed:.1f}s")
    return X_train, X_test, y_train, y_test


def apply_smote(X_train, y_train):
    """Apply SMOTE for class balancing."""
    print("\n" + "=" * 60)
    print("STEP 3: Applying SMOTE")
    print("=" * 60)
    start = time.time()

    print(f"  Before SMOTE: {len(X_train):,} samples")
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
    print(f"  After SMOTE:  {len(X_resampled):,} samples")
    print(f"  Resampled dist: {dict(zip(*np.unique(y_resampled, return_counts=True)))}")

    elapsed = time.time() - start
    print(f"  Done in {elapsed:.1f}s")
    return X_resampled, y_resampled


def train_xgboost(X_train, y_train, X_test, y_test):
    """Train XGBoost with early stopping."""
    print("\n  [XGBoost] Training...")
    start = time.time()

    xgb_model = XGBClassifier(
        n_estimators=600,
        max_depth=7,
        learning_rate=0.03,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=3,
        gamma=0.05,
        reg_alpha=0.1,
        reg_lambda=1.5,
        eval_metric='mlogloss',
        random_state=42,
        n_jobs=-1,
        verbosity=0,
        early_stopping_rounds=50
    )

    xgb_model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False
    )

    elapsed = time.time() - start
    print(f"  [XGBoost] Done in {elapsed:.1f}s (best iteration: {xgb_model.best_iteration})")
    return xgb_model


def train_lightgbm(X_train, y_train, X_test, y_test):
    """Train LightGBM."""
    if not HAS_LGBM:
        return None

    print("\n  [LightGBM] Training...")
    start = time.time()

    lgbm_model = LGBMClassifier(
        n_estimators=600,
        max_depth=7,
        learning_rate=0.03,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_samples=15,
        reg_alpha=0.1,
        reg_lambda=1.5,
        num_leaves=80,
        random_state=42,
        verbosity=-1,
        n_jobs=-1
    )

    lgbm_model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        callbacks=[
            __import__('lightgbm').early_stopping(50, verbose=False),
            __import__('lightgbm').log_evaluation(period=0)
        ]
    )

    elapsed = time.time() - start
    best_iter = lgbm_model.best_iteration_ if hasattr(lgbm_model, 'best_iteration_') else 'N/A'
    print(f"  [LightGBM] Done in {elapsed:.1f}s (best iteration: {best_iter})")
    return lgbm_model


def train_random_forest(X_train, y_train):
    """Train Random Forest."""
    print("\n  [Random Forest] Training...")
    start = time.time()

    rf_model = RandomForestClassifier(
        n_estimators=800,
        max_depth=14,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'
    )

    rf_model.fit(X_train, y_train)

    elapsed = time.time() - start
    print(f"  [Random Forest] Done in {elapsed:.1f}s")
    return rf_model


def build_voting_ensemble(xgb_model, lgbm_model, rf_model, X_train, y_train):
    """Build a manual soft-voting ensemble using already-trained models."""
    print("\n  [Voting Ensemble] Building (manual averaging)...")
    start = time.time()

    # Manual ensemble - averages predicted probabilities with weights
    # This avoids sklearn VotingClassifier compatibility issues with XGBoost
    class ManualEnsemble:
        def __init__(self, models, weights):
            self.models = models
            self.weights = np.array(weights) / sum(weights)
            self.classes_ = np.array([0, 1, 2])

        def predict_proba(self, X):
            probas = []
            for model, weight in zip(self.models, self.weights):
                probas.append(model.predict_proba(X) * weight)
            return sum(probas)

        def predict(self, X):
            proba = self.predict_proba(X)
            return np.argmax(proba, axis=1)

    models_list = [xgb_model, rf_model]
    weights_list = [3, 1]

    if lgbm_model is not None:
        models_list = [xgb_model, lgbm_model, rf_model]
        weights_list = [3, 2, 1]

    ensemble = ManualEnsemble(models_list, weights_list)

    elapsed = time.time() - start
    print(f"  [Voting Ensemble] Done in {elapsed:.1f}s")
    print(f"  Weights: XGB={weights_list[0]}, " +
          (f"LGB={weights_list[1]}, RF={weights_list[2]}" if lgbm_model else f"RF={weights_list[1]}"))
    return ensemble


def evaluate_model(model, X_test, y_test, model_name):
    """Evaluate a model and return metrics."""
    y_pred = model.predict(X_test)

    # Get probabilities
    try:
        y_proba = model.predict_proba(X_test)
    except Exception:
        y_proba = None

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average='macro')

    # ROC AUC (one-vs-rest)
    roc_auc = None
    if y_proba is not None:
        try:
            y_test_bin = label_binarize(y_test, classes=list(LABEL_MAP.keys()))
            roc_auc = roc_auc_score(y_test_bin, y_proba, average='macro', multi_class='ovr')
        except Exception:
            pass

    # Per-class metrics
    precision, recall, f1_per_class, support = precision_recall_fscore_support(
        y_test, y_pred, labels=list(LABEL_MAP.keys())
    )

    report = classification_report(y_test, y_pred, target_names=list(LABEL_MAP.values()), output_dict=True)
    cm = confusion_matrix(y_test, y_pred)

    metrics = {
        'model_name': model_name,
        'accuracy': acc,
        'f1_macro': f1,
        'roc_auc_ovr': roc_auc,
        'per_class': {},
        'classification_report': report,
        'confusion_matrix': cm.tolist(),
        'y_pred': y_pred,
        'y_proba': y_proba
    }

    for i, (val, label) in enumerate(LABEL_MAP.items()):
        metrics['per_class'][label] = {
            'precision': float(precision[i]),
            'recall': float(recall[i]),
            'f1': float(f1_per_class[i]),
            'support': int(support[i])
        }

    # Per-class AUC
    if y_proba is not None:
        y_test_bin = label_binarize(y_test, classes=list(LABEL_MAP.keys()))
        per_class_auc = {}
        for i, label in LABEL_MAP.items():
            try:
                per_class_auc[label] = float(roc_auc_score(y_test_bin[:, i], y_proba[:, i]))
            except Exception:
                per_class_auc[label] = None
        metrics['per_class_auc'] = per_class_auc

    return metrics


def train_all_models(X_train_smote, y_train_smote, X_test, y_test):
    """Train all models and evaluate them."""
    print("\n" + "=" * 60)
    print("STEP 4: Training Models")
    print("=" * 60)
    start = time.time()

    # Train individual models
    xgb_model = train_xgboost(X_train_smote, y_train_smote, X_test, y_test)
    lgbm_model = train_lightgbm(X_train_smote, y_train_smote, X_test, y_test)
    rf_model = train_random_forest(X_train_smote, y_train_smote)

    # Build voting ensemble
    voting_model = build_voting_ensemble(xgb_model, lgbm_model, rf_model, X_train_smote, y_train_smote)

    elapsed = time.time() - start
    print(f"\n  All models trained in {elapsed:.1f}s")

    # Evaluate all models
    print("\n" + "=" * 60)
    print("STEP 5: Evaluating Models")
    print("=" * 60)

    models = {
        'XGBoost': xgb_model,
        'Random Forest': rf_model,
        'Voting Ensemble': voting_model
    }
    if lgbm_model is not None:
        models['LightGBM'] = lgbm_model

    all_metrics = {}
    for name, model in models.items():
        metrics = evaluate_model(model, X_test, y_test, name)
        all_metrics[name] = metrics
        auc_str = f"{metrics['roc_auc_ovr']:.4f}" if metrics['roc_auc_ovr'] else "N/A"
        print(f"\n  {name}:")
        print(f"    Accuracy: {metrics['accuracy']:.4f}")
        print(f"    F1 Macro: {metrics['f1_macro']:.4f}")
        print(f"    ROC AUC:  {auc_str}")
        for label, class_metrics in metrics['per_class'].items():
            print(f"    {label}: P={class_metrics['precision']:.3f} R={class_metrics['recall']:.3f} F1={class_metrics['f1']:.3f}")

    # Select best model by F1 macro
    best_name = max(all_metrics, key=lambda k: all_metrics[k]['f1_macro'])
    best_model = models[best_name]
    best_metrics = all_metrics[best_name]

    print(f"\n  >>> Best Model: {best_name} (F1 Macro: {best_metrics['f1_macro']:.4f})")

    return models, all_metrics, best_name, best_model, best_metrics


def cross_validate_best(best_model, X_train_smote, y_train_smote, best_name):
    """5-fold cross-validation on the best model."""
    print("\n" + "=" * 60)
    print("STEP 6: Cross-Validation (5-fold)")
    print("=" * 60)
    start = time.time()

    # Create a fresh model without early_stopping for CV (it needs eval_set)
    if best_name == 'XGBoost':
        import xgboost as xgb_cv
        cv_model = xgb_cv.XGBClassifier(
            n_estimators=600, max_depth=7, learning_rate=0.03,
            subsample=0.85, colsample_bytree=0.85, min_child_weight=3,
            gamma=0.05, reg_alpha=0.1, reg_lambda=1.5,
            eval_metric='mlogloss', random_state=42, n_jobs=-1, verbosity=0
        )
    elif best_name == 'LightGBM':
        import lightgbm as lgb_cv
        cv_model = lgb_cv.LGBMClassifier(
            n_estimators=600, max_depth=7, learning_rate=0.03,
            subsample=0.85, colsample_bytree=0.85, min_child_samples=15,
            reg_alpha=0.1, reg_lambda=1.5, num_leaves=80,
            random_state=42, verbosity=-1, n_jobs=-1
        )
    else:
        cv_model = RandomForestClassifier(
            n_estimators=800, max_depth=14, random_state=42, n_jobs=-1
        )

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(cv_model, X_train_smote, y_train_smote, cv=cv, scoring='f1_macro', n_jobs=-1)

    print(f"  Model: {best_name}")
    print(f"  CV F1 Scores: {[f'{s:.4f}' for s in cv_scores]}")
    print(f"  CV F1 Mean:   {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

    elapsed = time.time() - start
    print(f"  Done in {elapsed:.1f}s")
    return cv_scores


def plot_roc_curves(all_metrics, y_test):
    """Plot ROC curves for each class and each model."""
    print("\n  Generating ROC curves...")
    fig, axes = plt.subplots(1, NUM_CLASSES, figsize=(15, 5))
    y_test_bin = label_binarize(y_test, classes=list(LABEL_MAP.keys()))

    colors = {'XGBoost': 'blue', 'LightGBM': 'green', 'Random Forest': 'orange', 'Voting Ensemble': 'red'}

    for i, (class_idx, label) in enumerate(LABEL_MAP.items()):
        ax = axes[i]
        for model_name, metrics in all_metrics.items():
            if metrics['y_proba'] is not None:
                fpr, tpr, _ = roc_curve(y_test_bin[:, i], metrics['y_proba'][:, i])
                roc_auc_val = auc(fpr, tpr)
                color = colors.get(model_name, 'gray')
                ax.plot(fpr, tpr, color=color, lw=2,
                        label=f'{model_name} (AUC={roc_auc_val:.3f})')

        ax.plot([0, 1], [0, 1], 'k--', lw=1)
        ax.set_xlabel('False Positive Rate')
        ax.set_ylabel('True Positive Rate')
        ax.set_title(f'ROC - {label} Risk')
        ax.legend(loc='lower right', fontsize=8)
        ax.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'roc_curves.png'), dpi=150, bbox_inches='tight')
    plt.close()


def plot_model_comparison(all_metrics):
    """Bar chart comparing model performance."""
    print("  Generating model comparison chart...")
    model_names = list(all_metrics.keys())
    f1_scores = [all_metrics[m]['f1_macro'] for m in model_names]
    accuracies = [all_metrics[m]['accuracy'] for m in model_names]
    auc_scores = [all_metrics[m]['roc_auc_ovr'] if all_metrics[m]['roc_auc_ovr'] else 0 for m in model_names]

    x = np.arange(len(model_names))
    width = 0.25

    fig, ax = plt.subplots(figsize=(10, 6))
    bars1 = ax.bar(x - width, f1_scores, width, label='F1 Macro', color='steelblue')
    bars2 = ax.bar(x, accuracies, width, label='Accuracy', color='coral')
    bars3 = ax.bar(x + width, auc_scores, width, label='ROC AUC', color='seagreen')

    ax.set_xlabel('Model')
    ax.set_ylabel('Score')
    ax.set_title('Model Comparison')
    ax.set_xticks(x)
    ax.set_xticklabels(model_names, rotation=15, ha='right')
    ax.legend()
    ax.set_ylim(0, 1.05)
    ax.grid(True, axis='y', alpha=0.3)

    # Add value labels
    for bars in [bars1, bars2, bars3]:
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{height:.3f}', xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8)

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'model_comparison.png'), dpi=150, bbox_inches='tight')
    plt.close()


def plot_feature_importance(best_model, best_name):
    """Plot feature importance for best model."""
    print("  Generating feature importance plot...")
    importances = None

    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
    elif hasattr(best_model, 'estimators_'):
        # For VotingClassifier, use first estimator with feature_importances_
        for est in best_model.estimators_:
            if hasattr(est, 'feature_importances_'):
                importances = est.feature_importances_
                break

    if importances is None:
        print("  [WARN] Cannot extract feature importances")
        return

    # Sort by importance
    indices = np.argsort(importances)[::-1]
    top_n = min(20, len(FEATURE_COLUMNS))

    fig, ax = plt.subplots(figsize=(10, 8))
    top_indices = indices[:top_n]
    ax.barh(range(top_n), importances[top_indices][::-1], color='steelblue')
    ax.set_yticks(range(top_n))
    ax.set_yticklabels([FEATURE_COLUMNS[i] for i in top_indices][::-1])
    ax.set_xlabel('Importance')
    ax.set_title(f'Top {top_n} Feature Importances ({best_name})')
    ax.grid(True, axis='x', alpha=0.3)

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'feature_importance.png'), dpi=150, bbox_inches='tight')
    plt.close()


def plot_confusion_matrix(best_metrics, best_name):
    """Plot confusion matrix for best model."""
    print("  Generating confusion matrix...")
    cm = np.array(best_metrics['confusion_matrix'])

    fig, ax = plt.subplots(figsize=(8, 6))
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    ax.figure.colorbar(im, ax=ax)

    labels = list(LABEL_MAP.values())
    ax.set(xticks=np.arange(cm.shape[1]),
           yticks=np.arange(cm.shape[0]),
           xticklabels=labels, yticklabels=labels,
           title=f'Confusion Matrix - {best_name}',
           ylabel='True Label',
           xlabel='Predicted Label')

    # Add text annotations
    thresh = cm.max() / 2.
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, format(cm[i, j], 'd'),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'confusion_matrix.png'), dpi=150, bbox_inches='tight')
    plt.close()


def plot_learning_curves(best_model, X_train, y_train, best_name):
    """Plot learning curves."""
    print("  Generating learning curves...")
    try:
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        train_sizes, train_scores, val_scores = learning_curve(
            best_model, X_train, y_train,
            cv=cv, scoring='f1_macro',
            train_sizes=np.linspace(0.1, 1.0, 8),
            n_jobs=-1
        )

        train_mean = np.mean(train_scores, axis=1)
        train_std = np.std(train_scores, axis=1)
        val_mean = np.mean(val_scores, axis=1)
        val_std = np.std(val_scores, axis=1)

        fig, ax = plt.subplots(figsize=(10, 6))
        ax.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color='blue')
        ax.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.1, color='orange')
        ax.plot(train_sizes, train_mean, 'o-', color='blue', label='Training Score')
        ax.plot(train_sizes, val_mean, 'o-', color='orange', label='Validation Score')
        ax.set_xlabel('Training Size')
        ax.set_ylabel('F1 Macro Score')
        ax.set_title(f'Learning Curves - {best_name}')
        ax.legend(loc='lower right')
        ax.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, 'learning_curves.png'), dpi=150, bbox_inches='tight')
        plt.close()
    except Exception as e:
        print(f"  [WARN] Learning curves failed: {e}")


def generate_plots(all_metrics, best_model, best_name, best_metrics, X_train, y_train, y_test):
    """Generate all plots."""
    print("\n" + "=" * 60)
    print("STEP 7: Generating Plots")
    print("=" * 60)
    start = time.time()

    plot_roc_curves(all_metrics, y_test)
    plot_model_comparison(all_metrics)
    plot_feature_importance(best_model, best_name)
    plot_confusion_matrix(best_metrics, best_name)
    plot_learning_curves(best_model, X_train, y_train, best_name)

    elapsed = time.time() - start
    print(f"  All plots saved to {PLOTS_DIR}")
    print(f"  Done in {elapsed:.1f}s")


def generate_shap_explanations(best_model, X_test, best_name):
    """Generate SHAP explanations if available."""
    if not HAS_SHAP:
        return

    print("\n" + "=" * 60)
    print("STEP 8: SHAP Explanations")
    print("=" * 60)
    start = time.time()

    try:
        # Use a sample for speed
        sample_size = min(500, len(X_test))
        X_sample = X_test[:sample_size]

        # Determine which model to explain
        model_to_explain = best_model
        if hasattr(best_model, 'estimators_'):
            # For VotingClassifier, explain the first tree-based model
            for est in best_model.estimators_:
                if hasattr(est, 'feature_importances_'):
                    model_to_explain = est
                    break

        explainer = shap.TreeExplainer(model_to_explain)
        shap_values = explainer.shap_values(X_sample)

        # Summary plot
        fig, ax = plt.subplots(figsize=(12, 8))
        feature_names = FEATURE_COLUMNS

        # For multi-class, shap_values is a list
        if isinstance(shap_values, list):
            # Use class with highest mean absolute SHAP
            shap_to_plot = shap_values[0]
            for sv in shap_values[1:]:
                if np.abs(sv).mean() > np.abs(shap_to_plot).mean():
                    shap_to_plot = sv
        else:
            shap_to_plot = shap_values

        plt.figure(figsize=(12, 8))
        shap.summary_plot(
            shap_to_plot,
            X_sample,
            feature_names=feature_names,
            show=False,
            max_display=20
        )
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, 'shap_summary.png'), dpi=150, bbox_inches='tight')
        plt.close('all')

        elapsed = time.time() - start
        print(f"  SHAP summary plot saved")
        print(f"  Done in {elapsed:.1f}s")

    except Exception as e:
        print(f"  [WARN] SHAP explanations failed: {e}")


def save_artifacts(best_model, best_name, best_metrics, all_metrics, cv_scores, df):
    """Save model, metadata, and metrics."""
    print("\n" + "=" * 60)
    print("STEP 9: Saving Artifacts")
    print("=" * 60)
    start = time.time()

    # Save model
    model_path = os.path.join(MODELS_DIR, 'xgb_model.pkl')
    joblib.dump(best_model, model_path)
    print(f"  Model saved to: {model_path}")

    # Save metadata
    metadata = {
        'feature_columns': FEATURE_COLUMNS,
        'label_map': LABEL_MAP,
        'test_f1': float(best_metrics['f1_macro']),
        'test_auc': float(best_metrics['roc_auc_ovr']) if best_metrics['roc_auc_ovr'] else None,
        'model_type': best_name,
        'districts': sorted(df['district'].unique().tolist()),
        'trained_on': datetime.datetime.now().isoformat()
    }
    metadata_path = os.path.join(MODELS_DIR, 'metadata.pkl')
    joblib.dump(metadata, metadata_path)
    print(f"  Metadata saved to: {metadata_path}")

    # Save metrics.json
    metrics_json = {
        'best_model': best_name,
        'best_f1_macro': float(best_metrics['f1_macro']),
        'best_accuracy': float(best_metrics['accuracy']),
        'best_roc_auc_ovr': float(best_metrics['roc_auc_ovr']) if best_metrics['roc_auc_ovr'] else None,
        'classification_report': best_metrics['classification_report'],
        'per_class_auc': best_metrics.get('per_class_auc', {}),
        'confusion_matrix': best_metrics['confusion_matrix'],
        'cv_f1_scores': cv_scores.tolist() if cv_scores is not None else [],
        'cv_f1_mean': float(cv_scores.mean()) if cv_scores is not None else None,
        'cv_f1_std': float(cv_scores.std()) if cv_scores is not None else None,
        'all_model_scores': {}
    }

    for model_name, metrics in all_metrics.items():
        metrics_json['all_model_scores'][model_name] = {
            'accuracy': float(metrics['accuracy']),
            'f1_macro': float(metrics['f1_macro']),
            'roc_auc_ovr': float(metrics['roc_auc_ovr']) if metrics['roc_auc_ovr'] else None,
            'per_class': metrics['per_class']
        }

    metrics_path = os.path.join(MODELS_DIR, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics_json, f, indent=2)
    print(f"  Metrics saved to: {metrics_path}")

    elapsed = time.time() - start
    print(f"  Done in {elapsed:.1f}s")

    return model_path, metadata_path, metrics_path


def main():
    """Main training pipeline."""
    total_start = time.time()

    print("=" * 60)
    print("  EARLY WARNING SYSTEM - MODEL TRAINING")
    print("  Tamil Nadu Disease Outbreak Risk Prediction")
    print("=" * 60)
    print(f"  Started: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Project Root: {PROJECT_ROOT}")

    # Step 1: Load data
    df = load_data()

    # Step 2: Split data
    X_train, X_test, y_train, y_test = split_data(df)

    # Step 3: SMOTE
    X_train_smote, y_train_smote = apply_smote(X_train, y_train)

    # Step 4-5: Train and evaluate
    models, all_metrics, best_name, best_model, best_metrics = train_all_models(
        X_train_smote, y_train_smote, X_test, y_test
    )

    # Step 6: Cross-validation
    cv_scores = cross_validate_best(best_model, X_train_smote, y_train_smote, best_name)

    # Step 7: Plots
    generate_plots(all_metrics, best_model, best_name, best_metrics, X_train_smote, y_train_smote, y_test)

    # Step 8: SHAP
    generate_shap_explanations(best_model, X_test, best_name)

    # Step 9: Save
    save_artifacts(best_model, best_name, best_metrics, all_metrics, cv_scores, df)

    # Final summary
    total_elapsed = time.time() - total_start
    print("\n" + "=" * 60)
    print("  TRAINING COMPLETE")
    print("=" * 60)
    print(f"  Best Model:    {best_name}")
    print(f"  Test F1 Macro: {best_metrics['f1_macro']:.4f}")
    print(f"  Test Accuracy: {best_metrics['accuracy']:.4f}")
    auc_str = f"{best_metrics['roc_auc_ovr']:.4f}" if best_metrics['roc_auc_ovr'] else "N/A"
    print(f"  Test ROC AUC:  {auc_str}")
    print(f"  CV F1 Mean:    {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print(f"  Total Time:    {total_elapsed:.1f}s")
    print("=" * 60)


if __name__ == '__main__':
    main()
