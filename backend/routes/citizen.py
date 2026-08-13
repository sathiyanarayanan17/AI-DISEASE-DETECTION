"""
Citizen reporting routes for the AI Early Warning System.

Provides endpoints for citizens to submit symptom reports and for
health officials to view aggregated report statistics.
"""

from collections import Counter
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# In-memory storage for citizen reports
# ---------------------------------------------------------------------------
_citizen_reports: List[dict] = []

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class CitizenReport(BaseModel):
    """A citizen symptom report submission."""
    name: str = Field(..., min_length=1, max_length=100, description="Reporter name")
    district: str = Field(..., min_length=1, description="District where symptoms observed")
    symptoms: List[str] = Field(..., min_length=1, description="List of symptoms")
    onset_date: str = Field(..., description="Date of symptom onset (YYYY-MM-DD)")
    contact: str = Field(default="", description="Contact info (phone/email)")


class CitizenReportResponse(BaseModel):
    """Response after submitting a citizen report."""
    id: int = Field(..., description="Report ID")
    status: str = Field(default="received", description="Report status")
    message: str = Field(..., description="Confirmation message")
    submitted_at: str = Field(..., description="Submission timestamp")


class ReportEntry(BaseModel):
    """A stored citizen report."""
    id: int
    name: str
    district: str
    symptoms: List[str]
    onset_date: str
    contact: str
    submitted_at: str


class CitizenStats(BaseModel):
    """Aggregated statistics from citizen reports."""
    total_reports: int = Field(..., description="Total number of reports")
    top_districts: List[Dict[str, object]] = Field(..., description="Top reporting districts")
    top_symptoms: List[Dict[str, object]] = Field(..., description="Most reported symptoms")
    reports_today: int = Field(..., description="Reports submitted today")
    reports_this_week: int = Field(..., description="Reports submitted this week")


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Citizen Reporting"])


@router.post(
    "/report",
    response_model=CitizenReportResponse,
    summary="Submit a citizen symptom report",
)
def submit_report(report: CitizenReport) -> CitizenReportResponse:
    """
    Accept a citizen symptom report for epidemiological monitoring.

    - **name**: Reporter's name.
    - **district**: District where symptoms are being observed.
    - **symptoms**: List of symptoms (e.g., ["fever", "headache", "rash"]).
    - **onset_date**: When symptoms first appeared (YYYY-MM-DD).
    - **contact**: Optional contact information.
    """
    # Validate onset_date format
    try:
        datetime.strptime(report.onset_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=422, detail="onset_date must be in YYYY-MM-DD format")

    now = datetime.utcnow().isoformat() + "Z"
    report_id = len(_citizen_reports) + 1

    entry = {
        "id": report_id,
        "name": report.name,
        "district": report.district,
        "symptoms": report.symptoms,
        "onset_date": report.onset_date,
        "contact": report.contact,
        "submitted_at": now,
    }
    _citizen_reports.append(entry)

    return CitizenReportResponse(
        id=report_id,
        status="received",
        message=f"Thank you, {report.name}. Your report for {report.district} has been recorded and will be reviewed by health officials.",
        submitted_at=now,
    )


@router.get(
    "/reports",
    response_model=List[ReportEntry],
    summary="Get recent citizen reports",
)
def get_reports() -> List[ReportEntry]:
    """
    Return the last 50 citizen symptom reports, most recent first.
    """
    recent = _citizen_reports[-50:]
    recent.reverse()
    return [ReportEntry(**r) for r in recent]


@router.get(
    "/stats",
    response_model=CitizenStats,
    summary="Get citizen report statistics",
)
def get_stats() -> CitizenStats:
    """
    Return aggregated statistics from citizen reports including:
    - Total reports count
    - Top reporting districts
    - Most commonly reported symptoms
    - Reports today and this week
    """
    total = len(_citizen_reports)

    # Count districts
    district_counter = Counter(r["district"] for r in _citizen_reports)
    top_districts = [
        {"district": d, "count": c}
        for d, c in district_counter.most_common(10)
    ]

    # Count symptoms (flatten all symptom lists)
    all_symptoms = []
    for r in _citizen_reports:
        all_symptoms.extend(r["symptoms"])
    symptom_counter = Counter(all_symptoms)
    top_symptoms = [
        {"symptom": s, "count": c}
        for s, c in symptom_counter.most_common(10)
    ]

    # Reports today
    today_str = str(datetime.utcnow().date())
    reports_today = sum(
        1 for r in _citizen_reports
        if r["submitted_at"][:10] == today_str
    )

    # Reports this week (last 7 days)
    from datetime import timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    reports_this_week = sum(
        1 for r in _citizen_reports
        if r["submitted_at"] >= week_ago.isoformat()
    )

    return CitizenStats(
        total_reports=total,
        top_districts=top_districts,
        top_symptoms=top_symptoms,
        reports_today=reports_today,
        reports_this_week=reports_this_week,
    )
