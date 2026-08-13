@echo off
title EarlyAlert - AI Disease Outbreak Warning System
echo.
echo ============================================================
echo   EarlyAlert - Starting Backend + Frontend
echo ============================================================
echo.

:: Start Backend
echo [1/2] Starting Backend (FastAPI) on port 8000...
cd /d "C:\Users\SATHIYANARAYANAN S\early-warning-system\backend"
start "EarlyAlert-Backend" cmd /k "uvicorn main:app --reload --port 8000"

:: Wait for backend to boot
timeout /t 3 /nobreak >nul

:: Start Frontend
echo [2/2] Starting Frontend (React) on port 3000...
cd /d "C:\Users\SATHIYANARAYANAN S\early-warning-system\frontend"
start "EarlyAlert-Frontend" cmd /k "npm start"

echo.
echo ============================================================
echo   DONE! Opening in 5 seconds...
echo   Backend:  http://localhost:8000/docs
echo   Frontend: http://localhost:3000
echo ============================================================
timeout /t 5 /nobreak >nul
start http://localhost:3000
