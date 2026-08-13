"""
Disease-specific routes for the AI Early Warning System.

Provides detailed data for individual diseases (dengue, cholera, malaria)
including total cases, trends, peak months, and top affected districts.
"""

import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
_ROUTES_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_ROUTES_DIR)
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)
_CSV_PATH = os.path.join(_PROJECT_ROOT, "data", "processed_data.csv")

# Valid disease names and their column mappings
_DISEASE_COLUMNS = {
    "dengue": "dengue_cases",
    "cholera": "cholera_cases",
    "malaria": "malaria_cases",
}


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class TopDistrict(BaseModel):
    """A district's case count for a specific disease."""
    district: str = Field(..., description="District name")
    cases: int = Field(..., description="Total cases in the period")


class DailyData(BaseModel):
    """Daily case count for a disease."""
    date: str = Field(..., description="Date (YYYY-MM-DD)")
    cases: int = Field(..., ge=0, description="Cases on this date")


class DiseaseResponse(BaseModel):
    """Comprehensive disease-specific data."""
    disease: str = Field(..., description="Disease name")
    total_cases: int = Field(..., description="Total cases in the period")
    trend: str = Field(..., description="Trend direction: increasing, decreasing, stable")
    peak_month: str = Field(..., description="Month with highest cases (e.g., 'October')")
    top_districts: List[TopDistrict] = Field(..., description="Top affected districts")
    daily_data: List[DailyData] = Field(..., description="Daily case time series")
    period_days: int = Field(..., description="Number of days in the analysis period")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_MONTH_NAMES = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]


def _compute_trend(daily_cases: List[int]) -> str:
    """Determine trend from a time series of daily case counts."""
    if len(daily_cases) < 14:
        return "stable"

    # Compare first half average to second half average
    mid = len(daily_cases) // 2
    first_half_avg = sum(daily_cases[:mid]) / max(mid, 1)
    second_half_avg = sum(daily_cases[mid:]) / max(len(daily_cases) - mid, 1)

    if first_half_avg == 0 and second_half_avg == 0:
        return "stable"

    ratio = second_half_avg / max(first_half_avg, 0.1)

    if ratio > 1.2:
        return "increasing"
    elif ratio < 0.8:
        return "decreasing"
    return "stable"


def _mock_disease_data(disease: str, days: int) -> DiseaseResponse:
    """Generate mock disease data when CSV is not available."""
    import random

    rng = random.Random(sum(ord(c) for c in disease) + days)
    today = datetime.utcnow().date()

    # Generate daily data
    daily_data = []
    daily_cases_list = []
    for offset in range(days, 0, -1):
        d = today - timedelta(days=offset)
        cases = rng.randint(0, 50)
        daily_data.append(DailyData(date=str(d), cases=cases))
        daily_cases_list.append(cases)

    total_cases = sum(daily_cases_list)
    trend = _compute_trend(daily_cases_list)

    # Mock top districts
    districts = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
                 "Vellore", "Tirunelveli", "Erode", "Thanjavur", "Dindigul"]
    top_districts = []
    for dist in districts[:7]:
        top_districts.append(TopDistrict(
            district=dist,
            cases=rng.randint(10, 500),
        ))
    top_districts.sort(key=lambda x: x.cases, reverse=True)

    # Peak months by disease
    peak_months = {"dengue": "October", "cholera": "August", "malaria": "September"}
    peak_month = peak_months.get(disease, "October")

    return DiseaseResponse(
        disease=disease,
        total_cases=total_cases,
        trend=trend,
        peak_month=peak_month,
        top_districts=top_districts,
        daily_data=daily_data,
        period_days=days,
    )


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Disease"])


@router.get(
    "/{name}",
    response_model=DiseaseResponse,
    summary="Get disease-specific data",
)
def get_disease_data(
    name: str = Path(..., description="Disease name: dengue, cholera, or malaria"),
    days: int = Query(default=90, ge=7, le=730, description="Number of past days to analyze"),
) -> DiseaseResponse:
    """
    Return comprehensive data for a specific disease including:
    - Total cases in the period
    - Trend direction (increasing/decreasing/stable)
    - Peak month historically
    - Top affected districts
    - Daily case time series

    Valid disease names: **dengue**, **cholera**, **malaria**
    """
    name = name.lower().strip()

    if name not in _DISEASE_COLUMNS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid disease name '{name}'. Must be one of: dengue, cholera, malaria",
        )

    column = _DISEASE_COLUMNS[name]

    # Try to load from CSV
    if not os.path.exists(_CSV_PATH):
        return _mock_disease_data(name, days)

    try:
        import pandas as pd

        df = pd.read_csv(_CSV_PATH)
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

        if column not in df.columns:
            return _mock_disease_data(name, days)

        if "date" not in df.columns:
            return _mock_disease_data(name, days)

        # Parse dates and filter
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])

        cutoff = datetime.utcnow().date() - timedelta(days=days)
        df = df[df["date"].dt.date >= cutoff]

        if df.empty:
            return _mock_disease_data(name, days)

        # Total cases
        df[column] = pd.to_numeric(df[column], errors="coerce").fillna(0).astype(int)
        total_cases = int(df[column].sum())

        # Daily aggregation
        daily = df.groupby(df["date"].dt.date)[column].sum().reset_index()
        daily.columns = ["date", "cases"]
        daily = daily.sort_values("date")

        daily_data = [
            DailyData(date=str(row["date"]), cases=int(row["cases"]))
            for _, row in daily.iterrows()
        ]

        # Trend
        daily_cases_list = [int(row["cases"]) for _, row in daily.iterrows()]
        trend = _compute_trend(daily_cases_list)

        # Top districts
        if "district" in df.columns:
            district_totals = df.groupby("district")[column].sum().reset_index()
            district_totals.columns = ["district", "cases"]
            district_totals = district_totals.sort_values("cases", ascending=False).head(10)
            top_districts = [
                TopDistrict(district=row["district"], cases=int(row["cases"]))
                for _, row in district_totals.iterrows()
            ]
        else:
            top_districts = []

        # Peak month
        df["month"] = df["date"].dt.month
        monthly = df.groupby("month")[column].sum()
        if not monthly.empty:
            peak_month_num = int(monthly.idxmax())
            peak_month = _MONTH_NAMES[peak_month_num]
        else:
            peak_month = "Unknown"

        return DiseaseResponse(
            disease=name,
            total_cases=total_cases,
            trend=trend,
            peak_month=peak_month,
            top_districts=top_districts,
            daily_data=daily_data,
            period_days=days,
        )

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading disease data: {exc}",
        ) from exc
