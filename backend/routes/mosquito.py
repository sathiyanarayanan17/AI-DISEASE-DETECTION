from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from typing import List
from datetime import date, timedelta
import random

router = APIRouter(tags=["Mosquito Density"])


# ─── Pydantic Models ────────────────────────────────────────────────────────────

class MosquitoDensityRecord(BaseModel):
    district: str
    breteau_index: float = Field(..., description="Breteau Index (positive containers per 100 houses)")
    house_index: float = Field(..., description="Percentage of houses positive for larvae")
    container_index: float = Field(..., description="Percentage of containers positive for larvae")
    larval_density: float = Field(..., description="Average larvae per dip")
    risk_level: str = Field(..., description="Low / Medium / High based on Breteau Index")
    last_surveyed: str


class DensityTrendPoint(BaseModel):
    date: str
    breteau_index: float
    house_index: float
    larval_density: float


class FoggingOperation(BaseModel):
    date: str
    district: str
    area_sqkm: float
    teams_deployed: int
    status: str = Field(..., description="Completed / In Progress / Scheduled")


class BreedingSiteBreakdown(BaseModel):
    type: str
    count: int
    percentage: float


class MosquitoStats(BaseModel):
    districts_surveyed: int
    avg_breteau_index: float
    high_density_zones: int
    fogging_operations_today: int


# ─── Helper ──────────────────────────────────────────────────────────────────────

def _risk_level(breteau_index: float) -> str:
    if breteau_index > 20:
        return "High"
    elif breteau_index >= 10:
        return "Medium"
    return "Low"


# ─── Mock Data ───────────────────────────────────────────────────────────────────

_DISTRICTS_DATA: List[dict] = [
    {"district": "Chennai", "breteau_index": 28.5, "house_index": 18.2, "container_index": 12.4, "larval_density": 4.8, "last_surveyed": "2026-08-18"},
    {"district": "Coimbatore", "breteau_index": 14.2, "house_index": 9.8, "container_index": 7.1, "larval_density": 2.3, "last_surveyed": "2026-08-17"},
    {"district": "Madurai", "breteau_index": 22.1, "house_index": 15.6, "container_index": 10.9, "larval_density": 3.9, "last_surveyed": "2026-08-18"},
    {"district": "Tiruchirappalli", "breteau_index": 11.3, "house_index": 7.4, "container_index": 5.8, "larval_density": 1.9, "last_surveyed": "2026-08-16"},
    {"district": "Salem", "breteau_index": 8.7, "house_index": 5.2, "container_index": 4.1, "larval_density": 1.4, "last_surveyed": "2026-08-17"},
    {"district": "Tirunelveli", "breteau_index": 19.8, "house_index": 13.1, "container_index": 9.5, "larval_density": 3.5, "last_surveyed": "2026-08-18"},
    {"district": "Erode", "breteau_index": 6.4, "house_index": 4.1, "container_index": 3.2, "larval_density": 1.0, "last_surveyed": "2026-08-15"},
    {"district": "Vellore", "breteau_index": 16.9, "house_index": 11.3, "container_index": 8.7, "larval_density": 2.8, "last_surveyed": "2026-08-17"},
    {"district": "Thanjavur", "breteau_index": 24.3, "house_index": 16.8, "container_index": 11.5, "larval_density": 4.2, "last_surveyed": "2026-08-18"},
    {"district": "Kancheepuram", "breteau_index": 21.7, "house_index": 14.9, "container_index": 10.2, "larval_density": 3.7, "last_surveyed": "2026-08-18"},
    {"district": "Cuddalore", "breteau_index": 25.9, "house_index": 17.4, "container_index": 12.1, "larval_density": 4.5, "last_surveyed": "2026-08-17"},
    {"district": "Dindigul", "breteau_index": 9.1, "house_index": 5.8, "container_index": 4.5, "larval_density": 1.5, "last_surveyed": "2026-08-16"},
    {"district": "Nagapattinam", "breteau_index": 18.4, "house_index": 12.2, "container_index": 8.9, "larval_density": 3.1, "last_surveyed": "2026-08-18"},
    {"district": "Ramanathapuram", "breteau_index": 12.6, "house_index": 8.3, "container_index": 6.4, "larval_density": 2.1, "last_surveyed": "2026-08-16"},
    {"district": "Thoothukudi", "breteau_index": 15.3, "house_index": 10.1, "container_index": 7.6, "larval_density": 2.5, "last_surveyed": "2026-08-17"},
]

