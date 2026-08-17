"""
predict.py
Inference module for the AI Early Warning System (Tamil Nadu).

Public API
----------
load_model()                            -> (model, metadata) or (None, None)
predict_risk(district, date_str,
             rainfall, temperature,
             humidity)                  -> dict
predict_all_districts(date_str)         -> list[dict]

Constants
---------
DISTRICTS       : list of 37 Tamil Nadu district names
DISTRICT_COORDS : dict  {district: [lat, lng]}
"""

import os
import math
import warnings
from datetime import datetime, date
from typing import Optional

import numpy as np

warnings.filterwarnings("ignore")

# -- Paths ------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "xgb_model.pkl")
META_PATH = os.path.join(MODELS_DIR, "metadata.pkl")

# -- District catalogue (37 Tamil Nadu districts) ---------------------------
DISTRICTS: list[str] = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Tiruppur",
    "Dindigul", "Thanjavur", "Sivagangai", "Kancheepuram", "Krishnagiri",
    "Dharmapuri", "Cuddalore", "Nagapattinam", "Villupuram", "Perambalur",
    "Ariyalur", "Karur", "Namakkal", "Ramanathapuram", "Virudhunagar",
    "Tiruvannamalai", "Tiruvarur", "Pudukkottai", "Nilgiris", "Kallakurichi",
    "Chengalpattu", "Tenkasi", "Mayiladuthurai", "Tirupattur", "Ranipet",
    "Kanyakumari", "Puducherry",
]

DISTRICT_COORDS: dict[str, list[float]] = {
    "Chennai":          [13.08, 80.27],
    "Coimbatore":       [11.00, 76.96],
    "Madurai":          [9.93, 78.12],
    "Tiruchirappalli":  [10.79, 78.70],
    "Salem":            [11.65, 78.16],
    "Tirunelveli":      [8.73, 77.70],
    "Vellore":          [12.92, 79.13],
    "Erode":            [11.34, 77.73],
    "Thoothukudi":      [8.76, 78.13],
    "Tiruppur":         [11.10, 77.34],
    "Dindigul":         [10.36, 77.97],
    "Thanjavur":        [10.79, 79.14],
    "Sivagangai":       [9.84, 78.48],
    "Kancheepuram":     [12.83, 79.70],
    "Krishnagiri":      [12.52, 78.22],
    "Dharmapuri":       [12.13, 78.16],
    "Cuddalore":        [11.75, 79.77],
    "Nagapattinam":     [10.76, 79.84],
    "Villupuram":       [11.94, 79.49],
    "Perambalur":       [11.23, 78.88],
    "Ariyalur":         [11.14, 79.08],
    "Karur":            [10.96, 78.08],
    "Namakkal":         [11.22, 78.17],
    "Ramanathapuram":   [9.37, 78.83],
    "Virudhunagar":     [9.58, 77.96],
    "Tiruvannamalai":   [12.22, 79.07],
    "Tiruvarur":        [10.77, 79.64],
    "Pudukkottai":      [10.38, 78.82],
    "Nilgiris":         [11.41, 76.69],
    "Kallakurichi":     [11.74, 78.96],
    "Chengalpattu":     [12.69, 79.98],
    "Tenkasi":          [8.96, 77.32],
    "Mayiladuthurai":   [11.10, 79.65],
    "Tirupattur":       [12.49, 78.57],
    "Ranipet":          [12.93, 79.33],
    "Kanyakumari":      [8.08, 77.55],
    "Puducherry":       [11.94, 79.83],
}

# -- Geography flags --------------------------------------------------------
COASTAL_DISTRICTS: set[str] = {
    "Chennai", "Cuddalore", "Nagapattinam", "Tiruvarur",
    "Ramanathapuram", "Thoothukudi", "Kancheepuram", "Chengalpattu",
    "Mayiladuthurai", "Villupuram", "Puducherry",
}

HILL_DISTRICTS: set[str] = {"Nilgiris"}

URBAN_DISTRICTS: set[str] = {
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur",
}

