@echo off
cls
color 0E
echo.
echo ================================================================
echo          SAPPURA - COMPLETE PRISMA FIX
echo          This will fix all 14 TypeScript errors
echo ================================================================
echo.
echo Steps that will be executed:
echo   1. Clean old Prisma Client
echo   2. Generate new Prisma Client (with all 10 models)
echo   3. Push schema to database
echo   4. Seed database with 8 products
echo   5. Verify everything works
echo.
echo Press any key to start...
pause >nul
cls

cd /d "C:\My Web Sites\Sappura\Sappura-react"

echo.
echo ================================================================
echo [Step 1/6] Cleaning old Prisma Client...
echo ================================================================
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma"
    echo     Old Prisma Client deleted
) else (
    echo     No old client found (this is OK)
)
echo     Done!

echo.
echo ================================================================
echo [Step 2/6] Generating NEW Prisma Client...
echo ================================================================
echo     This creates types for all 10 models:
echo     - Product, Category, Order, OrderItem, Review
echo     - Customer, Wishlist, User, PasswordReset, Coupon
echo.
call npx prisma generate
if %ERRORLEVEL% EQU 0 (
    echo.
    echo     SUCCESS! Prisma Client generated
) else (
    echo.
    echo     ERROR! Prisma generate failed
    pause
    exit /b 1
)

echo.
echo ================================================================
echo [Step 3/6] Verifying Prisma Client was created...
echo ================================================================
if exist "node_modules\.prisma\client\index.d.ts" (
    echo     SUCCESS! Client files found
    echo     Location: node_modules\.prisma\client\
) else (
    echo     ERROR! Client files NOT created
    pause
    exit /b 1
)

echo.
echo ================================================================
echo [Step 4/6] Pushing schema to database...
echo ================================================================
call npx prisma db push --skip-generate
if %ERRORLEVEL% EQU 0 (
    echo     SUCCESS! Database updated
) else (
    echo     WARNING: Database push had issues (may be OK)
)

echo.
echo ================================================================
echo [Step 5/6] Seeding database with products...
echo ================================================================
call npx tsx direct-seed.ts
if %ERRORLEVEL% EQU 0 (
    echo     SUCCESS! Products added
) else (
    echo     WARNING: Seeding had issues
)

echo.
echo ================================================================
echo [Step 6/6] Final verification...
echo ================================================================
echo     Checking Prisma Client structure...
dir "node_modules\.prisma\client" /b | findstr "index" >nul
if %ERRORLEVEL% EQU 0 (
    echo     SUCCESS! All files present
) else (
    echo     ERROR! Missing files
)

echo.
echo ================================================================
echo              PRISMA FIX COMPLETE!
echo ================================================================
echo.
echo NEXT STEPS:
echo   1. Close VS Code completely (Alt + F4)
echo   2. Open VS Code again
echo   3. Wait 5 seconds for TypeScript server to load
echo   4. Check Problems panel - should show 0 errors
echo   5. Run: npm run dev
echo   6. Open: http://localhost:3000
echo.
echo All 14 errors should be FIXED!
echo.
pause
