"""
Vaccination tracking routes for the AI Early Warning System.

Provides vaccination statistics, upcoming drive schedules, vaccine inventory
status, and citizen registration for vaccination drives across all 37 Tamil
Nadu districts. Uses in-memory mock data for demonstration purposes.
"""

import random
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

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

_VACCINE_TYPES = ["Covishield", "Covaxin", "Moderna"]

_LOCATIONS = [
    "Government Hospital",
    "Primary Health Centre",
    "Community Health Centre",
    "Urban Health Centre",
    "District Hospital",
    "Medical College Hospital",
    "PHC Sub-centre",
    "Taluk Hospital",
]


# ---------------------------------------------------------------------------
# Pydantic Models — Responses
# ---------------------------------------------------------------------------

class DistrictCoverage(BaseModel):
    """Vaccination coverage for a single district."""

    district: str = Field(..., description="District name")
    vaccinated: int = Field(..., ge=0, description="Number of citizens vaccinated")
    population: int = Field(..., ge=0, description="Estimated district population")
    coverage_percent: float = Field(..., ge=0, le=100, description="Vaccination coverage percentage")


class VaccinationStats(BaseModel):
    """Aggregated vaccination statistics across all districts."""

    total_vaccinated: int = Field(..., ge=0, description="Total citizens vaccinated")
    coverage_percent: float = Field(..., ge=0, le=100, description="Overall coverage percentage")
    pending: int = Field(..., ge=0, description="Citizens pending vaccination")
    doses_today: int = Field(..., ge=0, description="Doses administered today")
    total_population: int = Field(..., ge=0, description="Total tracked population")
    last_updated: str = Field(..., description="Timestamp of last data update")
    district_wise: List[DistrictCoverage] = Field(..., description="Per-district coverage breakdown")


class VaccinationDrive(BaseModel):
    """Details of an upcoming or active vaccination drive."""

    id: int = Field(..., description="Drive identifier")
    district: str = Field(..., description="District where drive is scheduled")
    location: str = Field(..., description="Specific venue or facility")
    date: str = Field(..., description="Scheduled date (YYYY-MM-DD)")
    vaccine_type: str = Field(..., description="Vaccine being administered")
    slots_total: int = Field(..., ge=0, description="Total available vaccination slots")
    slots_booked: int = Field(..., ge=0, description="Number of booked slots")
    status: str = Field(..., description="Drive status: Upcoming, Active, Completed")


class VaccineInventoryItem(BaseModel):
    """Inventory status for a single vaccine type."""

    vaccine_name: str = Field(..., description="Name of the vaccine")
    stock: int = Field(..., ge=0, description="Current stock in doses")
    threshold: int = Field(..., ge=0, description="Minimum threshold for reorder alert")
    status: str = Field(..., description="Stock status: Sufficient, Low, Critical")


# ---------------------------------------------------------------------------
# Pydantic Models — Requests
# ---------------------------------------------------------------------------

class RegistrationRequest(BaseModel):
    """Request body for citizen vaccination registration."""

    name: str = Field(..., min_length=2, max_length=100, description="Full name of the citizen")
    aadhaar_last4: str = Field(
        ..., min_length=4, max_length=4, pattern=r"^\d{4}$",
        description="Last 4 digits of Aadhaar number",
    )
    district: str = Field(..., description="District of residence")
    age: int = Field(..., ge=1, le=120, description="Age of the citizen")
    dose_number: int = Field(..., ge=1, le=3, description="Dose number (1, 2, or 3 for booster)")


class RegistrationResponse(BaseModel):
    """Response after successful vaccination registration."""

    registration_id: str = Field(..., description="Unique registration identifier")
    name: str = Field(..., description="Registered citizen name")
    district: str = Field(..., description="Registered district")
    dose_number: int = Field(..., description="Dose number registered for")
    scheduled_date: str = Field(..., description="Tentative vaccination date (YYYY-MM-DD)")
    center: str = Field(..., description="Assigned vaccination center")
    message: str = Field(..., description="Confirmation message")


# ---------------------------------------------------------------------------
# In-Memory Mock Data
# ---------------------------------------------------------------------------

_registrations: List[dict] = []


def _generate_district_coverage() -> List[DistrictCoverage]:
    """Generate mock vaccination coverage data for all 37 TN districts."""
    coverages = []
    for district in _TN_DISTRICTS:
        rng = random.Random(sum(ord(c) for c in district) + 2026)
        population = rng.randint(500_000, 5_000_000)
        coverage_pct = round(rng.uniform(55.0, 95.0), 1)
        vaccinated = int(population * coverage_pct / 100)
        coverages.append(DistrictCoverage(
            district=district,
            vaccinated=vaccinated,
            population=population,
            coverage_percent=coverage_pct,
        ))
    return coverages


def _generate_drives() -> List[VaccinationDrive]:
    """Generate mock upcoming vaccination drives."""
    drives = []
    today = datetime.utcnow().date()
    rng = random.Random(int(today.strftime("%Y%m%d")))

    drive_id = 1
    for i in range(15):
        district = rng.choice(_TN_DISTRICTS)
        location = f"{rng.choice(_LOCATIONS)}, {district}"
        drive_date = today + timedelta(days=rng.randint(0, 14))
        vaccine = rng.choice(_VACCINE_TYPES)
        slots_total = rng.choice([100, 150, 200, 250, 300])
        slots_booked = rng.randint(int(slots_total * 0.3), slots_total)

        if drive_date < today:
            status = "Completed"
        elif drive_date == today:
            status = "Active"
        else:
            status = "Upcoming"

        drives.append(VaccinationDrive(
            id=drive_id,
            district=district,
            location=location,
            date=str(drive_date),
            vaccine_type=vaccine,
            slots_total=slots_total,
            slots_booked=slots_booked,
            status=status,
        ))
        drive_id += 1

    # Sort by date ascending
    drives.sort(key=lambda d: d.date)
    return drives


