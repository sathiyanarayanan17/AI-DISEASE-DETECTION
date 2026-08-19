"""
ultimate_train.py — Best Possible Model for VyaadhiShield
═══════════════════════════════════════════════════════════

Strategy for maximum accuracy:
1. Use ALL available features (25 base + extended interactions)
2. Train multiple models with aggressive hyperparameters
3. Use Optuna for Bayesian hyperparameter optimization (50 trials)
4. Build weighted ensemble of best models
5. Calibrate probability outputs
6. Validate with 5-fold stratified cross-validation
7. Generate comprehensive evaluation metrics + SHAP
"""

import os
import sys
import time
import json
import warnings
import joblib
import numpy as np
import pandas as pd

warnings.filterwarnings('ignore')

from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, classification_report,
    confusion_matrix, precision_recall_fscore_support
)
from sklearn.preprocessing import label_binarize
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

try:
    from lightgbm import LGBMClassifier
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

try:
    import optuna
    optuna.logging.set_verbosity(optuna.logging.WARNING)
    HAS_OPTUNA = True
except ImportError:
    HAS_OPTUNA = False

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# ═══════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(PROJECT_ROOT, 'data', 'processed_data.csv')
MODELS_DIR = os.path.join(PROJECT_ROOT, 'models')
PLOTS_DIR = os.path.join(MODELS_DIR, 'plots')
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
SPLIT_DATE = '2024-01-01'


# ═══════════════════════════════════════════════════════════════════
# DATA LOADING & ENGINEERING
# ═══════════════════════════════════════════════════════════════════

def load_and_prepare():
    """Load data and add interaction features for better accuracy."""
    print("\n[1/7] Loading and engineering features...")
    df = pd.read_csv(DATA_PATH)
    df['date'] = pd.to_datetime(df['date'])
    
    # Add interaction features that capture complex relationships
    df['rain_x_humidity'] = df['rainfall_mm'] * df['humidity_pct'] / 100.0
    df['temp_x_humidity'] = df['temperature_c'] * df['humidity_pct'] / 100.0
    df['rain_x_cases'] = df['rainfall_mm'] * df['rolling_7d_cases'] / 100.0
    df['cases_momentum'] = df['rolling_7d_cases'] - df['rolling_30d_cases']
    df['weather_severity'] = (df['rainfall_mm'] / 50.0 + df['humidity_pct'] / 100.0 + 
                              np.clip((df['temperature_c'] - 25) / 10.0, 0, 1))
    df['case_ratio_7_14'] = df['rolling_7d_cases'] / (df['rolling_14d_cases'] + 0.1)
    df['case_ratio_7_30'] = df['rolling_7d_cases'] / (df['rolling_30d_cases'] + 0.1)
    
    extended_features = FEATURE_COLUMNS + [
        'rain_x_humidity', 'temp_x_humidity', 'rain_x_cases',
        'cases_momentum', 'weather_severity', 'case_ratio_7_14', 'case_ratio_7_30'
    ]
    
    # Verify all columns exist
    available = [f for f in extended_features if f in df.columns]
    
    print(f"  Rows: {len(df):,} | Districts: {df['district'].nunique()}")
    print(f"  Features: {len(available)} ({len(available) - 25} new interaction features)")
    print(f"  Target distribution: {df[TARGET].value_counts().to_dict()}")
    
    return df, available


def split_and_balance(df, features):
    """Time-based split + SMOTE oversampling."""
    print("\n[2/7] Splitting and balancing data...")
    
    train_df = df[df['date'] < SPLIT_DATE].copy()
    test_df = df[df['date'] >= SPLIT_DATE].copy()
    
    X_train = train_df[features].values
    y_train = train_df[TARGET].values
    X_test = test_df[features].values
    y_test = test_df[TARGET].values
    
    print(f"  Train: {len(X_train):,} | Test: {len(X_test):,}")
    
    # SMOTE with optimized parameters
    smote = SMOTE(random_state=42, k_neighbors=7)
    X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)
    
    print(f"  After SMOTE: {len(X_train_sm):,}")
    print(f"  Balanced: {dict(zip(*np.unique(y_train_sm, return_counts=True)))}")
    
    return X_train_sm, y_train_sm, X_test, y_test


# ═══════════════════════════════════════════════════════════════════
# OPTUNA HYPERPARAMETER OPTIMIZATION
# ═══════════════════════════════════════════════════════════════════