# -- Feature columns expected by the model ----------------------------------
FEATURE_COLUMNS: list[str] = [
    "rainfall_mm", "temperature_c", "humidity_pct",
    "rolling_7d_cases", "rolling_14d_cases", "rolling_30d_cases",
    "lag_7_cases", "lag_14_cases", "lag_21_cases",
    "case_trend_7d",
    "cholera_cases_7d_avg", "dengue_cases_7d_avg", "malaria_cases_7d_avg",
    "rainfall_7d_avg", "rainfall_14d_avg", "temp_7d_avg", "humidity_7d_avg",
    "month", "week_of_year", "day_of_year",
    "is_sw_monsoon", "is_ne_monsoon",
    "is_coastal", "is_urban", "is_hill",
]

# -- Risk catalogue ---------------------------------------------------------
LABEL_MAP: dict[int, str] = {0: "Low", 1: "Medium", 2: "High"}

RISK_COLORS: dict[str, str] = {
    "Low": "#22c55e",
    "Medium": "#f59e0b",
    "High": "#ef4444",
}

RECOMMENDATIONS: dict[str, str] = {
    "Low": "No immediate action required. Maintain routine surveillance.",
    "Medium": "Increase disease surveillance. Issue health advisory to local clinics.",
    "High": "Deploy rapid response team immediately. Issue public health emergency alert.",
}

# -- Cached model -----------------------------------------------------------
_cached_model = None
_cached_metadata = None


# -- Model loader -----------------------------------------------------------
def load_model():
    """
    Load XGBoost model and metadata from the models/ directory.

    Returns
    -------
    (model, metadata) on success, or (None, None) if files are missing.
    """
    global _cached_model, _cached_metadata

    if _cached_model is not None and _cached_metadata is not None:
        return _cached_model, _cached_metadata

    try:
        import joblib
        if not os.path.exists(MODEL_PATH) or not os.path.exists(META_PATH):
            return None, None
        _cached_model = joblib.load(MODEL_PATH)
        _cached_metadata = joblib.load(META_PATH)
        return _cached_model, _cached_metadata
    except Exception as exc:
        print(f"[predict] Warning: could not load model - {exc}")
        return None, None


