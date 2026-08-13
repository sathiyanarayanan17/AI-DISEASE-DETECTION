@echo off
echo Starting EarlyAlert Backend...
cd /d %~dp0
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
