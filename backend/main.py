"""
AI Early Warning System — FastAPI Backend
==========================================

Entry point for the backend API server. Registers all routers, configures
CORS, WebSocket endpoint, and background tasks for real-time data ingestion.

Run with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

import asyncio
import json
import logging
import os
import random
import sys
from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# sys.path setup — make the sibling ml/ package importable from backend/
# ---------------------------------------------------------------------------
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("vyaadhishield.main")

# ---------------------------------------------------------------------------
# Router imports (must come after sys.path is extended)
# ---------------------------------------------------------------------------
from routes.predict import router as predict_router      # noqa: E402
from routes.alerts import router as alerts_router        # noqa: E402
from routes.history import router as history_router      # noqa: E402
from routes.analytics import router as analytics_router  # noqa: E402
from routes.realtime import router as realtime_router    # noqa: E402
from routes.realtime import add_data_point               # noqa: E402
from routes.forecast import router as forecast_router    # noqa: E402
from routes.citizen import router as citizen_router      # noqa: E402
from routes.resources import router as resources_router  # noqa: E402
from routes.disease import router as disease_router      # noqa: E402
from routes.water_quality import router as water_quality_router  # noqa: E402
from routes.vaccination import router as vaccination_router      # noqa: E402
from routes.mosquito import router as mosquito_router            # noqa: E402
from routes.notifications import router as notifications_router  # noqa: E402
from routes.agent import router as agent_router                  # noqa: E402

# ---------------------------------------------------------------------------
# Application state
# ---------------------------------------------------------------------------
_model_loaded: bool = False


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="VyaadhiShield AI",
    version="2.0.0",
    description=(
        "AI-powered Early Warning System for disease outbreak prediction "
        "across Tamil Nadu districts. Provides risk predictions, active alerts, "
        "historical trend data, analytics, real-time data ingestion, forecasting, "
        "citizen reporting, resource allocation, and disease-specific analysis."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(predict_router, prefix="/predict")
app.include_router(alerts_router, prefix="/alerts")
app.include_router(history_router, prefix="/history")
app.include_router(analytics_router, prefix="/analytics")
app.include_router(realtime_router, prefix="/realtime")
app.include_router(forecast_router, prefix="/forecast")
app.include_router(citizen_router, prefix="/citizen")
app.include_router(resources_router, prefix="/resources")
app.include_router(disease_router, prefix="/disease")
app.include_router(water_quality_router, prefix="/water-quality")
app.include_router(vaccination_router, prefix="/vaccination")
app.include_router(mosquito_router, prefix="/mosquito")
app.include_router(notifications_router, prefix="/notifications")
app.include_router(agent_router, prefix="/agent")


# ---------------------------------------------------------------------------
# WebSocket connections manager
# ---------------------------------------------------------------------------
class ConnectionManager:
    """Manages active WebSocket connections for real-time updates."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Send a JSON message to all connected clients."""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            self.active_connections.remove(conn)


manager = ConnectionManager()


