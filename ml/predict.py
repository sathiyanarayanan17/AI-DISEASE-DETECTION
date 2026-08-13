"""
predict.py
Inference module for the AI Early Warning System.

Public API
----------
load_model()                            -> (model, metadata) or (None, None)
predict_risk(district, date_str,
             rainfall, temperature,
             humidity)                  -> dict
predict_all_districts(date_str)         -> list[dict]

Constants
---------
DISTRICTS       : list of 30 Indian city names
DISTRICT_COORDS : dict  {district: [lat, lng]}
"""

import os
import math
import warnings
from datetime import datetime, date
from typing import Optional

import numpy as np

warnings.filterwarnings("ignore")

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
MODELS_DIR   = os.path.join(PROJECT_ROOT, "models")
MODEL_PATH   = os.path.join(MODELS_DIR, "xgb_model.pkl")
META_PATH    = os.path.join(MODELS_DIR, "metadata.pkl")

# ── District catalogue ────────────────────────────────────────────────────────
DISTRICTS: list[str] = [
    "Chennai", "Mumbai", "Delhi", "Kolkata", "Bengaluru",
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Pimpri", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
    "Rajkot", "Kalyan", "Vasai", "Varanasi", "Srinagar",
]

DISTRICT_COORDS: dict[str, list[float]] = {
    "Chennai":        [13.08,  80.27],
    "Mumbai":         [19.07,  72.87],
    "Delhi":          [28.61,  77.20],
    "Kolkata":        [22.57,  88.36],
    "Bengaluru":      [12.97,  77.59],
    "Hyderabad":      [17.38,  78.48],
    "Pune":           [18.52,  73.85],
    "Ahmedabad":      [23.02,  72.57],
    "Jaipur":         [26.91,  75.79],
    "Lucknow":        [26.84,  80.94],
    "Kanpur":         [26.44,  80.33],
    "Nagpur":         [21.14,  79.08],
    "Indore":         [22.71,  75.85],
    "Thane":          [19.21,  72.97],
    "Bhopal":         [23.25,  77.40],
    "Visakhapatnam":  [17.68,  83.21],
    "Pimpri":         [18.62,  73.80],
    "Patna":          [25.59,  85.13],
    "Vadodara":       [22.30,  73.19],
    "Ghaziabad":      [28.66,  77.43],
    "Ludhiana":       [30.90,  75.85],
    "Agra":           [27.17,  78.01],
    "Nashik":         [19.99,  73.79],
    "Faridabad":      [28.40,  77.31],
    "Meerut":         [28.98,  77.70],
    "Rajkot":         [22.30,  70.78],
    "Kalyan":         [19.24,  73.13],
    "Vasai":          [19.36,  72.82],
    "Varanasi":       [25.31,  82.97],
    "Srinagar":       [34.08,  74.79],
}

# ── Risk catalogue ────────────────────────────────────────────────────────────
LABEL_MAP: dict[int, str] = {0: "Low", 1: "Medium", 2: "High"}

RISK_COLORS: dict[str, str] = {
    "Low":    "#2ECC71",   # green
    "Medium": "#F39C12",   # amber
    "High":   "#E74C3C",   # red
}

RECOMMENDATIONS: dict[str, str] = {
    "Low":    "No immediate action required. Maintain routine surveillance.",
    "Medium": "Increase disease surveillance. Issue health advisory to local clinics.",
    "High":   "Deploy rapid response team immediately. Issue public health emergency alert.",
}


# ── Model loader ──────────────────────────────────────────────────────────────
def load_model():
    """
    Load XGBoost model and metadata from the models/ directory.

    Returns
    -------
    (model, metadata) on success, or (None, None) if files are missing.
    """
    try:
        import joblib
        if not os.path.exists(MODEL_PATH) or not os.path.exists(META_PATH):
            return None, None
        model    = joblib.load(MODEL_PATH)
        metadata = joblib.load(META_PATH)
        return model, metadata
    except Exception as exc:
        print(f"[predict] Warning: could not load model – {exc}")
        return None, None


