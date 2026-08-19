from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid

router = APIRouter(tags=["Notifications"])


# ─── Pydantic Models ─────────────────────────────────────────────────────────

class Notification(BaseModel):
    id: str
    title: str
    message: str
    severity: str = Field(..., description="critical, warning, or info")
    district: Optional[str] = None
    timestamp: str
    is_read: bool = False
    category: str = Field(..., description="disease_alert, weather_warning, or system")


class MarkReadRequest(BaseModel):
    id: str


class UnreadResponse(BaseModel):
    count: int
    notifications: List[Notification]


class NotificationPreferences(BaseModel):
    email: Dict[str, bool] = Field(
        default_factory=lambda: {"critical": True, "warning": True, "info": False}
    )
    sms: Dict[str, bool] = Field(
        default_factory=lambda: {"critical": True, "warning": False, "info": False}
    )
    push: Dict[str, bool] = Field(
        default_factory=lambda: {"critical": True, "warning": True, "info": True}
    )
    voice: Dict[str, bool] = Field(
        default_factory=lambda: {"critical": True, "warning": False, "info": False}
    )


# ─── In-Memory Storage ───────────────────────────────────────────────────────

notifications_db: List[dict] = [
    {
        "id": "notif-001",
        "title": "Dengue Outbreak Alert — Chennai",
        "message": "7-day rolling case count exceeds p85 threshold in Chennai. Rapid response team deployment recommended.",
        "severity": "critical",
        "district": "Chennai",
        "timestamp": "2026-08-19T08:30:00+05:30",
        "is_read": False,
        "category": "disease_alert",
    },
    {
        "id": "notif-002",
        "title": "Cholera Risk Elevated — Madurai",
        "message": "Rising cholera cases detected in Madurai district. Enhanced monitoring initiated.",
        "severity": "warning",
        "district": "Madurai",
        "timestamp": "2026-08-19T07:45:00+05:30",
        "is_read": False,
        "category": "disease_alert",
    },
    {
        "id": "notif-003",
        "title": "Heavy Rainfall Warning — Coimbatore",
        "message": "IMD predicts 120mm+ rainfall in next 48 hours. Flood-borne disease risk increasing.",
        "severity": "warning",
        "district": "Coimbatore",
        "timestamp": "2026-08-19T06:15:00+05:30",
        "is_read": False,
        "category": "weather_warning",
    },
    {
        "id": "notif-004",
        "title": "Malaria Surge — Tirunelveli",
        "message": "Malaria cases up 45% in 14-day window. Vector control measures advised immediately.",
        "severity": "critical",
        "district": "Tirunelveli",
        "timestamp": "2026-08-18T22:00:00+05:30",
        "is_read": False,
        "category": "disease_alert",
    },
    {
        "id": "notif-005",
        "title": "Model Retrained Successfully",
        "message": "XGBoost ensemble retrained on latest data. F1-score: 0.92, AUC: 0.97. No drift detected.",
        "severity": "info",
        "district": None,
        "timestamp": "2026-08-18T20:00:00+05:30",
        "is_read": True,
        "category": "system",
    },
    {
        "id": "notif-006",
        "title": "NE Monsoon Onset Detected",
        "message": "Northeast monsoon conditions detected across coastal Tamil Nadu. Dengue risk models updated.",
        "severity": "warning",
        "district": None,
        "timestamp": "2026-08-18T18:30:00+05:30",
        "is_read": False,
        "category": "weather_warning",
    },
    {
        "id": "notif-007",
        "title": "Dengue Cluster — Tiruchirappalli",
        "message": "New dengue cluster identified in Tiruchirappalli urban zone. 23 cases in 5 days.",
        "severity": "critical",
        "district": "Tiruchirappalli",
        "timestamp": "2026-08-18T16:45:00+05:30",
        "is_read": False,
        "category": "disease_alert",
    },
    {
        "id": "notif-008",
        "title": "Humidity Threshold Breached — Salem",
        "message": "Humidity exceeding 90% for 3 consecutive days in Salem. Cholera risk elevated.",
        "severity": "warning",
        "district": "Salem",
        "timestamp": "2026-08-18T14:20:00+05:30",
        "is_read": False,
        "category": "weather_warning",
    },
    {
        "id": "notif-009",
        "title": "Data Ingestion Complete",
        "message": "Daily IMD + IDSP data ingestion completed. 37 districts updated. 0 errors.",
        "severity": "info",
        "district": None,
        "timestamp": "2026-08-18T12:00:00+05:30",
        "is_read": True,
        "category": "system",
    },
    {
        "id": "notif-010",
        "title": "Risk Downgrade — Thanjavur",
        "message": "Thanjavur risk level downgraded from High to Medium. Case counts declining.",
        "severity": "info",
        "district": "Thanjavur",
        "timestamp": "2026-08-18T10:15:00+05:30",
        "is_read": False,
        "category": "disease_alert",
    },
    {
        "id": "notif-011",
        "title": "Cyclone Advisory — Coastal Districts",
        "message": "IMD cyclone watch for Bay of Bengal. Chennai, Kanchipuram, Nagapattinam on alert.",
        "severity": "critical",
        "district": "Chennai",
        "timestamp": "2026-08-17T21:00:00+05:30",
        "is_read": False,
        "category": "weather_warning",
    },
    {
        "id": "notif-012",
        "title": "WebSocket Connection Restored",
        "message": "Real-time data feed reconnected after 3-minute interruption. No data loss.",
        "severity": "info",
        "district": None,
        "timestamp": "2026-08-17T19:30:00+05:30",
        "is_read": True,
        "category": "system",
    },
    {
        "id": "notif-013",
        "title": "Malaria Warning — Dharmapuri",
        "message": "Stagnant water reports increasing in Dharmapuri. Predicted malaria spike in 7-10 days.",
        "severity": "warning",
        "district": "Dharmapuri",
        "timestamp": "2026-08-17T15:00:00+05:30",
        "is_read": False,
        "category": "disease_alert",
    },
    {
        "id": "notif-014",
        "title": "SHAP Drift Alert",
        "message": "Feature importance shift detected: humidity_pct contribution increased 18% this week. Review recommended.",
        "severity": "warning",
        "district": None,
        "timestamp": "2026-08-17T11:00:00+05:30",
        "is_read": False,
        "category": "system",
    },
]

