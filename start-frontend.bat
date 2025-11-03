@echo off
echo ========================================
echo   EEVE Tarot - Frontend Dev Server
echo ========================================
echo.

cd frontend

echo [1/2] Checking Node.js...
node --version
echo.

echo [2/2] Starting Vite dev server...
echo.
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev

pause
