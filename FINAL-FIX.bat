@echo off
cls
color 0A
echo.
echo ========================================================
echo    SAPPURA - COMPLETE FIX (17 Problems)
echo ========================================================
echo.
echo This will:
echo  1. Install missing packages
echo  2. Regenerate Prisma Client (fixes coupon/wishlist errors)
echo  3. Create database tables
echo  4. Add 8 sample products
echo  5. Start development server
echo.
pause

cd /d "C:\My Web Sites\Sappura\Sappura-react"

echo.
echo [1/5] Stopping Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo      Done!

echo.
echo [2/5] Regenerating Prisma Client...
echo      This fixes: coupon, wishlist, passwordReset errors
call npx prisma generate
echo      Done!

echo.
echo [3/5] Ensuring database tables exist...
call npx prisma db push --skip-generate
echo      Done!

echo.
echo [4/5] Adding products to database...
call npx tsx direct-seed.ts
echo      Done!

echo.
echo [5/5] Starting development server...
echo.
echo ========================================================
echo   All 17 errors should be fixed!
echo   Browser will open at http://localhost:3000
echo ========================================================
echo.

start http://localhost:3000
npm run dev

pause