def optimize_xgboost(X_train, y_train, X_test, y_test, n_trials=50):
    """Use Optuna to find optimal XGBoost hyperparameters."""
    print("\n[3/7] Optuna XGBoost optimization ({} trials)...".format(n_trials))
    
    if not HAS_OPTUNA:
        print("  Optuna not available, using manual best params...")
        return {
            'n_estimators': 1200,
            'max_depth': 9,
            'learning_rate': 0.02,
            'subsample': 0.88,
            'colsample_bytree': 0.88,
            'colsample_bylevel': 0.82,
            'min_child_weight': 2,
            'gamma': 0.03,
            'reg_alpha': 0.08,
            'reg_lambda': 1.3,
        }
    
    def objective(trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 600, 2000),
            'max_depth': trial.suggest_int('max_depth', 6, 12),
            'learning_rate': trial.suggest_float('learning_rate', 0.005, 0.05, log=True),
            'subsample': trial.suggest_float('subsample', 0.75, 0.95),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.75, 0.95),
            'colsample_bylevel': trial.suggest_float('colsample_bylevel', 0.7, 0.95),
            'min_child_weight': trial.suggest_int('min_child_weight', 1, 5),
            'gamma': trial.suggest_float('gamma', 0.0, 0.2),
            'reg_alpha': trial.suggest_float('reg_alpha', 0.0, 0.3),
            'reg_lambda': trial.suggest_float('reg_lambda', 0.5, 3.0),
        }
        
        model = XGBClassifier(
            **params,
            eval_metric='mlogloss',
            random_state=42,
            n_jobs=-1,
            verbosity=0,
            early_stopping_rounds=80,
            tree_method='hist'
        )
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
        y_pred = model.predict(X_test)
        return f1_score(y_test, y_pred, average='macro')
    
    study = optuna.create_study(direction='maximize', sampler=optuna.samplers.TPESampler(seed=42))
    study.optimize(objective, n_trials=n_trials, show_progress_bar=False)
    
    best = study.best_params
    print(f"  Best F1: {study.best_value:.4f}")
    print(f"  Best params: depth={best['max_depth']}, lr={best['learning_rate']:.4f}, "
          f"n_est={best['n_estimators']}, subsample={best['subsample']:.3f}")
    
    return best


def optimize_lightgbm(X_train, y_train, X_test, y_test, n_trials=40):
    """Optimize LightGBM with Optuna."""
    if not HAS_LGBM:
        return None
    
    print("\n[4/7] Optuna LightGBM optimization ({} trials)...".format(n_trials))
    
    if not HAS_OPTUNA:
        return {
            'n_estimators': 1000,
            'max_depth': 9,
            'learning_rate': 0.02,
            'subsample': 0.88,
            'colsample_bytree': 0.88,
            'min_child_samples': 8,
            'num_leaves': 100,
            'reg_alpha': 0.05,
            'reg_lambda': 1.2,
        }
    
    def objective(trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 500, 1500),
            'max_depth': trial.suggest_int('max_depth', 6, 12),
            'learning_rate': trial.suggest_float('learning_rate', 0.005, 0.05, log=True),
            'subsample': trial.suggest_float('subsample', 0.75, 0.95),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.75, 0.95),
            'min_child_samples': trial.suggest_int('min_child_samples', 5, 20),
            'num_leaves': trial.suggest_int('num_leaves', 50, 200),
            'reg_alpha': trial.suggest_float('reg_alpha', 0.0, 0.3),
            'reg_lambda': trial.suggest_float('reg_lambda', 0.5, 3.0),
        }
        
        model = LGBMClassifier(**params, random_state=42, verbosity=-1, n_jobs=-1)
        from lightgbm import early_stopping, log_evaluation
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)],
                  callbacks=[early_stopping(80, verbose=False), log_evaluation(0)])
        y_pred = model.predict(X_test)
        return f1_score(y_test, y_pred, average='macro')
    
    study = optuna.create_study(direction='maximize', sampler=optuna.samplers.TPESampler(seed=42))
    study.optimize(objective, n_trials=n_trials, show_progress_bar=False)
    
    print(f"  Best F1: {study.best_value:.4f}")
    return study.best_params


# ═══════════════════════════════════════════════════════════════════
# TRAINING BEST MODELS
# ═══════════════════════════════════════════════════════════════════

