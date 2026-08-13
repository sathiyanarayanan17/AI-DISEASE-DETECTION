"""
Real-time data routes for the AI Early Warning System.

Provides endpoints for accessing the latest simulated weather readings
and a data feed. The background task in main.py populates this data store.
"""

import random
from collections import deque
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# In-memory data store for real-time readings
# ---------------------------------------------------------------------------
_MAX_FEED_SIZE = 100
_data_feed: deque = deque(maxlen=_MAX_FEED_SIZE)

# Tamil Nadu districts for simulated readings
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

class WeatherReading(BaseModel):
    """A single real-time weather data point."""
    type: str = Field(default="weather_update", description="Message type")
    timestamp: str = Field(..., description="ISO timestamp")
    district: str = Field(..., description="District name")
    rainfall_mm: float = Field(..., ge=0.0, description="Rainfall in mm")
    temperature_c: float = Field(..., description="Temperature in °C")
    humidity_pct: float = Field(..., ge=0.0, le=100.0, description="Relative humidity %")
    wind_speed_kmh: Optional[float] = Field(None, description="Wind speed in km/h")


class FeedResponse(BaseModel):
    """Response containing the real-time data feed."""
    count: int = Field(..., description="Number of data points returned")
    data: List[Dict] = Field(..., description="List of weather readings")


# ---------------------------------------------------------------------------
# Public function for main.py to add data points
# ---------------------------------------------------------------------------

def add_data_point(reading: dict) -> None:
    """Add a data point to the in-memory feed. Called by background task."""
    _data_feed.append(reading)


def get_latest_reading() -> Optional[dict]:
    """Return the most recent reading, or None if feed is empty."""
    if _data_feed:
        return _data_feed[-1]
    return None


# ---------------------------------------------------------------------------
# Generate initial seed data so endpoints aren't empty on startup
# ---------------------------------------------------------------------------

def _seed_initial_data():
    """Populate the feed with a few initial readings."""
    rng = random.Random(42)
    now = datetime.utcnow()
    for i in range(5):
        district = rng.choice(_TN_DISTRICTS)
        reading = {
            "type": "weather_update",
            "timestamp": (now).isoformat() + "Z",
            "district": district,
            "rainfall_mm": round(rng.uniform(0.0, 60.0), 2),
            "temperature_c": round(rng.uniform(24.0, 38.0), 1),
            "humidity_pct": round(rng.uniform(45.0, 92.0), 1),
            "wind_speed_kmh": round(rng.uniform(5.0, 35.0), 1),
        }
        _data_feed.append(reading)


_seed_initial_data()


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(tags=["Real-time"])


@router.get(
    "/latest",
    response_model=Optional[WeatherReading],
    summary="Get the latest weather reading",
)
def get_latest():
    """
    Return the most recent simulated weather reading.
    Returns null if no data has been ingested yet.
    """
    latest = get_latest_reading()
    if latest is None:
        return None
    return WeatherReading(**latest)


@router.get(
    "/feed",
    response_model=FeedResponse,
    summary="Get the last 20 data points",
)
def get_feed(
    limit: int = 20,
) -> FeedResponse:
    """
    Return the last N data points from the real-time feed.
    Default is 20, maximum is 100.
    """
    limit = min(limit, _MAX_FEED_SIZE)
    data = list(_data_feed)[-limit:]
    return FeedResponse(count=len(data), data=data)


@router.get(
    "/districts",
    response_model=List[str],
    summary="Get list of monitored TN districts",
)
def get_districts() -> List[str]:
    """Return the list of all 37 Tamil Nadu districts being monitored."""
    return _TN_DISTRICTS


# ---------------------------------------------------------------------------
# WebSocket for real-time push (alternative to main /ws)
# ---------------------------------------------------------------------------
_realtime_connections: List[WebSocket] = []


@router.websocket("/ws")
async def realtime_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time data feed.
    Clients will receive weather updates as they are ingested.
    """
    await websocket.accept()
    _realtime_connections.append(websocket)
    try:
        # Send current latest on connect
        latest = get_latest_reading()
        if latest:
            await websocket.send_json({"type": "initial", "data": latest})

        while True:
            # Keep alive - wait for any client messages
            data = await websocket.receive_text()
            await websocket.send_json({"type": "ack", "received": data})
    except WebSocketDisconnect:
        _realtime_connections.remove(websocket)
    except Exception:
        if websocket in _realtime_connections:
            _realtime_connections.remove(websocket)
