"""
Water Quality Monitoring routes for the AI Early Warning System.

Provides water quality index data, contamination alerts, trend analysis,
source breakdowns, and summary statistics for Tamil Nadu districts.
All data is mock/in-memory for demonstration purposes.
"""

import random
from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class WaterQualityRecord(BaseModel):
    """Water quality data for a single district."""

    district: str = Field(..., description="District name")
    wqi_score: float = Field(..., ge=0, le=100, description="Water Quality Index (0-100, higher is better)")
    ph: float = Field(..., description="pH level (6.5-8.5 is safe)")
    turbidity: float = Field(..., ge=0, description="Turbidity in NTU")
    dissolved_oxygen: float = Field(..., ge=0, description="Dissolved oxygen in mg/L")
    coliform_count: int = Field(..., ge=0, description="Coliform bacteria count per 100mL")
    chlorine_level: float = Field(..., ge=0, description="Residual chlorine in mg/L")
    tds: int = Field(..., ge=0, description="Total Dissolved Solids in mg/L")
    status: str = Field(..., description="One of: Safe, Caution, Unsafe")
    last_tested: str = Field(..., description="Last test date (YYYY-MM-DD)")


class WaterAlert(BaseModel):
    """Alert for a district with unsafe water parameters."""

    district: str = Field(..., description="District name")
    parameter: str = Field(..., description="Parameter exceeding safe limit")
    current_value: float = Field(..., description="Current measured value")
    safe_limit: float = Field(..., description="Safe threshold")
    severity: str = Field(..., description="One of: Warning, Critical")
    recommendation: str = Field(..., description="Recommended action")


class ContaminationTrend(BaseModel):
    """Daily contamination trend data point."""

    date: str = Field(..., description="Date (YYYY-MM-DD)")
    coliform: int = Field(..., ge=0, description="Coliform count per 100mL")
    turbidity: float = Field(..., ge=0, description="Turbidity in NTU")
    tds: int = Field(..., ge=0, description="Total Dissolved Solids in mg/L")


class WaterSource(BaseModel):
    """Water source type breakdown."""

    type: str = Field(..., description="Water source type")
    count: int = Field(..., ge=0, description="Number of sources")
    percentage: float = Field(..., ge=0, le=100, description="Percentage of total")


class WaterQualityStats(BaseModel):
    """Summary statistics for water quality monitoring."""

    districts_sampled: int = Field(..., ge=0, description="Total districts sampled")
    safe_count: int = Field(..., ge=0, description="Districts with safe water")
    contaminated_count: int = Field(..., ge=0, description="Districts with contaminated water")
    under_treatment: int = Field(..., ge=0, description="Districts under active treatment")


# ---------------------------------------------------------------------------
# Mock Data
# ---------------------------------------------------------------------------

_MONITORED_DISTRICTS = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul",
    "Cuddalore", "Nagapattinam", "Thoothukudi", "Kancheepuram", "Tiruppur",
]


def _generate_water_quality_data() -> List[dict]:
    """Generate mock water quality data for monitored districts."""
    today = str(datetime.utcnow().date())
    data = []

    for district in _MONITORED_DISTRICTS:
        rng = random.Random(sum(ord(c) for c in district) + int(today.replace("-", "")))

        wqi = round(rng.uniform(35.0, 95.0), 1)
        ph = round(rng.uniform(6.0, 9.0), 1)
        turbidity = round(rng.uniform(0.5, 15.0), 1)
        do = round(rng.uniform(3.0, 9.0), 1)
        coliform = rng.randint(0, 800)
        chlorine = round(rng.uniform(0.0, 2.5), 2)
        tds = rng.randint(100, 1200)

        # Determine status based on key parameters
        if coliform > 500 or ph < 6.5 or ph > 8.5 or turbidity > 10 or tds > 1000:
            status = "Unsafe"
        elif coliform > 200 or turbidity > 5 or tds > 500 or do < 5.0:
            status = "Caution"
        else:
            status = "Safe"

        # Adjust WQI to match status
        if status == "Unsafe":
            wqi = round(rng.uniform(20.0, 45.0), 1)
        elif status == "Caution":
            wqi = round(rng.uniform(45.0, 70.0), 1)
        else:
            wqi = round(rng.uniform(70.0, 95.0), 1)

        # Last tested within past 3 days
        days_ago = rng.randint(0, 2)
        last_tested = str((datetime.utcnow() - timedelta(days=days_ago)).date())

        data.append({
            "district": district,
            "wqi_score": wqi,
            "ph": ph,
            "turbidity": turbidity,
            "dissolved_oxygen": do,
            "coliform_count": coliform,
            "chlorine_level": chlorine,
            "tds": tds,
            "status": status,
            "last_tested": last_tested,
        })

    return data


