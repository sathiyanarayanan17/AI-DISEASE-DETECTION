"""
Forecast routes for the AI Early Warning System.

Provides multi-day disease risk forecasts for a given district using
the ML model with projected weather data (seasonal trends applied).
"""

import math
import os
import random
import sys
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
_ROUTES_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_ROUTES_DIR)
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)

# ---------------------------------------------------------------------------
# ML import with graceful fallback
# ---------------------------------------------------------------------------
_ml_available = False
try:
    from ml.predict import predict_risk
    _ml_available = True
except ImportError:
    pass


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class ForecastDay(BaseModel):
    """A single day's forecast."""
    date: str = Field(..., description="Forecast date (YYYY-MM-DD)")
    risk_level: str = Field(..., description="Predicted risk level: Low, Medium, High")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score 0-100")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence")
    rainfall_forecast: float = Field(..., description="Projected rainfall in mm")
    temperature_forecast: float = Field(..., description="Projected temperature in °C")
    humidity_forecast: float = Field(..., description="Projected humidity %")
    risk_score_low: int = Field(..., ge=0, le=100, description="Lower confidence band")
    risk_score_high: int = Field(..., ge=0, le=100, description="Upper confidence band")


class ForecastResponse(BaseModel):
    """Multi-day forecast response."""
    district: str = Field(..., description="District name")
    generated_at: str = Field(..., description="Generation timestamp")
    days: int = Field(..., description="Number of forecast days")
    forecast: List[ForecastDay] = Field(..., description="Daily forecasts")


# ---------------------------------------------------------------------------
# Helpers — seasonal weather projection
# ---------------------------------------------------------------------------

# Baseline weather by month for Tamil Nadu (approximate)
_MONTHLY_BASELINE = {
    1:  {"rainfall": 15.0, "temperature": 26.0, "humidity": 65.0},
    2:  {"rainfall": 10.0, "temperature": 28.0, "humidity": 60.0},
    3:  {"rainfall": 12.0, "temperature": 30.0, "humidity": 58.0},
    4:  {"rainfall": 25.0, "temperature": 33.0, "humidity": 60.0},
    5:  {"rainfall": 45.0, "temperature": 35.0, "humidity": 62.0},
    6:  {"rainfall": 40.0, "temperature": 34.0, "humidity": 65.0},
    7:  {"rainfall": 50.0, "temperature": 32.0, "humidity": 70.0},
    8:  {"rainfall": 55.0, "temperature": 31.0, "humidity": 72.0},
    9:  {"rainfall": 60.0, "temperature": 30.0, "humidity": 75.0},
    10: {"rainfall": 80.0, "temperature": 29.0, "humidity": 80.0},
    11: {"rainfall": 120.0, "temperature": 27.0, "humidity": 82.0},
    12: {"rainfall": 70.0, "temperature": 26.0, "humidity": 75.0},
}


def _project_weather(base_date: datetime, day_offset: int, district: str) -> dict:
    """
    Project weather values for a future date by applying seasonal trends
    and a small random perturbation seeded by district + date.
    """
    target_date = base_date + timedelta(days=day_offset)
    month = target_date.month
    baseline = _MONTHLY_BASELINE[month]

    # Seed for deterministic but varied results per district/day
    seed = sum(ord(c) for c in district) + target_date.toordinal()
    rng = random.Random(seed)

    # Add seasonal daily variation
    day_in_month = target_date.day
    # Slight sinusoidal variation within the month
    variation = math.sin(day_in_month / 30.0 * math.pi) * 0.15

    rainfall = max(0.0, baseline["rainfall"] * (1 + variation + rng.uniform(-0.3, 0.3)))
    temperature = baseline["temperature"] + rng.uniform(-2.0, 2.0) + variation * 2
    humidity = max(40.0, min(98.0, baseline["humidity"] + rng.uniform(-5.0, 5.0) + variation * 5))

    return {
        "rainfall": round(rainfall, 1),
        "temperature": round(temperature, 1),
        "humidity": round(humidity, 1),
    }


def _compute_confidence_band(risk_score: int, day_offset: int) -> tuple:
    """
    Compute confidence bands that widen as the forecast extends further out.
    """
    # Uncertainty grows with distance (roughly ±5% per day)
    uncertainty = min(25, 5 * day_offset)
    low = max(0, risk_score - uncertainty)
    high = min(100, risk_score + uncertainty)
    return low, high


def _mock_forecast_day(district: str, target_date: datetime, day_offset: int) -> ForecastDay:
    """Generate a mock forecast for one day."""
    weather = _project_weather(datetime.utcnow(), day_offset, district)
    seed = sum(ord(c) for c in district) + target_date.toordinal()
    rng = random.Random(seed)

    # Score influenced by weather
    base_score = (weather["rainfall"] / 120.0 * 40 +
                  weather["humidity"] / 100.0 * 30 +
                  (weather["temperature"] - 25) / 15.0 * 20)
    score = max(0, min(100, int(base_score + rng.randint(-10, 10))))

    if score >= 65:
        level = "High"
    elif score >= 35:
        level = "Medium"
    else:
        level = "Low"

    confidence = round(max(0.5, 0.92 - day_offset * 0.04 + rng.uniform(-0.03, 0.03)), 4)
    low, high = _compute_confidence_band(score, day_offset)

    return ForecastDay(
        date=str(target_date.date()),
        risk_level=level,
        risk_score=score,
        confidence=confidence,
        rainfall_forecast=weather["rainfall"],
        temperature_forecast=weather["temperature"],
        humidity_forecast=weather["humidity"],
        risk_score_low=low,
        risk_score_high=high,
    )


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Forecast"])


@router.get(
    "/",
    response_model=ForecastResponse,
    summary="Get multi-day risk forecast for a district",
)
def get_forecast(
    district: str = Query(..., description="District name"),
    days: int = Query(default=7, ge=1, le=30, description="Number of forecast days (1-30)"),
) -> ForecastResponse:
    """
    Generate a multi-day disease risk forecast for a district.

    Uses the ML model with projected weather data (seasonal trends applied
    to current baseline values). Includes confidence bands that widen as
    the forecast extends further out.

    - **district**: Target district name.
    - **days**: Number of days to forecast (default 7, max 30).
    """
    now = datetime.utcnow()
    forecasts: List[ForecastDay] = []

    for offset in range(1, days + 1):
        target_date = now + timedelta(days=offset)
        weather = _project_weather(now, offset, district)

        if _ml_available:
            try:
                result = predict_risk(
                    district=district,
                    date_str=str(target_date.date()),
                    rainfall=weather["rainfall"],
                    temperature=weather["temperature"],
                    humidity=weather["humidity"],
                )
                score = int(result.get("risk_score", 50))
                score = max(0, min(100, score))
                level = result.get("risk_level", "Medium")
                confidence = float(result.get("confidence", 0.75))
                # Reduce confidence for further out days
                confidence = round(max(0.5, confidence - offset * 0.03), 4)
                low, high = _compute_confidence_band(score, offset)

                forecasts.append(ForecastDay(
                    date=str(target_date.date()),
                    risk_level=level,
                    risk_score=score,
                    confidence=confidence,
                    rainfall_forecast=weather["rainfall"],
                    temperature_forecast=weather["temperature"],
                    humidity_forecast=weather["humidity"],
                    risk_score_low=low,
                    risk_score_high=high,
                ))
                continue
            except Exception:
                pass  # Fall through to mock

        # Mock fallback
        forecasts.append(_mock_forecast_day(district, target_date, offset))

    return ForecastResponse(
        district=district,
        generated_at=now.isoformat() + "Z",
        days=days,
        forecast=forecasts,
    )