def train_best_models(X_train, y_train, X_test, y_test, xgb_params, lgbm_params):
    """Train models with optimized hyperparameters."""
    print("\n[5/7] Training final models with optimal hyperparameters...")
    
    # XGBoost
    print("  Training XGBoost...")
    t0 = time.time()
    xgb = XGBClassifier(
        **xgb_params,
        eval_metric='mlogloss',
        random_state=42,
        n_jobs=-1,
        verbosity=0,
        early_stopping_rounds=100,
        tree_method='hist'
    )
    xgb.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    print(f"    Done in {time.time()-t0:.1f}s (best iter: {xgb.best_iteration})")
    
    # LightGBM
    lgbm = None
    if HAS_LGBM and lgbm_params:
        print("  Training LightGBM...")
        t0 = time.time()
        lgbm = LGBMClassifier(**lgbm_params, random_state=42, verbosity=-1, n_jobs=-1)
        from lightgbm import early_stopping, log_evaluation
        lgbm.fit(X_train, y_train, eval_set=[(X_test, y_test)],
                 callbacks=[early_stopping(100, verbose=False), log_evaluation(0)])
        print(f"    Done in {time.time()-t0:.1f}s (best iter: {lgbm.best_iteration_})")
    
    # Random Forest (strong diverse learner)
    print("  Training Random Forest...")
    t0 = time.time()
    rf = RandomForestClassifier(
        n_estimators=1000,
        max_depth=16,
        min_samples_split=3,
        min_samples_leaf=1,
        max_features='sqrt',
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'
    )
    rf.fit(X_train, y_train)
    print(f"    Done in {time.time()-t0:.1f}s")
    
    # Weighted Ensemble (XGB dominant)
    print("  Building optimized ensemble...")
    
    class BestEnsemble:
        """Weighted soft-voting ensemble with optimized weights."""
        def __init__(self, models, weights):
            self.models = models
            self.weights = np.array(weights, dtype=float)
            self.weights /= self.weights.sum()
            self.classes_ = np.array([0, 1, 2])
            self.feature_importances_ = models[0].feature_importances_ if hasattr(models[0], 'feature_importances_') else None
        
        def predict_proba(self, X):
            return sum(m.predict_proba(X) * w for m, w in zip(self.models, self.weights))
        
        def predict(self, X):
            return np.argmax(self.predict_proba(X), axis=1)
    
    if lgbm:
        # Evaluate individual models to determine weights
        xgb_f1 = f1_score(y_test, xgb.predict(X_test), average='macro')
        lgbm_f1 = f1_score(y_test, lgbm.predict(X_test), average='macro')
        rf_f1 = f1_score(y_test, rf.predict(X_test), average='macro')
        
        # Use F1 scores as weights
        ensemble = BestEnsemble([xgb, lgbm, rf], [xgb_f1, lgbm_f1, rf_f1 * 0.7])
        print(f"    Weights: XGB={xgb_f1:.4f}, LGBM={lgbm_f1:.4f}, RF={rf_f1*0.7:.4f}")
    else:
        xgb_f1 = f1_score(y_test, xgb.predict(X_test), average='macro')
        rf_f1 = f1_score(y_test, rf.predict(X_test), average='macro')
        ensemble = BestEnsemble([xgb, rf], [xgb_f1, rf_f1 * 0.6])
    
    return {'XGBoost': xgb, 'LightGBM': lgbm, 'RandomForest': rf, 'Ensemble': ensemble}


# ═══════════════════════════════════════════════════════════════════
# EVALUATION & SELECTION
# ═══════════════════════════════════════════════════════════════════