_FOGGING_LOG: List[dict] = [
    {"date": "2026-08-19", "district": "Chennai", "area_sqkm": 12.5, "teams_deployed": 8, "status": "In Progress"},
    {"date": "2026-08-19", "district": "Madurai", "area_sqkm": 8.3, "teams_deployed": 5, "status": "Scheduled"},
    {"date": "2026-08-19", "district": "Thanjavur", "area_sqkm": 6.7, "teams_deployed": 4, "status": "Scheduled"},
    {"date": "2026-08-18", "district": "Chennai", "area_sqkm": 15.2, "teams_deployed": 10, "status": "Completed"},
    {"date": "2026-08-18", "district": "Cuddalore", "area_sqkm": 9.1, "teams_deployed": 6, "status": "Completed"},
    {"date": "2026-08-18", "district": "Kancheepuram", "area_sqkm": 7.8, "teams_deployed": 5, "status": "Completed"},
    {"date": "2026-08-17", "district": "Madurai", "area_sqkm": 11.4, "teams_deployed": 7, "status": "Completed"},
    {"date": "2026-08-17", "district": "Tirunelveli", "area_sqkm": 6.2, "teams_deployed": 4, "status": "Completed"},
    {"date": "2026-08-16", "district": "Chennai", "area_sqkm": 13.9, "teams_deployed": 9, "status": "Completed"},
    {"date": "2026-08-16", "district": "Thanjavur", "area_sqkm": 5.5, "teams_deployed": 3, "status": "Completed"},
]

_BREEDING_SITES: List[dict] = [
    {"type": "Discarded Tires", "count": 342, "percentage": 22.8},
    {"type": "Overhead Tanks", "count": 287, "percentage": 19.1},
    {"type": "Flower Pots & Vases", "count": 231, "percentage": 15.4},
    {"type": "Construction Sites", "count": 198, "percentage": 13.2},
    {"type": "Coconut Shells", "count": 156, "percentage": 10.4},
    {"type": "Drainage Blocks", "count": 124, "percentage": 8.3},
    {"type": "Water Storage Drums", "count": 98, "percentage": 6.5},
    {"type": "Air Coolers", "count": 65, "percentage": 4.3},
]


# ─── Routes ──────────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[MosquitoDensityRecord])
def get_mosquito_density():
    """Return mosquito density data for all surveyed districts."""
    results = []
    for d in _DISTRICTS_DATA:
        results.append(MosquitoDensityRecord(
            district=d["district"],
            breteau_index=d["breteau_index"],
            house_index=d["house_index"],
            container_index=d["container_index"],
            larval_density=d["larval_density"],
            risk_level=_risk_level(d["breteau_index"]),
            last_surveyed=d["last_surveyed"],
        ))
    return results


@router.get("/trends", response_model=List[DensityTrendPoint])
def get_density_trends(
    district: str = Query("Chennai", description="District name"),
    days: int = Query(30, ge=1, le=90, description="Number of days"),
):
    """Return daily mosquito density trends for a district over the specified period."""
    random.seed(hash(district))
    base_bi = next(
        (d["breteau_index"] for d in _DISTRICTS_DATA if d["district"].lower() == district.lower()),
        15.0,
    )

    trends = []
    today = date(2026, 8, 19)
    for i in range(days, 0, -1):
        day = today - timedelta(days=i)
        # Simulate seasonal variation
        variation = random.uniform(-5, 5)
        bi = max(0, round(base_bi + variation + (i % 7 - 3) * 0.5, 1))
        hi = max(0, round(bi * 0.65 + random.uniform(-1, 1), 1))
        ld = max(0, round(bi * 0.16 + random.uniform(-0.3, 0.3), 1))
        trends.append(DensityTrendPoint(
            date=day.isoformat(),
            breteau_index=bi,
            house_index=hi,
            larval_density=ld,
        ))
    return trends


@router.get("/fogging", response_model=List[FoggingOperation])
def get_fogging_operations():
    """Return fogging operations log."""
    return [FoggingOperation(**op) for op in _FOGGING_LOG]


@router.get("/breeding-sites", response_model=List[BreedingSiteBreakdown])
def get_breeding_sites():
    """Return breeding site type breakdown."""
    return [BreedingSiteBreakdown(**site) for site in _BREEDING_SITES]


@router.get("/stats", response_model=MosquitoStats)
def get_mosquito_stats():
    """Return summary statistics for mosquito density monitoring."""
    districts_surveyed = len(_DISTRICTS_DATA)
    avg_bi = round(sum(d["breteau_index"] for d in _DISTRICTS_DATA) / districts_surveyed, 1)
    high_density_zones = sum(1 for d in _DISTRICTS_DATA if d["breteau_index"] > 20)
    fogging_today = sum(1 for op in _FOGGING_LOG if op["date"] == "2026-08-19")

    return MosquitoStats(
        districts_surveyed=districts_surveyed,
        avg_breteau_index=avg_bi,
        high_density_zones=high_density_zones,
        fogging_operations_today=fogging_today,
    )