def _generate_alerts(quality_data: List[dict]) -> List[dict]:
    """Generate alerts for districts with unsafe parameters."""
    alerts = []

    safe_limits = {
        "coliform_count": ("Coliform Count", 100, "per 100mL"),
        "turbidity": ("Turbidity", 5.0, "NTU"),
        "tds": ("TDS", 500, "mg/L"),
        "ph_high": ("pH (High)", 8.5, ""),
        "ph_low": ("pH (Low)", 6.5, ""),
    }

    for record in quality_data:
        if record["coliform_count"] > 100:
            severity = "Critical" if record["coliform_count"] > 500 else "Warning"
            alerts.append({
                "district": record["district"],
                "parameter": "Coliform Count",
                "current_value": float(record["coliform_count"]),
                "safe_limit": 100.0,
                "severity": severity,
                "recommendation": "Immediate chlorination and boil-water advisory required."
                if severity == "Critical"
                else "Increase chlorination dosage and retest within 24 hours.",
            })

        if record["turbidity"] > 5.0:
            severity = "Critical" if record["turbidity"] > 10.0 else "Warning"
            alerts.append({
                "district": record["district"],
                "parameter": "Turbidity",
                "current_value": record["turbidity"],
                "safe_limit": 5.0,
                "severity": severity,
                "recommendation": "Check filtration systems. Possible sediment intrusion."
                if severity == "Critical"
                else "Monitor filtration efficiency and schedule maintenance.",
            })

        if record["tds"] > 500:
            severity = "Critical" if record["tds"] > 1000 else "Warning"
            alerts.append({
                "district": record["district"],
                "parameter": "TDS",
                "current_value": float(record["tds"]),
                "safe_limit": 500.0,
                "severity": severity,
                "recommendation": "Investigate source contamination. Deploy RO treatment units."
                if severity == "Critical"
                else "Schedule source inspection and increase monitoring frequency.",
            })

        if record["ph"] > 8.5:
            alerts.append({
                "district": record["district"],
                "parameter": "pH (High)",
                "current_value": record["ph"],
                "safe_limit": 8.5,
                "severity": "Warning",
                "recommendation": "Adjust chemical dosing at treatment plant. Check for alkaline contamination.",
            })

        if record["ph"] < 6.5:
            alerts.append({
                "district": record["district"],
                "parameter": "pH (Low)",
                "current_value": record["ph"],
                "safe_limit": 6.5,
                "severity": "Warning",
                "recommendation": "Add lime or soda ash to raise pH. Check for acidic discharge sources.",
            })

    # Sort by severity (Critical first)
    alerts.sort(key=lambda x: (0 if x["severity"] == "Critical" else 1))
    return alerts


