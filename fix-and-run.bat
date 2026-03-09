@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo.
echo =========================================
echo   Sappura - Database Complete Fix
echo =========================================
echo.

cd /d "C:\My Web Sites\Sappura\Sappura-react"

echo [1/3] Stopping Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Seeding database with products...
call npx tsx direct-seed.ts

echo.
echo [3/3] Starting development server...
echo.
echo =========================================
echo Database fixed! Opening http://localhost:3000
echo =========================================
echo.

call npm run dev

pause
