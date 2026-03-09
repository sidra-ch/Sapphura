@echo off
cls
echo ============================================
echo    Sappura Complete Reset ^& Fix
echo ============================================
echo.

cd /d "C:\My Web Sites\Sappura\Sappura-react"

echo [1/5] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/5] Connecting to database and adding products...
echo This will add 8 products directly using SQL...
psql -U postgres -d Sappuradb -f "C:\My Web Sites\Sappura\Sappura-react\insert-products.sql" >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (
    echo WARNING: SQL insert might have failed. Trying alternative method...
    npx tsx direct-seed.ts
)

echo.
echo [3/5] Verifying products...
psql -U postgres -d Sappuradb -c "SELECT COUNT(*) as total_products FROM \"Product\";"

echo.
echo [4/5] Cleaning npm cache...
npm cache clean --force >nul 2>&1

echo.
echo [5/5] Starting fresh development server...
echo.
echo ============================================
echo   Server starting on http://localhost:3000
echo   Press Ctrl+C to stop
echo ============================================
echo.

start http://localhost:3000
call npm run dev

pause