def _generate_inventory() -> List[VaccineInventoryItem]:
    """Generate mock vaccine inventory for all vaccine types."""
    inventory_data = [
        {"vaccine_name": "Covishield", "stock": 45_000, "threshold": 10_000},
        {"vaccine_name": "Covaxin", "stock": 8_500, "threshold": 10_000},
        {"vaccine_name": "Moderna", "stock": 3_200, "threshold": 5_000},
    ]
    inventory = []
    for item in inventory_data:
        if item["stock"] >= item["threshold"] * 1.5:
            status = "Sufficient"
        elif item["stock"] >= item["threshold"]:
            status = "Low"
        else:
            status = "Critical"
        inventory.append(VaccineInventoryItem(
            vaccine_name=item["vaccine_name"],
            stock=item["stock"],
            threshold=item["threshold"],
            status=status,
        ))
    return inventory


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Vaccination"])


@router.get(
    "/stats",
    response_model=VaccinationStats,
    summary="Get vaccination statistics",
)
def get_vaccination_stats() -> VaccinationStats:
    """
    Return aggregated vaccination statistics including total vaccinated,
    overall coverage percentage, pending citizens, doses administered today,
    and per-district coverage breakdown for all 37 Tamil Nadu districts.
    """
    district_wise = _generate_district_coverage()

    total_vaccinated = sum(d.vaccinated for d in district_wise)
    total_population = sum(d.population for d in district_wise)
    pending = total_population - total_vaccinated
    coverage_pct = round((total_vaccinated / total_population) * 100, 1) if total_population else 0.0

    # Mock doses today based on date seed
    rng = random.Random(int(datetime.utcnow().strftime("%Y%m%d")))
    doses_today = rng.randint(8_000, 25_000)

    return VaccinationStats(
        total_vaccinated=total_vaccinated,
        coverage_percent=coverage_pct,
        pending=pending,
        doses_today=doses_today,
        total_population=total_population,
        last_updated=datetime.utcnow().isoformat() + "Z",
        district_wise=district_wise,
    )


@router.get(
    "/schedule",
    response_model=List[VaccinationDrive],
    summary="Get upcoming vaccination drives",
)
def get_vaccination_schedule(
    district: Optional[str] = Query(default=None, description="Filter by district name"),
    status: Optional[str] = Query(default=None, description="Filter by status: Upcoming, Active, Completed"),
) -> List[VaccinationDrive]:
    """
    Return a list of upcoming, active, and recently completed vaccination
    drives across Tamil Nadu districts.

    Optionally filter by district name or drive status.
    """
    drives = _generate_drives()

    if district:
        drives = [d for d in drives if d.district.lower() == district.lower()]
    if status:
        drives = [d for d in drives if d.status.lower() == status.lower()]

    return drives


@router.get(
    "/inventory",
    response_model=List[VaccineInventoryItem],
    summary="Get vaccine inventory status",
)
def get_vaccine_inventory() -> List[VaccineInventoryItem]:
    """
    Return current vaccine inventory levels for all tracked vaccines
    (Covishield, Covaxin, Moderna) with stock quantities, reorder
    thresholds, and status indicators.

    Status values:
    - **Sufficient**: Stock is above 1.5x threshold
    - **Low**: Stock is between threshold and 1.5x threshold
    - **Critical**: Stock is below threshold — immediate reorder needed
    """
    return _generate_inventory()


@router.post(
    "/register",
    response_model=RegistrationResponse,
    status_code=201,
    summary="Register citizen for vaccination",
)
def register_for_vaccination(request: RegistrationRequest) -> RegistrationResponse:
    """
    Register a citizen for an upcoming vaccination drive.

    Validates the district, assigns a tentative date and vaccination center,
    and returns a unique registration ID for tracking.

    - **name**: Full name of the citizen
    - **aadhaar_last4**: Last 4 digits of Aadhaar for identity verification
    - **district**: Must be a valid Tamil Nadu district
    - **age**: Age of the citizen (1-120)
    - **dose_number**: Which dose (1, 2, or 3 for booster)
    """
    # Validate district
    valid_districts = [d.lower() for d in _TN_DISTRICTS]
    if request.district.lower() not in valid_districts:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid district '{request.district}'. Must be one of the 37 Tamil Nadu districts.",
        )

    # Generate registration ID
    reg_count = len(_registrations) + 1
    reg_id = f"VX-TN-{datetime.utcnow().strftime('%Y%m%d')}-{reg_count:04d}"

    # Assign a tentative date (3-7 days from now)
    rng = random.Random(reg_count + int(datetime.utcnow().timestamp()))
    scheduled_date = datetime.utcnow().date() + timedelta(days=rng.randint(3, 7))
    center = f"{rng.choice(_LOCATIONS)}, {request.district}"

    # Store registration
    registration = {
        "registration_id": reg_id,
        "name": request.name,
        "aadhaar_last4": request.aadhaar_last4,
        "district": request.district,
        "age": request.age,
        "dose_number": request.dose_number,
        "scheduled_date": str(scheduled_date),
        "center": center,
        "registered_at": datetime.utcnow().isoformat() + "Z",
    }
    _registrations.append(registration)

    return RegistrationResponse(
        registration_id=reg_id,
        name=request.name,
        district=request.district,
        dose_number=request.dose_number,
        scheduled_date=str(scheduled_date),
        center=center,
        message=f"Successfully registered {request.name} for Dose {request.dose_number} "
                f"at {center} on {scheduled_date}.",
    )
