@echo off
REM ═══════════════════════════════════════════════════════════════════
REM  VyaadhiShield AI — Full Stack Launcher
REM  Starts both Backend (FastAPI) and Frontend (React/Vite)
REM ═══════════════════════════════════════════════════════════════════

title VyaadhiShield AI - Full Application

echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║     VyaadhiShield AI - Disease Outbreak Early Warning        ║
echo  ║     45+ Feature Full Stack Application                       ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.10+
    pause
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install Node.js 18+
    pause
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd backend
pip install -r requirements.txt -q
cd ..

echo [2/4] Installing frontend dependencies...
cd frontend
call npm install --silent
cd ..

echo [3/4] Starting FastAPI backend (port 8000)...
start "VyaadhiShield Backend" cmd /k "cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo [4/4] Starting React frontend (port 3000)...
start "VyaadhiShield Frontend" cmd /k "cd frontend && npm run dev -- --port 3000"

echo.
echo  ═══════════════════════════════════════════════════════════
echo   Application Started Successfully!
echo  ═══════════════════════════════════════════════════════════
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/docs
echo   WebSocket: ws://localhost:8000/ws
echo.
echo   Press any key to exit this launcher (servers keep running)
echo  ═══════════════════════════════════════════════════════════
pause