def _generate_trends(district: str, days: int) -> List[dict]:
    """Generate mock contamination trend data for a district."""
    trends = []
    today = datetime.utcnow().date()
    rng = random.Random(sum(ord(c) for c in district))

    base_coliform = rng.randint(50, 300)
    base_turbidity = rng.uniform(2.0, 8.0)
    base_tds = rng.randint(200, 600)

    for offset in range(days, 0, -1):
        record_date = today - timedelta(days=offset)

        # Add realistic variation with slight upward trend during monsoon months
        month = record_date.month
        monsoon_factor = 1.3 if month in (6, 7, 8, 9, 10, 11) else 1.0

        coliform = max(0, int(base_coliform * monsoon_factor + rng.randint(-50, 80)))
        turbidity = max(0.1, round(base_turbidity * monsoon_factor + rng.uniform(-1.5, 3.0), 1))
        tds = max(50, int(base_tds + rng.randint(-80, 120)))

        trends.append({
            "date": str(record_date),
            "coliform": coliform,
            "turbidity": turbidity,
            "tds": tds,
        })

    return trends


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Water Quality"])


@router.get(
    "/",
    response_model=List[WaterQualityRecord],
    summary="Get water quality data for all monitored districts",
)
def get_water_quality() -> List[WaterQualityRecord]:
    """
    Return current water quality data for all monitored Tamil Nadu districts.

    Includes WQI score, pH, turbidity, dissolved oxygen, coliform count,
    chlorine level, TDS, safety status, and last tested date.
    """
    data = _generate_water_quality_data()
    return [WaterQualityRecord(**record) for record in data]


@router.get(
    "/alerts",
    response_model=List[WaterAlert],
    summary="Get districts with unsafe water parameters",
)
def get_water_alerts() -> List[WaterAlert]:
    """
    Return alerts for districts where water parameters exceed safe limits.

    Alerts are sorted by severity (Critical first), with recommendations
    for remediation.
    """
    quality_data = _generate_water_quality_data()
    alerts = _generate_alerts(quality_data)
    return [WaterAlert(**alert) for alert in alerts]


@router.get(
    "/trends",
    response_model=List[ContaminationTrend],
    summary="Get contamination trend data for a district",
)
def get_contamination_trends(
    district: str = Query(..., description="District name"),
    days: int = Query(default=30, ge=1, le=365, description="Number of past days"),
) -> List[ContaminationTrend]:
    """
    Return daily contamination trend data (coliform, turbidity, TDS)
    for a specified district over the given number of days.

    - **district**: Target district name.
    - **days**: Number of past days to include (1-365, default 30).
    """
    trends = _generate_trends(district, days)
    return [ContaminationTrend(**t) for t in trends]


@router.get(
    "/sources",
    response_model=List[WaterSource],
    summary="Get water source breakdown",
)
def get_water_sources() -> List[WaterSource]:
    """
    Return the breakdown of monitored water sources by type,
    including count and percentage of total.
    """
    sources = [
        {"type": "Bore Wells", "count": 1245, "percentage": 38.2},
        {"type": "Surface Water (Rivers/Lakes)", "count": 876, "percentage": 26.9},
        {"type": "Municipal Supply", "count": 654, "percentage": 20.1},
        {"type": "Hand Pumps", "count": 312, "percentage": 9.6},
        {"type": "Rainwater Harvesting", "count": 170, "percentage": 5.2},
    ]
    return [WaterSource(**s) for s in sources]


@router.get(
    "/stats",
    response_model=WaterQualityStats,
    summary="Get water quality summary statistics",
)
def get_water_quality_stats() -> WaterQualityStats:
    """
    Return summary statistics for water quality monitoring across
    all sampled districts.
    """
    quality_data = _generate_water_quality_data()

    safe_count = sum(1 for d in quality_data if d["status"] == "Safe")
    contaminated_count = sum(1 for d in quality_data if d["status"] == "Unsafe")
    caution_count = sum(1 for d in quality_data if d["status"] == "Caution")

    # Districts under treatment = Unsafe + some Caution districts
    rng = random.Random(int(datetime.utcnow().strftime("%Y%m%d")))
    under_treatment = contaminated_count + rng.randint(0, max(1, caution_count // 2))

    return WaterQualityStats(
        districts_sampled=len(quality_data),
        safe_count=safe_count,
        contaminated_count=contaminated_count,
        under_treatment=under_treatment,
    )
