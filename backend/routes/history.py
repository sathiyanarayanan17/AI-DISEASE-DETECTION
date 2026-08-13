"""
History routes for the AI Early Warning System.

Provides historical prediction data for a given district by reading
processed_data.csv. Falls back to generated mock data if the CSV is
not yet available.
"""

import os
import random
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Path to the processed CSV  (backend/ -> ../data/processed_data.csv)
# ---------------------------------------------------------------------------
# __file__ is backend/routes/history.py
# Go up twice to get to backend/, then once more to get project root
_ROUTES_DIR = os.path.dirname(os.path.abspath(__file__))       # backend/routes/
_BACKEND_DIR = os.path.dirname(_ROUTES_DIR)                     # backend/
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)                   # early-warning-system/
_CSV_PATH = os.path.join(_PROJECT_ROOT, "data", "processed_data.csv")

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class HistoryRecord(BaseModel):
    """One day's historical record for a district."""

    date: str = Field(..., description="Date (YYYY-MM-DD)")
    risk_level: str = Field(..., description="One of: Low, Medium, High")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score 0-100")
    disease_cases: int = Field(..., ge=0, description="Reported disease cases")
    rainfall: float = Field(..., ge=0.0, description="Rainfall in mm")
    temperature: float = Field(..., description="Temperature in °C")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative humidity %")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _risk_from_score(score: int) -> str:
    if score >= 65:
        return "High"
    elif score >= 35:
        return "Medium"
    return "Low"


def _mock_history(district: str, days: int) -> List[HistoryRecord]:
    """Generate plausible mock historical data when CSV is unavailable."""
    records: List[HistoryRecord] = []
    today = datetime.utcnow().date()
    rng = random.Random(sum(ord(c) for c in district))

    for offset in range(days, 0, -1):
        record_date = today - timedelta(days=offset)
        score = rng.randint(5, 95)
        level = _risk_from_score(score)
        records.append(
            HistoryRecord(
                date=str(record_date),
                risk_level=level,
                risk_score=score,
                disease_cases=rng.randint(0, 150),
                rainfall=round(rng.uniform(0.0, 120.0), 2),
                temperature=round(rng.uniform(22.0, 42.0), 1),
                humidity=round(rng.uniform(40.0, 95.0), 1),
            )
        )
    return records


def _load_from_csv(district: str, days: int) -> Optional[List[HistoryRecord]]:
    """
    Load historical records from processed_data.csv, filtered by district
    and limited to the last *days* calendar days.

    Returns None if the CSV cannot be found; raises HTTPException for
    other errors.

    CSV column mapping:
    - rainfall_mm     -> rainfall
    - temperature_c   -> temperature
    - humidity_pct    -> humidity
    - total_cases     -> disease_cases
    - rolling_7d_cases -> used to compute risk_score (normalized 0-100)
    - risk_level      -> risk_level
    """
    if not os.path.exists(_CSV_PATH):
        return None

    try:
        import pandas as pd  # noqa: PLC0415  (deferred import)

        df = pd.read_csv(_CSV_PATH)

        # Normalise column names to lowercase with underscores
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

        # Filter by district (case-insensitive)
        if "district" not in df.columns:
            raise HTTPException(
                status_code=500, detail="CSV is missing a 'district' column."
            )

        df = df[df["district"].str.lower() == district.lower()]

        if df.empty:
            return []

        # Parse date column
        if "date" not in df.columns:
            raise HTTPException(
                status_code=500, detail="CSV is missing a 'date' column."
            )

        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])

        cutoff = datetime.utcnow().date() - timedelta(days=days)
        df = df[df["date"].dt.date >= cutoff]
        df = df.sort_values("date")

        if df.empty:
            return []

        # Compute risk_score from rolling_7d_cases (normalize to 0-100)
        if "rolling_7d_cases" in df.columns:
            max_rolling = df["rolling_7d_cases"].max()
            if max_rolling > 0:
                df["_risk_score"] = (df["rolling_7d_cases"] / max_rolling * 100).clip(0, 100).astype(int)
            else:
                df["_risk_score"] = 0
        else:
            df["_risk_score"] = 50  # default if column missing

        records: List[HistoryRecord] = []
        for _, row in df.iterrows():
            # Map CSV columns to response fields
            risk_score = int(row.get("_risk_score", 50))

            # Use CSV risk_level if available, otherwise compute from score
            risk_level = str(row.get("risk_level", "")) if "risk_level" in df.columns else ""
            if risk_level not in ("Low", "Medium", "High"):
                # risk_level in CSV might be numeric: 0=Low, 1=Medium, 2=High
                try:
                    level_int = int(float(risk_level))
                    risk_level = {0: "Low", 1: "Medium", 2: "High"}.get(level_int, _risk_from_score(risk_score))
                except (ValueError, TypeError):
                    risk_level = _risk_from_score(risk_score)

            # Column mappings: rainfall_mm, temperature_c, humidity_pct, total_cases
            rainfall = float(row["rainfall_mm"]) if "rainfall_mm" in df.columns and not pd.isna(row.get("rainfall_mm")) else 0.0
            temperature = float(row["temperature_c"]) if "temperature_c" in df.columns and not pd.isna(row.get("temperature_c")) else 30.0
            humidity = float(row["humidity_pct"]) if "humidity_pct" in df.columns and not pd.isna(row.get("humidity_pct")) else 70.0
            disease_cases = int(row["total_cases"]) if "total_cases" in df.columns and not pd.isna(row.get("total_cases")) else 0

            records.append(
                HistoryRecord(
                    date=str(row["date"].date()),
                    risk_level=risk_level,
                    risk_score=risk_score,
                    disease_cases=disease_cases,
                    rainfall=round(rainfall, 2),
                    temperature=round(temperature, 1),
                    humidity=round(humidity, 1),
                )
            )
        return records

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Error reading CSV: {exc}"
        ) from exc


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["History"])


@router.get(
    "/",
    response_model=List[HistoryRecord],
    summary="Get historical predictions for a district",
)
def get_history(
    district: str = Query(..., description="District name to retrieve history for"),
    days: int = Query(default=30, ge=1, le=365, description="Number of past days to return"),
) -> List[HistoryRecord]:
    """
    Return the last **N** days of prediction history for a given district.

    Data is loaded from `processed_data.csv`. If the CSV is not found,
    deterministic mock data is returned so the frontend always has data to display.

    - **district**: Target district name.
    - **days**: How many past calendar days to include (1–365, default 30).
    """
    records = _load_from_csv(district, days)

    if records is None:
        # CSV not found — return mock data
        return _mock_history(district, days)

    if len(records) == 0:
        # CSV exists but has no data for this district/period — still return mock
        return _mock_history(district, days)

    return records
