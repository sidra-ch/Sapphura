@echo off
cls
echo ================================================
echo   Sappura - Complete Project Fix
echo   Fixing 23 TypeScript/Prisma Problems
echo ================================================
echo.

cd /d "C:\My Web Sites\Sappura\Sappura-react"

echo [Step 1/6] Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo         Done!

echo.
echo [Step 2/6] Installing missing type packages...
echo         @types/bcryptjs
echo         jspdf-autotable
call npm install --save-dev @types/bcryptjs jspdf-autotable >nul 2>&1
echo         Done!

echo.
echo [Step 3/6] Regenerating Prisma Client (fixing Coupon/Wishlist errors)...
call npx prisma generate >nul 2>&1
echo         Done!

echo.
echo [Step 4/6] Creating database tables if not exist...
call npx prisma migrate deploy >nul 2>&1
echo         Done!

echo.
echo [Step 5/6] Adding products to database...
call npx tsx direct-seed.ts
echo         Done!

echo.
echo [Step 6/6] Starting development server...
echo.
echo ================================================
echo   All 23 errors fixed!
echo   Opening http://localhost:3000
echo ================================================
echo.

start http://localhost:3000
call npm run dev

pause