# ── Seasonal averages (used when real-time data is unavailable) ───────────────
def _seasonal_values(district: str, day_of_year: int) -> dict:
    """
    Return approximate seasonal weather / case values for a district on
    the given day-of-year.  These are rough heuristics, not real observations.
    """
    # Monsoon signal (peaks early August, doy ~213)
    monsoon = max(0.0, math.sin(math.pi * (day_of_year - 60) / 180))

    coastal_factor = {
        "Chennai": 1.4, "Mumbai": 1.8, "Kolkata": 1.5,
        "Visakhapatnam": 1.3, "Thane": 1.6, "Kalyan": 1.5,
        "Vasai": 1.5, "Pimpri": 1.2,
    }.get(district, 1.0)
    if district in ("Delhi", "Ghaziabad", "Faridabad", "Meerut",
                     "Agra", "Kanpur", "Lucknow", "Varanasi"):
        coastal_factor *= 0.8
    if district == "Srinagar":
        coastal_factor *= 0.4

    rainfall    = round(monsoon * 18 * coastal_factor, 2)
    temperature = round(28 + 8 * math.sin(2 * math.pi * (day_of_year - 60) / 365), 1)
    humidity    = round(min(98, 55 + 30 * monsoon), 1)

    # Simple rolling approximation: recent cases scale with rainfall × humidity
    rolling_7d  = round((rainfall * 0.4 + humidity * 0.15) * (2.5 if 152 <= day_of_year <= 304 else 1.0), 2)
    rolling_14d = rolling_7d * 1.05
    rolling_30d = rolling_7d * 1.10
    lag_7        = rolling_7d * 0.9
    lag_14       = rolling_7d * 0.8

    return {
        "rainfall_mm":     rainfall,
        "temperature_c":   temperature,
        "humidity_pct":    humidity,
        "rolling_7d_cases":  rolling_7d,
        "rolling_14d_cases": rolling_14d,
        "rolling_30d_cases": rolling_30d,
        "lag_7_cases":       lag_7,
        "lag_14_cases":      lag_14,
        "rainfall_7d_avg":   rainfall,
        "temp_7d_avg":       temperature,
        "humidity_7d_avg":   humidity,
    }


# ── Core prediction ───────────────────────────────────────────────────────────
def predict_risk(
    district: str,
    date_str: str,
    rainfall: float,
    temperature: float,
    humidity: float,
    *,
    _model=None,
    _metadata=None,
) -> dict:
    """
    Predict disease risk for one district on a specific date.

    Parameters
    ----------
    district    : One of the 30 city names in DISTRICTS.
    date_str    : ISO date string, e.g. '2025-07-15'.
    rainfall    : Observed rainfall in mm.
    temperature : Temperature in °C.
    humidity    : Relative humidity %.
    _model      : Pre-loaded model (optional, avoids repeated IO).
    _metadata   : Pre-loaded metadata (optional).

    Returns
    -------
    dict with keys:
        district, date, risk_level (str), risk_score (int 0-100),
        confidence (float 0-1), color (hex str), recommendation (str)
    """
    # Parse date
    try:
        parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        parsed_date = date.today()

    doy   = parsed_date.timetuple().tm_yday
    month = parsed_date.month

    # Load model lazily if not supplied
    model    = _model
    metadata = _metadata
    if model is None or metadata is None:
        model, metadata = load_model()

    # ── Mock path: model not available ────────────────────────────────────────
    if model is None:
        return _mock_prediction(district, date_str, rainfall, temperature, humidity, doy)

    feature_columns: list[str] = metadata["feature_columns"]

    # Build seasonal estimates for rolling / lag features we don't have live
    seasonal = _seasonal_values(district, doy)

    feature_row: dict = {
        "rainfall_mm":       rainfall,
        "temperature_c":     temperature,
        "humidity_pct":      humidity,
        "rolling_7d_cases":  seasonal["rolling_7d_cases"],
        "rolling_14d_cases": seasonal["rolling_14d_cases"],
        "rolling_30d_cases": seasonal["rolling_30d_cases"],
        "lag_7_cases":       seasonal["lag_7_cases"],
        "lag_14_cases":      seasonal["lag_14_cases"],
        "rainfall_7d_avg":   (rainfall + seasonal["rainfall_7d_avg"]) / 2,
        "temp_7d_avg":       (temperature + seasonal["temp_7d_avg"]) / 2,
        "humidity_7d_avg":   (humidity + seasonal["humidity_7d_avg"]) / 2,
        "month":             month,
        "day_of_year":       doy,
    }

    X = np.array([[feature_row[c] for c in feature_columns]], dtype=float)
    pred_class = int(model.predict(X)[0])
    proba      = model.predict_proba(X)[0]

    risk_label = LABEL_MAP.get(pred_class, "Low")
    confidence = float(proba[pred_class])

    # risk_score: 0-100 scale
    # Low=0-33, Medium=34-66, High=67-100
    base_scores = {0: 15, 1: 50, 2: 85}
    score_range = {0: 33, 1: 32, 2: 33}
    risk_score  = int(base_scores[pred_class] + (confidence - 0.5) * score_range[pred_class])
    risk_score  = max(0, min(100, risk_score))

    return {
        "district":       district,
        "date":           date_str,
        "risk_level":     risk_label,
        "risk_score":     risk_score,
        "confidence":     round(confidence, 4),
        "color":          RISK_COLORS[risk_label],
        "recommendation": RECOMMENDATIONS[risk_label],
    }