# -- Seasonal averages (heuristic when real-time data is unavailable) -------
def _seasonal_values(district: str, day_of_year: int) -> dict:
    """
    Return approximate seasonal weather and case values for a district
    on the given day-of-year. These are rough heuristics used to fill
    rolling/lag features when live data is unavailable.
    """
    # Southwest monsoon signal (Jun-Sep, peaks around doy 213)
    sw_monsoon = max(0.0, math.sin(math.pi * (day_of_year - 150) / 120)) if 150 <= day_of_year <= 270 else 0.0
    # Northeast monsoon signal (Oct-Dec, peaks around doy 305)
    ne_monsoon = max(0.0, math.sin(math.pi * (day_of_year - 270) / 90)) if 270 <= day_of_year <= 360 else 0.0

    is_coastal = district in COASTAL_DISTRICTS
    is_hill = district in HILL_DISTRICTS
    is_urban = district in URBAN_DISTRICTS

    coastal_factor = 1.8 if is_coastal else 1.0
    hill_factor = 1.4 if is_hill else 1.0
    urban_factor = 1.5 if is_urban else 1.0

    # District-specific seed for variety (so not all districts get same prediction)
    district_hash = sum(ord(c) for c in district) % 100
    district_variance = (district_hash / 100.0) * 0.6 + 0.7  # range 0.7 to 1.3

    # Both monsoons contribute significantly
    monsoon_intensity = (sw_monsoon * 0.7 + ne_monsoon * 1.2) * coastal_factor * hill_factor * district_variance

    # Base rainfall even outside monsoon (TN always has some rain)
    base_rain = 5.0 + district_hash * 0.1
    rainfall = round(base_rain + monsoon_intensity * 25, 2)
    temperature = round(30 + 5 * math.sin(2 * math.pi * (day_of_year - 100) / 365), 1)
    if is_hill:
        temperature = round(temperature - 10, 1)
    humidity = round(min(98, 55 + 35 * monsoon_intensity + district_hash * 0.1), 1)

    # Case estimates - urban and coastal get more cases
    case_base = 5 + district_hash * 0.1  # base varies by district
    case_monsoon_factor = 1.0 + monsoon_intensity * 1.0
    case_urban_factor = 1.15 if is_urban else 1.0

    rolling_7d = round((case_base + rainfall * 0.2 + humidity * 0.05) * case_monsoon_factor * case_urban_factor, 2)
    rolling_14d = round(rolling_7d * 1.05, 2)
    rolling_30d = round(rolling_7d * 1.10, 2)
    lag_7 = round(rolling_7d * 0.85, 2)
    lag_14 = round(rolling_7d * 0.75, 2)
    lag_21 = round(rolling_7d * 0.65, 2)
    case_trend_7d = round(rolling_7d - lag_7, 2)

    # Disease-specific approximations
    cholera_avg = round(rolling_7d * 0.2, 2)
    dengue_avg = round(rolling_7d * 0.45, 2)
    malaria_avg = round(rolling_7d * 0.2, 2)

    rainfall_14d_avg = round(rainfall * 0.95, 2)

    return {
        "rainfall_mm": rainfall,
        "temperature_c": temperature,
        "humidity_pct": humidity,
        "rolling_7d_cases": rolling_7d,
        "rolling_14d_cases": rolling_14d,
        "rolling_30d_cases": rolling_30d,
        "lag_7_cases": lag_7,
        "lag_14_cases": lag_14,
        "lag_21_cases": lag_21,
        "case_trend_7d": case_trend_7d,
        "cholera_cases_7d_avg": cholera_avg,
        "dengue_cases_7d_avg": dengue_avg,
        "malaria_cases_7d_avg": malaria_avg,
        "rainfall_7d_avg": rainfall,
        "rainfall_14d_avg": rainfall_14d_avg,
        "temp_7d_avg": temperature,
        "humidity_7d_avg": humidity,
    }


