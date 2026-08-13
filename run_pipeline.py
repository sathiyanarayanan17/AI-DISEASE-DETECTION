# run_pipeline.py
# Tamil Nadu EarlyAlert - Full ML Pipeline
# Runs: generate data -> preprocess -> train model -> verify

import os
import sys
import time
import subprocess

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

STEPS = [
    ("Generate Tamil Nadu Synthetic Data (37 districts × 3 years)",
     os.path.join(PROJECT_ROOT, "data", "generate_sample_data.py")),
    ("Preprocess + Feature Engineering (25+ features)",
     os.path.join(PROJECT_ROOT, "data", "preprocess.py")),
    ("Train ML Models (XGBoost + Optuna + Ensemble)",
     os.path.join(PROJECT_ROOT, "ml", "train.py")),
]


def check_dependencies():
    """Check if required packages are installed."""
    required = ['pandas', 'numpy', 'xgboost', 'sklearn', 'joblib', 'matplotlib']
    optional = ['optuna', 'lightgbm', 'catboost', 'shap', 'imblearn']
    
    print("\n  Checking dependencies...")
    missing = []
    for pkg in required:
        try:
            __import__(pkg)
            print(f"    [OK] {pkg}")
        except ImportError:
            missing.append(pkg)
            print(f"    [X]  {pkg} (REQUIRED)")
    
    for pkg in optional:
        try:
            __import__(pkg)
            print(f"    [OK] {pkg}")
        except ImportError:
            print(f"    [~]  {pkg} (optional, will use fallback)")
    
    if missing:
        print(f"\n  WARNING: Missing required packages: {', '.join(missing)}")
        print(f"  Run: pip install {' '.join(missing)}")
        sys.exit(1)
    
    print("  All required packages available.\n")


def run_pipeline():
    print("")
    print("=" * 60)
    print("  Tamil Nadu EarlyAlert -- Full ML Pipeline")
    print("  AI-Based Early Warning System for Disease Outbreaks")
    print("=" * 60)
    print(f"  Project : {PROJECT_ROOT}")
    print(f"  Python  : {sys.executable}")
    print(f"  Version : {sys.version.split()[0]}")

    check_dependencies()

    overall = time.time()

    for i, (title, script_path) in enumerate(STEPS, 1):
        print("\n" + "-" * 60)
        print(f"  STEP {i}/{len(STEPS)} -- {title}")
        print("-" * 60)

        if not os.path.exists(script_path):
            print(f"  [X] Script not found: {script_path}")
            sys.exit(1)

        t = time.time()
        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=False,
            text=True,
            cwd=os.path.dirname(script_path),
        )

        elapsed = time.time() - t
        if result.returncode != 0:
            print(f"\n  [X] FAILED after {elapsed:.1f}s (exit code {result.returncode})")
            sys.exit(1)
        else:
            print(f"\n  [OK] Completed in {elapsed:.1f}s")

    total = round(time.time() - overall, 1)

    # Verify outputs
    print("\n" + "-" * 60)
    print("  VERIFICATION")
    print("-" * 60)
    
    expected_files = [
        ("models/xgb_model.pkl", "Trained model"),
        ("models/metadata.pkl", "Model metadata"),
        ("data/processed_data.csv", "Processed dataset"),
    ]
    
    all_ok = True
    for fpath, desc in expected_files:
        full = os.path.join(PROJECT_ROOT, fpath)
        if os.path.exists(full):
            size = os.path.getsize(full)
            print(f"  [OK] {desc}: {fpath} ({size:,} bytes)")
        else:
            print(f"  [X]  {desc}: {fpath} NOT FOUND")
            all_ok = False

    # Check for optional outputs
    optional_files = [
        "models/metrics.json",
        "models/feature_importance.png",
        "models/shap_summary.png",
        "models/model_comparison.png",
        "models/roc_curves.png",
        "models/learning_curves.png",
    ]
    
    opt_count = sum(1 for f in optional_files if os.path.exists(os.path.join(PROJECT_ROOT, f)))
    print(f"\n  Generated {opt_count}/{len(optional_files)} optional outputs (plots, metrics)")

    print("\n" + "=" * 60)
    if all_ok:
        print("  PIPELINE COMPLETE - SUCCESS")
    else:
        print("  PIPELINE COMPLETE WITH WARNINGS")
    print("=" * 60)
    print(f"  Total time: {total}s")
    print("")
    print("  Next steps:")
    print("  1. Start backend:")
    print("     cd backend")
    print("     pip install -r requirements.txt")
    print("     uvicorn main:app --reload --port 8000")
    print("")
    print("  2. Start frontend:")
    print("     cd frontend")
    print("     npm install")
    print("     npm start")
    print("")
    print("  3. Open: http://localhost:3000")


if __name__ == "__main__":
    run_pipeline()
