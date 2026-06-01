@echo off
echo ========================================
echo   ShopKart - Setup Script (Windows)
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (echo ERROR: pip install failed && pause && exit /b 1)
echo Backend ready!
echo.

echo [2/4] Setting up Frontend...
cd ..\frontend
npm install
if %errorlevel% neq 0 (echo ERROR: npm install failed && pause && exit /b 1)
echo Frontend ready!
echo.

echo ========================================
echo   Setup Complete!
echo   
echo   To run:
echo   Terminal 1 (backend):  cd backend && uvicorn main:app --reload
echo   Terminal 2 (frontend): cd frontend && npm run dev
echo   
echo   Open: http://localhost:5173
echo   Admin: admin@shopkart.com / admin123
echo ========================================
pause