# ---------------------------------------------------------------------------
# WebSocket endpoint
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time updates.
    Clients receive periodic weather data and alert updates.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; optionally receive messages from client
            data = await websocket.receive_text()
            # Echo back acknowledgment
            await websocket.send_json({"type": "ack", "message": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# ---------------------------------------------------------------------------
# Background task: simulate real-time weather data ingestion
# ---------------------------------------------------------------------------
_TN_DISTRICTS_SAMPLE = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Dindigul",
    "Thanjavur", "Ranipet", "Sivaganga", "Virudhunagar", "Namakkal",
]


async def _ingest_weather_data():
    """
    Background task that simulates real-time weather data ingestion
    every 60 seconds and broadcasts updates via WebSocket.
    """
    while True:
        await asyncio.sleep(60)
        try:
            # Simulate weather readings for a random subset of districts
            district = random.choice(_TN_DISTRICTS_SAMPLE)
            reading = {
                "type": "weather_update",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "district": district,
                "rainfall_mm": round(random.uniform(0.0, 80.0), 2),
                "temperature_c": round(random.uniform(22.0, 40.0), 1),
                "humidity_pct": round(random.uniform(40.0, 95.0), 1),
                "wind_speed_kmh": round(random.uniform(5.0, 45.0), 1),
            }
            # Store in realtime feed
            add_data_point(reading)
            # Broadcast to all WebSocket clients
            await manager.broadcast(reading)
            logger.info(f"📡 Ingested weather data for {district}")
        except Exception as exc:
            logger.error(f"Background ingestion error: {exc}")


# ---------------------------------------------------------------------------
# Startup event — load model and start background tasks
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def startup_event() -> None:
    """Load the ML model at startup and start background ingestion task."""
    global _model_loaded
    try:
        from ml.predict import predict_risk  # noqa: F401
        # Quick smoke-test to ensure the model artefacts are loadable
        predict_risk(
            district="Chennai",
            date_str=str(datetime.utcnow().date()),
            rainfall=20.0,
            temperature=30.0,
            humidity=70.0,
        )
        _model_loaded = True
        logger.info("✅  ML model loaded and ready.")
    except ImportError:
        _model_loaded = False
        logger.warning(
            "⚠️  ml.predict module not found. "
            "The API will run with mock predictions until the model is trained."
        )
    except Exception as exc:
        _model_loaded = False
        logger.warning(
            "⚠️  ML model load failed (%s). Falling back to mock predictions.",
            exc,
        )

    # Start background weather data ingestion
    asyncio.create_task(_ingest_weather_data())
    logger.info("🔄  Background weather ingestion task started (60s interval).")


# ---------------------------------------------------------------------------
# Core endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["Info"], summary="API overview")
def root() -> dict:
    """Return basic metadata about the API and available endpoint groups."""
    return {
        "name": "VyaadhiShield AI",
        "version": "2.0.0",
        "description": (
            "AI-powered Early Warning System for disease outbreak prediction "
            "across Tamil Nadu districts."
        ),
        "endpoints": [
            {"path": "/predict", "description": "Single-district risk prediction (GET) and batch prediction (POST /predict/batch)"},
            {"path": "/alerts", "description": "Active alerts for all districts at Medium/High risk (GET)"},
            {"path": "/alerts/high", "description": "Active alerts for High-risk districts only (GET)"},
            {"path": "/history", "description": "Historical prediction data for a given district (GET)"},
            {"path": "/analytics/metrics", "description": "Model performance metrics (GET)"},
            {"path": "/analytics/features", "description": "Feature importance data (GET)"},
            {"path": "/analytics/comparison", "description": "Model comparison data (GET)"},
            {"path": "/analytics/trends", "description": "Disease trends over time (GET)"},
            {"path": "/realtime/latest", "description": "Latest simulated weather readings (GET)"},
            {"path": "/realtime/feed", "description": "Last 20 data points (GET)"},
            {"path": "/realtime/districts", "description": "All monitored districts (GET)"},
            {"path": "/forecast", "description": "Multi-day risk forecast for a district (GET)"},
            {"path": "/citizen/report", "description": "Submit citizen symptom report (POST)"},
            {"path": "/citizen/reports", "description": "View recent citizen reports (GET)"},
            {"path": "/citizen/stats", "description": "Citizen report statistics (GET)"},
            {"path": "/resources/allocate", "description": "AI-powered resource allocation (GET)"},
            {"path": "/resources/hospitals", "description": "Hospital data per district (GET)"},
            {"path": "/disease/{name}", "description": "Disease-specific data: dengue, cholera, malaria (GET)"},
            {"path": "/ws", "description": "WebSocket for real-time updates"},
            {"path": "/health", "description": "Health check (GET)"},
            {"path": "/docs", "description": "Interactive Swagger UI documentation (GET)"},
        ],
    }


@app.get("/health", tags=["Info"], summary="Health check")
def health_check() -> dict:
    """
    Return the current health status of the API server.

    - **status**: Always "healthy" when the server is running.
    - **timestamp**: Current UTC time (ISO 8601).
    - **model_loaded**: Whether the ML model was successfully loaded at startup.
    - **active_connections**: Number of active WebSocket connections.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "model_loaded": _model_loaded,
        "active_connections": len(manager.active_connections),
    }
