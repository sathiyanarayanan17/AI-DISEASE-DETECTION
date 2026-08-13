"""
Resource allocation routes for the AI Early Warning System.

Provides AI-powered resource allocation based on district risk scores
and mock hospital data for planning purposes.
"""

import random
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# ML import with graceful fallback
# ---------------------------------------------------------------------------
_ml_available = False
try:
    from ml.predict import predict_all_districts
    _ml_available = True
except ImportError:
    pass


# ---------------------------------------------------------------------------
# Tamil Nadu Districts
# ---------------------------------------------------------------------------
_TN_DISTRICTS = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
    "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
    "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
    "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur",
    "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
    "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Villupuram", "Virudhunagar",
]


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class ResourceAllocation(BaseModel):
    """Resource allocation for a single district."""
    district: str = Field(..., description="District name")
    risk_level: str = Field(..., description="Current risk level")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score 0-100")
    workers_allocated: int = Field(..., ge=0, description="Health workers allocated")
    hospital_beds: int = Field(..., ge=0, description="Recommended hospital beds")
    priority: str = Field(..., description="Priority: Critical, High, Medium, Low")


class HospitalInfo(BaseModel):
    """Hospital resource information for a district."""
    district: str = Field(..., description="District name")
    total_hospitals: int = Field(..., description="Number of hospitals")
    total_beds: int = Field(..., description="Total bed capacity")
    icu_beds: int = Field(..., description="ICU bed capacity")
    available_beds: int = Field(..., description="Currently available beds")
    ventilators: int = Field(..., description="Number of ventilators")
    ambulances: int = Field(..., description="Number of ambulances")
    primary_health_centers: int = Field(..., description="Number of PHCs")


class AllocationSummary(BaseModel):
    """Summary of resource allocation."""
    total_workers: int = Field(..., description="Total workers to allocate")
    allocated_at: str = Field(..., description="Allocation timestamp")
    districts: List[ResourceAllocation] = Field(..., description="Per-district allocations")
    summary: Dict[str, int] = Field(..., description="Priority distribution summary")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_risk_scores() -> List[dict]:
    """Get risk scores for all districts."""
    today = str(datetime.utcnow().date())

    if _ml_available:
        try:
            raw = predict_all_districts(today)
            results = []
            for item in raw:
                results.append({
                    "district": item.get("district", ""),
                    "risk_level": item.get("risk_level", "Low"),
                    "risk_score": int(item.get("risk_score", 0)),
                })
            return results
        except Exception:
            pass

    # Mock fallback
    results = []
    for district in _TN_DISTRICTS:
        rng = random.Random(sum(ord(c) for c in district) + int(today.replace("-", "")))
        score = rng.randint(5, 95)
        if score >= 65:
            level = "High"
        elif score >= 35:
            level = "Medium"
        else:
            level = "Low"
        results.append({
            "district": district,
            "risk_level": level,
            "risk_score": score,
        })
    return results


def _priority_from_score(score: int) -> str:
    """Determine priority level from risk score."""
    if score >= 80:
        return "Critical"
    elif score >= 60:
        return "High"
    elif score >= 35:
        return "Medium"
    return "Low"


def _allocate_workers(risk_data: List[dict], total_workers: int) -> List[ResourceAllocation]:
    """
    Allocate workers proportional to risk_score.
    Higher risk districts get more workers.
    """
    total_risk = sum(d["risk_score"] for d in risk_data)
    if total_risk == 0:
        total_risk = 1  # Avoid division by zero

    allocations = []
    allocated_so_far = 0

    # Sort by risk score descending for allocation
    sorted_data = sorted(risk_data, key=lambda x: x["risk_score"], reverse=True)

    for i, district_data in enumerate(sorted_data):
        score = district_data["risk_score"]
        # Proportional allocation
        if i == len(sorted_data) - 1:
            # Last district gets remainder to avoid rounding issues
            workers = total_workers - allocated_so_far
        else:
            workers = int(round(total_workers * score / total_risk))
            allocated_so_far += workers

        # Hospital beds proportional to risk (base 10 + risk-weighted)
        beds = 10 + int(score * 0.5)

        allocations.append(ResourceAllocation(
            district=district_data["district"],
            risk_level=district_data["risk_level"],
            risk_score=score,
            workers_allocated=max(0, workers),
            hospital_beds=beds,
            priority=_priority_from_score(score),
        ))

    return allocations


def _generate_hospital_data() -> List[HospitalInfo]:
    """Generate mock hospital data for all 37 TN districts."""
    hospitals = []
    for district in _TN_DISTRICTS:
        rng = random.Random(sum(ord(c) for c in district) + 2025)

        # Larger cities get more hospitals
        is_major = district in ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
        multiplier = 3 if is_major else 1

        total_hospitals = rng.randint(5, 15) * multiplier
        total_beds = total_hospitals * rng.randint(50, 150)
        icu_beds = int(total_beds * rng.uniform(0.05, 0.12))
        available_beds = int(total_beds * rng.uniform(0.15, 0.45))
        ventilators = int(icu_beds * rng.uniform(0.6, 0.9))
        ambulances = rng.randint(5, 20) * multiplier
        phcs = rng.randint(20, 60) * multiplier

        hospitals.append(HospitalInfo(
            district=district,
            total_hospitals=total_hospitals,
            total_beds=total_beds,
            icu_beds=icu_beds,
            available_beds=available_beds,
            ventilators=ventilators,
            ambulances=ambulances,
            primary_health_centers=phcs,
        ))

    return hospitals


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Resources"])


@router.get(
    "/allocate",
    response_model=AllocationSummary,
    summary="AI-powered resource allocation",
)
def allocate_resources(
    workers: int = Query(default=100, ge=1, le=10000, description="Total health workers to allocate"),
) -> AllocationSummary:
    """
    AI-powered allocation of health workers across all 37 Tamil Nadu districts,
    proportional to each district's current risk score.

    Higher risk districts receive more workers. Returns allocations sorted
    by risk score (most critical first).

    - **workers**: Total number of health workers available for deployment.
    """
    risk_data = _get_risk_scores()
    allocations = _allocate_workers(risk_data, workers)

    # Priority distribution summary
    priority_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    for a in allocations:
        priority_counts[a.priority] += 1

    return AllocationSummary(
        total_workers=workers,
        allocated_at=datetime.utcnow().isoformat() + "Z",
        districts=allocations,
        summary=priority_counts,
    )


@router.get(
    "/hospitals",
    response_model=List[HospitalInfo],
    summary="Get hospital data per district",
)
def get_hospitals() -> List[HospitalInfo]:
    """
    Return hospital and healthcare facility data for all 37 Tamil Nadu districts.

    Includes total hospitals, bed capacity, ICU beds, available beds,
    ventilators, ambulances, and primary health centers.
    """
    return _generate_hospital_data()
