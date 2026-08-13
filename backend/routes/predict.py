"""
Prediction routes for the AI Early Warning System.

Provides endpoints to run single-district and batch risk predictions
using the ML model (with automatic fallback to mock data when the model
is not yet available).
"""

import random
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# ML import with graceful fallback
# ---------------------------------------------------------------------------
_ml_available = False
try:
    from ml.predict import predict_risk  # noqa: F401
    _ml_available = True
except ImportError:
    pass


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class PredictionResponse(BaseModel):
    """A single district risk prediction result."""

    district: str = Field(..., description="Name of the district")
    date: str = Field(..., description="Prediction date (YYYY-MM-DD)")
    risk_level: str = Field(..., description="One of: Low, Medium, High")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score 0-100")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence [0, 1]")
    color: str = Field(..., description="UI display colour (hex)")
    recommendation: str = Field(..., description="Human-readable action recommendation")


class BatchPredictionItem(BaseModel):
    """A single item in a batch prediction request."""

    district: str
    date: Optional[str] = Field(default=None, description="YYYY-MM-DD; defaults to today")
    rainfall: float = Field(default=20.0, ge=0.0, description="Rainfall in mm")
    temperature: float = Field(default=30.0, description="Temperature in °C")
    humidity: float = Field(default=70.0, ge=0.0, le=100.0, description="Relative humidity %")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_RISK_META = {
    "Low": {
        "color": "#22c55e",
        "recommendation": "No immediate action required. Continue routine surveillance.",
    },
    "Medium": {
        "color": "#f59e0b",
        "recommendation": (
            "Increase monitoring frequency. Prepare resources and alert local health teams."
        ),
    },
    "High": {
        "color": "#ef4444",
        "recommendation": (
            "Immediate action required. Deploy rapid response teams and issue public advisories."
        ),
    },
}


def _mock_prediction(district: str, pred_date: str, rainfall: float,
                     temperature: float, humidity: float) -> PredictionResponse:
    """Generate a deterministic-ish mock prediction when the ML model is unavailable."""
    rng = random.Random(sum(ord(c) for c in district) + int(rainfall) + int(temperature))
    score = rng.randint(5, 95)
    confidence = round(rng.uniform(0.60, 0.95), 4)

    if score >= 65:
        level = "High"
    elif score >= 35:
        level = "Medium"
    else:
        level = "Low"

    meta = _RISK_META[level]
    return PredictionResponse(
        district=district,
        date=pred_date,
        risk_level=level,
        risk_score=score,
        confidence=confidence,
        color=meta["color"],
        recommendation=meta["recommendation"],
    )


def _run_prediction(district: str, pred_date: str, rainfall: float,
                    temperature: float, humidity: float) -> PredictionResponse:
    """Call the real ML model or fall back to mock predictions."""
    if _ml_available:
        try:
            from ml.predict import predict_risk  # local re-import to surface errors clearly
            result = predict_risk(
                district=district,
                date_str=pred_date,
                rainfall=rainfall,
                temperature=temperature,
                humidity=humidity,
            )
            # The ML model returns risk_score as int 0-100
            level = result.get("risk_level", "Low")
            score = int(result.get("risk_score", 0))
            confidence = float(result.get("confidence", 0.75))
            meta = _RISK_META.get(level, _RISK_META["Low"])
            return PredictionResponse(
                district=district,
                date=pred_date,
                risk_level=level,
                risk_score=max(0, min(100, score)),
                confidence=confidence,
                color=result.get("color", meta["color"]),
                recommendation=result.get("recommendation", meta["recommendation"]),
            )
        except Exception:
            # Model present but something went wrong — fall through to mock
            pass

    return _mock_prediction(district, pred_date, rainfall, temperature, humidity)


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Predictions"])


@router.get(
    "/",
    response_model=PredictionResponse,
    summary="Predict risk for a single district",
)
def get_prediction(
    district: str = Query(..., description="Name of the district to predict for"),
    date: str = Query(default=None, description="Date in YYYY-MM-DD format (default: today)"),
    rainfall: float = Query(default=20.0, ge=0.0, description="Rainfall in mm"),
    temperature: float = Query(default=30.0, description="Temperature in °C"),
    humidity: float = Query(default=70.0, ge=0.0, le=100.0, description="Relative humidity %"),
) -> PredictionResponse:
    """
    Return a risk prediction for a single district.

    - **district**: Target district name (case-sensitive).
    - **date**: Prediction date (YYYY-MM-DD). Defaults to today.
    - **rainfall**: Expected/recorded rainfall in millimetres.
    - **temperature**: Temperature in degrees Celsius.
    - **humidity**: Relative humidity as a percentage.
    """
    pred_date = date or str(datetime.utcnow().date())

    # Basic date validation
    try:
        datetime.strptime(pred_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=422, detail="date must be in YYYY-MM-DD format")

    return _run_prediction(district, pred_date, rainfall, temperature, humidity)


@router.post(
    "/batch",
    response_model=List[PredictionResponse],
    summary="Batch predict risk for multiple districts",
)
def post_batch_prediction(items: List[BatchPredictionItem]) -> List[PredictionResponse]:
    """
    Return risk predictions for a list of district/parameter combinations.

    The request body is a JSON **array** of objects, each with:
    - **district** (required)
    - **date** (optional, defaults to today)
    - **rainfall**, **temperature**, **humidity** (optional, use defaults if omitted)

    Example request body:
    ```json
    [
        {"district": "Chennai", "date": "2025-07-15", "rainfall": 45, "temperature": 31, "humidity": 88},
        {"district": "Madurai", "rainfall": 20, "temperature": 35, "humidity": 65}
    ]
    ```
    """
    if not items:
        raise HTTPException(status_code=422, detail="Request body must contain at least one item")

    today = str(datetime.utcnow().date())
    results: List[PredictionResponse] = []

    for item in items:
        pred_date = item.date or today
        try:
            datetime.strptime(pred_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid date '{pred_date}' for district '{item.district}'. Use YYYY-MM-DD.",
            )
        results.append(
            _run_prediction(item.district, pred_date, item.rainfall, item.temperature, item.humidity)
        )

    return results