# ── Batch: all districts ──────────────────────────────────────────────────────
def predict_all_districts(date_str: str) -> list[dict]:
    """
    Predict risk for every district using average seasonal values.

    Parameters
    ----------
    date_str : ISO date string, e.g. '2025-07-15'.

    Returns
    -------
    list of prediction dicts (one per district in DISTRICTS order).
    """
    # Load once, reuse across all districts
    model, metadata = load_model()

    try:
        parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        parsed_date = date.today()

    doy = parsed_date.timetuple().tm_yday
    results = []

    for district in DISTRICTS:
        sv = _seasonal_values(district, doy)
        pred = predict_risk(
            district=district,
            date_str=date_str,
            rainfall=sv["rainfall_mm"],
            temperature=sv["temperature_c"],
            humidity=sv["humidity_pct"],
            _model=model,
            _metadata=metadata,
        )
        # Attach coordinates for map display
        pred["lat"] = DISTRICT_COORDS[district][0]
        pred["lng"] = DISTRICT_COORDS[district][1]
        results.append(pred)

    return results


# ── Mock prediction (no model file) ──────────────────────────────────────────
def _mock_prediction(
    district: str,
    date_str: str,
    rainfall: float,
    temperature: float,
    humidity: float,
    doy: int,
) -> dict:
    """
    Returns a rule-based heuristic when the trained model is absent.
    Intended for development / demo purposes only.
    """
    # Simple heuristic: high rainfall + humidity → higher risk
    score = rainfall * 0.5 + humidity * 0.3 + (temperature - 20) * 0.2
    if score > 30:
        level, risk_score = "High",   int(min(100, 67 + (score - 30)))
    elif score > 15:
        level, risk_score = "Medium", int(min(66, 34 + (score - 15)))
    else:
        level, risk_score = "Low",    int(max(0, score))

    return {
        "district":       district,
        "date":           date_str,
        "risk_level":     level,
        "risk_score":     risk_score,
        "confidence":     0.0,           # unknown without model
        "color":          RISK_COLORS[level],
        "recommendation": RECOMMENDATIONS[level],
        "_note":          "Mock prediction – model not loaded.",
    }


# ── Quick self-test ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("  predict.py – self-test")
    print("=" * 60)

    test_date = "2025-07-20"

    # Single district
    result = predict_risk("Chennai", test_date, rainfall=45.0, temperature=31.0, humidity=88.0)
    print(f"\nSingle prediction → {result}")

    # All districts
    print(f"\nBatch prediction for all {len(DISTRICTS)} districts on {test_date} …")
    all_preds = predict_all_districts(test_date)
    for p in all_preds:
        print(f"  {p['district']:<18s} | {p['risk_level']:6s} | score={p['risk_score']:3d} | {p['recommendation'][:50]}…")

    print("\n✓ predict.py self-test complete.")