# -- Core prediction --------------------------------------------------------
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
    district    : One of the 37 district names in DISTRICTS.
    date_str    : ISO date string, e.g. '2025-07-15'.
    rainfall    : Observed rainfall in mm.
    temperature : Temperature in degrees C.
    humidity    : Relative humidity percent.
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

    doy = parsed_date.timetuple().tm_yday
    month = parsed_date.month
    week_of_year = parsed_date.isocalendar()[1]

    # Load model lazily if not supplied
    model = _model
    metadata = _metadata
    if model is None or metadata is None:
        model, metadata = load_model()

    # Mock path: model not available
    if model is None:
        return _mock_prediction(district, date_str, rainfall, temperature, humidity, doy)

    # Determine feature columns from metadata or use default
    feature_columns = metadata.get("feature_columns", FEATURE_COLUMNS)

    # Build seasonal estimates for rolling/lag features
    seasonal = _seasonal_values(district, doy)

    # Geography flags
    is_coastal = 1 if district in COASTAL_DISTRICTS else 0
    is_urban = 1 if district in URBAN_DISTRICTS else 0
    is_hill = 1 if district in HILL_DISTRICTS else 0

    # Monsoon flags
    is_sw_monsoon = 1 if 152 <= doy <= 273 else 0  # Jun 1 - Sep 30
    is_ne_monsoon = 1 if 274 <= doy <= 365 or 1 <= doy <= 31 else 0  # Oct 1 - Dec 31

    feature_row: dict = {
        "rainfall_mm": rainfall,
        "temperature_c": temperature,
        "humidity_pct": humidity,
        "rolling_7d_cases": seasonal["rolling_7d_cases"],
        "rolling_14d_cases": seasonal["rolling_14d_cases"],
        "rolling_30d_cases": seasonal["rolling_30d_cases"],
        "lag_7_cases": seasonal["lag_7_cases"],
        "lag_14_cases": seasonal["lag_14_cases"],
        "lag_21_cases": seasonal["lag_21_cases"],
        "case_trend_7d": seasonal["case_trend_7d"],
        "cholera_cases_7d_avg": seasonal["cholera_cases_7d_avg"],
        "dengue_cases_7d_avg": seasonal["dengue_cases_7d_avg"],
        "malaria_cases_7d_avg": seasonal["malaria_cases_7d_avg"],
        "rainfall_7d_avg": (rainfall + seasonal["rainfall_7d_avg"]) / 2,
        "rainfall_14d_avg": (rainfall + seasonal["rainfall_14d_avg"]) / 2,
        "temp_7d_avg": (temperature + seasonal["temp_7d_avg"]) / 2,
        "humidity_7d_avg": (humidity + seasonal["humidity_7d_avg"]) / 2,
        "month": month,
        "week_of_year": week_of_year,
        "day_of_year": doy,
        "is_sw_monsoon": is_sw_monsoon,
        "is_ne_monsoon": is_ne_monsoon,
        "is_coastal": is_coastal,
        "is_urban": is_urban,
        "is_hill": is_hill,
    }

    X = np.array([[feature_row.get(c, 0) for c in feature_columns]], dtype=float)
    pred_class = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]

    risk_label = LABEL_MAP.get(pred_class, "Low")
    confidence = float(proba[pred_class])

    # risk_score: 0-100 scale
    # Low=0-33, Medium=34-66, High=67-100
    base_scores = {0: 15, 1: 50, 2: 85}
    score_range = {0: 33, 1: 32, 2: 33}
    risk_score = int(base_scores[pred_class] + (confidence - 0.5) * score_range[pred_class])
    risk_score = max(0, min(100, risk_score))

    return {
        "district": district,
        "date": date_str,
        "risk_level": risk_label,
        "risk_score": risk_score,
        "confidence": round(confidence, 4),
        "color": RISK_COLORS[risk_label],
        "recommendation": RECOMMENDATIONS[risk_label],
    }


# -- Batch: all districts ---------------------------------------------------
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


# -- Mock prediction (no model file) ----------------------------------------
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
    Intended for development/demo purposes only.
    """
    # Coastal and monsoon factors increase risk
    coastal_bonus = 5 if district in COASTAL_DISTRICTS else 0
    monsoon_bonus = 8 if (274 <= doy <= 365) else 0  # NE monsoon season

    score = rainfall * 0.5 + humidity * 0.3 + (temperature - 20) * 0.2 + coastal_bonus + monsoon_bonus

    if score > 30:
        level = "High"
        risk_score = int(min(100, 67 + (score - 30)))
    elif score > 15:
        level = "Medium"
        risk_score = int(min(66, 34 + (score - 15)))
    else:
        level = "Low"
        risk_score = int(max(0, score))

    return {
        "district": district,
        "date": date_str,
        "risk_level": level,
        "risk_score": risk_score,
        "confidence": 0.0,
        "color": RISK_COLORS[level],
        "recommendation": RECOMMENDATIONS[level],
    }


# -- Quick self-test --------------------------------------------------------
if __name__ == "__main__":
    print("=" * 60)
    print("  predict.py - self-test (Tamil Nadu 37 districts)")
    print("=" * 60)

    test_date = "2025-07-20"

    # Single district
    result = predict_risk("Chennai", test_date, rainfall=45.0, temperature=31.0, humidity=88.0)
    print(f"\nSingle prediction: {result}")

    # All districts
    print(f"\nBatch prediction for all {len(DISTRICTS)} districts on {test_date}...")
    all_preds = predict_all_districts(test_date)
    for p in all_preds:
        print(f"  {p['district']:<18s} | {p['risk_level']:6s} | score={p['risk_score']:3d} | {p['recommendation'][:50]}")

    print(f"\nTotal districts: {len(DISTRICTS)}")
    print("predict.py self-test complete.")
