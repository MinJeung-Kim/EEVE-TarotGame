@echo off
echo ========================================
echo   EEVE Tarot - Backend Server
echo ========================================
echo.

cd backend

echo [1/2] Checking Python...
python --version
echo.

echo [2/2] Starting FastAPI server...
echo.
echo Server will run on: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python main.py

pause