preferences_db: Dict[str, Dict[str, bool]] = {
    "email": {"critical": True, "warning": True, "info": False},
    "sms": {"critical": True, "warning": False, "info": False},
    "push": {"critical": True, "warning": True, "info": True},
    "voice": {"critical": True, "warning": False, "info": False},
}


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[Notification])
async def get_all_notifications():
    """Return all notifications sorted by timestamp (newest first)."""
    sorted_notifs = sorted(
        notifications_db, key=lambda n: n["timestamp"], reverse=True
    )
    return sorted_notifs


@router.get("/unread", response_model=UnreadResponse)
async def get_unread_notifications():
    """Return unread notification count and list."""
    unread = [n for n in notifications_db if not n["is_read"]]
    unread_sorted = sorted(unread, key=lambda n: n["timestamp"], reverse=True)
    return {"count": len(unread_sorted), "notifications": unread_sorted}


@router.post("/mark-read")
async def mark_notification_read(request: MarkReadRequest):
    """Mark a single notification as read by ID."""
    for notif in notifications_db:
        if notif["id"] == request.id:
            notif["is_read"] = True
            return {"success": True, "message": f"Notification {request.id} marked as read"}
    raise HTTPException(status_code=404, detail=f"Notification {request.id} not found")


@router.post("/mark-all-read")
async def mark_all_notifications_read():
    """Mark all notifications as read."""
    count = 0
    for notif in notifications_db:
        if not notif["is_read"]:
            notif["is_read"] = True
            count += 1
    return {"success": True, "message": f"Marked {count} notifications as read"}


@router.delete("/{notification_id}")
async def delete_notification(notification_id: str):
    """Dismiss/delete a notification by ID."""
    for i, notif in enumerate(notifications_db):
        if notif["id"] == notification_id:
            notifications_db.pop(i)
            return {"success": True, "message": f"Notification {notification_id} deleted"}
    raise HTTPException(status_code=404, detail=f"Notification {notification_id} not found")


@router.get("/preferences", response_model=NotificationPreferences)
async def get_notification_preferences():
    """Return current notification preferences (channel toggles per severity)."""
    return preferences_db


@router.post("/preferences", response_model=NotificationPreferences)
async def update_notification_preferences(prefs: NotificationPreferences):
    """Update notification preferences."""
    preferences_db["email"] = prefs.email
    preferences_db["sms"] = prefs.sms
    preferences_db["push"] = prefs.push
    preferences_db["voice"] = prefs.voice
    return preferences_db