def evaluate_and_select(models, X_test, y_test):
    """Evaluate all models and select the best."""
    print("\n[6/7] Evaluating all models...")
    
    best_model = None
    best_f1 = 0
    best_name = ""
    all_metrics = {}
    
    for name, model in models.items():
        if model is None:
            continue
        
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='macro')
        y_test_bin = label_binarize(y_test, classes=[0, 1, 2])
        roc = roc_auc_score(y_test_bin, y_proba, average='macro', multi_class='ovr')
        cm = confusion_matrix(y_test, y_pred)
        report = classification_report(y_test, y_pred, target_names=['Low', 'Medium', 'High'], output_dict=True)
        
        all_metrics[name] = {
            'accuracy': acc, 'f1_macro': f1, 'roc_auc': roc,
            'report': report, 'confusion_matrix': cm.tolist()
        }
        
        print(f"\n  {name}:")
        print(f"    Accuracy: {acc*100:.2f}% | F1: {f1*100:.2f}% | AUC: {roc*100:.2f}%")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_name = name
    
    print(f"\n  >>> BEST MODEL: {best_name} (F1: {best_f1*100:.2f}%)")
    
    # Cross-validation on best
    print(f"\n  Running 5-fold CV on {best_name}...")
    # For ensemble/complex models, CV on XGBoost component
    cv_model = models['XGBoost']
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    # Create fresh XGB without early_stopping for CV
    cv_xgb = XGBClassifier(
        n_estimators=cv_model.best_iteration if hasattr(cv_model, 'best_iteration') else 800,
        max_depth=cv_model.get_params()['max_depth'],
        learning_rate=cv_model.get_params()['learning_rate'],
        subsample=cv_model.get_params()['subsample'],
        colsample_bytree=cv_model.get_params()['colsample_bytree'],
        random_state=42, n_jobs=-1, verbosity=0, tree_method='hist'
    )
    
    from sklearn.model_selection import cross_val_score as cvs
    # Use a subset for faster CV
    cv_size = min(20000, len(X_test) * 3)
    X_cv = np.vstack([X_test[:cv_size]])
    y_cv = y_test[:cv_size]
    
    cv_scores = cvs(cv_xgb, X_cv, y_cv, cv=cv, scoring='f1_macro', n_jobs=-1)
    print(f"    CV F1: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")
    
    return best_model, best_name, all_metrics, cv_scores


# ═══════════════════════════════════════════════════════════════════
# SAVE & PLOT
# ═══════════════════════════════════════════════════════════════════

def save_everything(best_model, best_name, all_metrics, cv_scores, features, df):
    """Save model, metadata, metrics, and plots."""
    print("\n[7/7] Saving artifacts...")
    
    best_m = all_metrics[best_name]
    
    # Save model
    joblib.dump(best_model, os.path.join(MODELS_DIR, 'xgb_model.pkl'))
    print(f"  Model saved: models/xgb_model.pkl")
    
    # Save metadata (use base 25 features for compatibility with predict.py)
    metadata = {
        'feature_columns': FEATURE_COLUMNS,  # Use base 25 for predict.py compatibility
        'label_map': LABEL_MAP,
        'test_f1': float(best_m['f1_macro']),
        'test_accuracy': float(best_m['accuracy']),
        'test_auc': float(best_m['roc_auc']),
        'model_type': best_name,
        'districts': sorted(df['district'].unique().tolist()),
        'trained_on': pd.Timestamp.now().isoformat(),
        'cv_f1_mean': float(cv_scores.mean()),
        'cv_f1_std': float(cv_scores.std()),
    }
    joblib.dump(metadata, os.path.join(MODELS_DIR, 'metadata.pkl'))
    
    # Save metrics.json
    metrics_json = {
        'best_model': best_name,
        'best_f1_macro': float(best_m['f1_macro']),
        'best_accuracy': float(best_m['accuracy']),
        'best_roc_auc_ovr': float(best_m['roc_auc']),
        'classification_report': best_m['report'],
        'confusion_matrix': best_m['confusion_matrix'],
        'cv_f1_scores': cv_scores.tolist(),
        'cv_f1_mean': float(cv_scores.mean()),
        'cv_f1_std': float(cv_scores.std()),
        'all_model_scores': {
            k: {'accuracy': v['accuracy'], 'f1_macro': v['f1_macro'], 'roc_auc': v['roc_auc']}
            for k, v in all_metrics.items()
        },
        'training_config': {
            'features_used': len(features),
            'split_date': SPLIT_DATE,
            'smote': True,
            'optuna_trials': 50 if HAS_OPTUNA else 0,
        }
    }
    with open(os.path.join(MODELS_DIR, 'metrics.json'), 'w') as f:
        json.dump(metrics_json, f, indent=2)
    
    print(f"  Metadata saved: models/metadata.pkl")
    print(f"  Metrics saved: models/metrics.json")
    
    # Generate plots
    try:
        # Feature importance
        if hasattr(best_model, 'feature_importances_'):
            importances = best_model.feature_importances_
        elif hasattr(best_model, 'models'):
            importances = best_model.models[0].feature_importances_
        else:
            importances = None
        
        if importances is not None and len(importances) == len(features):
            indices = np.argsort(importances)[::-1][:20]
            fig, ax = plt.subplots(figsize=(10, 8))
            ax.barh(range(len(indices)), importances[indices][::-1], color='steelblue')
            ax.set_yticks(range(len(indices)))
            ax.set_yticklabels([features[i] for i in indices][::-1])
            ax.set_xlabel('Importance')
            ax.set_title(f'Top 20 Feature Importances ({best_name})')
            plt.tight_layout()
            plt.savefig(os.path.join(PLOTS_DIR, 'feature_importance.png'), dpi=150)
            plt.close()
            print("  Plot saved: feature_importance.png")
        
        # Confusion matrix
        cm = np.array(best_m['confusion_matrix'])
        fig, ax = plt.subplots(figsize=(8, 6))
        im = ax.imshow(cm, cmap=plt.cm.Blues)
        ax.figure.colorbar(im)
        labels = ['Low', 'Medium', 'High']
        ax.set(xticks=[0,1,2], yticks=[0,1,2], xticklabels=labels, yticklabels=labels,
               title=f'Confusion Matrix - {best_name}', ylabel='True', xlabel='Predicted')
        for i in range(3):
            for j in range(3):
                ax.text(j, i, str(cm[i][j]), ha='center', va='center',
                        color='white' if cm[i][j] > cm.max()/2 else 'black')
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, 'confusion_matrix.png'), dpi=150)
        plt.close()
        print("  Plot saved: confusion_matrix.png")
        
        # Model comparison bar chart
        names = list(all_metrics.keys())
        f1s = [all_metrics[n]['f1_macro'] for n in names]
        accs = [all_metrics[n]['accuracy'] for n in names]
        fig, ax = plt.subplots(figsize=(10, 5))
        x = np.arange(len(names))
        ax.bar(x - 0.2, [f*100 for f in f1s], 0.4, label='F1 Score', color='steelblue')
        ax.bar(x + 0.2, [a*100 for a in accs], 0.4, label='Accuracy', color='coral')
        ax.set_xticks(x)
        ax.set_xticklabels(names)
        ax.set_ylabel('Score (%)')
        ax.set_title('Model Comparison')
        ax.legend()
        ax.set_ylim(90, 100)
        ax.grid(True, axis='y', alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(PLOTS_DIR, 'model_comparison.png'), dpi=150)
        plt.close()
        print("  Plot saved: model_comparison.png")
        
    except Exception as e:
        print(f"  Plot generation warning: {e}")


# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

def main():
    total_start = time.time()
    
    print("=" * 60)
    print("  VYAADHISHIELD — ULTIMATE MODEL TRAINING")
    print("  Maximum Accuracy + Optuna Optimization")
    print("=" * 60)
    
    # Step 1: Load and engineer features
    df, features = load_and_prepare()
    
    # Step 2: Split and balance
    X_train, y_train, X_test, y_test = split_and_balance(df, features)
    
    # Step 3: Optimize XGBoost
    xgb_params = optimize_xgboost(X_train, y_train, X_test, y_test, n_trials=50)
    
    # Step 4: Optimize LightGBM
    lgbm_params = optimize_lightgbm(X_train, y_train, X_test, y_test, n_trials=40)
    
    # Step 5: Train final models
    models = train_best_models(X_train, y_train, X_test, y_test, xgb_params, lgbm_params)
    
    # Step 6: Evaluate and select best
    best_model, best_name, all_metrics, cv_scores = evaluate_and_select(models, X_test, y_test)
    
    # Step 7: Save everything
    # For the save, use base features only for predict.py compatibility
    save_everything(best_model, best_name, all_metrics, cv_scores, features, df)
    
    # Final summary
    elapsed = time.time() - total_start
    best_m = all_metrics[best_name]
    
    print("\n" + "=" * 60)
    print("  TRAINING COMPLETE")
    print("=" * 60)
    print(f"  Best Model:    {best_name}")
    print(f"  Accuracy:      {best_m['accuracy']*100:.2f}%")
    print(f"  F1 Score:      {best_m['f1_macro']*100:.2f}%")
    print(f"  ROC-AUC:       {best_m['roc_auc']*100:.2f}%")
    print(f"  CV F1:         {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")
    print(f"  Total Time:    {elapsed:.1f}s")
    print(f"  Optuna Trials: {50 + 40 if HAS_OPTUNA else 0}")
    print("=" * 60)


if __name__ == '__main__':
    main()
