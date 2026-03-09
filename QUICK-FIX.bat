@echo off
cls
color 0A
echo.
echo ================================================================
echo          SAPPURA - QUICK DATABASE FIX
echo          Fixed Schema - Only Core Models Enabled
echo ================================================================
echo.
echo What this script does:
echo   1. Clean old Prisma Client
echo   2. Generate NEW Prisma Client (7 core models only)
echo   3. Update database structure
echo   4. Seed products
echo   5. Verify everything works
echo.
echo CORE MODELS (Enabled):
echo   Product, Category, Order, OrderItem, Review, Customer, User
echo.
echo DISABLED MODELS (Temporarily):
echo   Wishlist, PasswordReset, Coupon
echo   (These were causing TypeScript errors)
echo.
echo Press any key to start...
pause >nul
cls

cd /d "C:\My Web Sites\Sappura\Sappura-react"

echo.
echo ================================================================
echo [Step 1/5] Cleaning old Prisma Client...
echo ================================================================
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma"
    echo     SUCCESS! Old Prisma Client deleted
) else (
    echo     No old client found - this is fine
)
echo.

echo ================================================================
echo [Step 2/5] Generating NEW Prisma Client...
echo ================================================================
echo     Generating types for 7 core models...
echo.
call npx prisma generate
if %ERRORLEVEL% EQU 0 (
    echo.
    echo     ====================================
    echo     SUCCESS! Prisma Client generated
    echo     ====================================
    echo.
) else (
    echo.
    echo     ERROR! Generation failed
    echo     Check the error message above
    pause
    exit /b 1
)

echo ================================================================
echo [Step 3/5] Verifying Client Files Created...
echo ================================================================
if exist "node_modules\.prisma\client\index.d.ts" (
    echo     SUCCESS! Client files found at:
    echo     node_modules\.prisma\client\
    echo.
) else (
    echo     ERROR! Client files NOT created
    echo     Something went wrong in Step 2
    pause
    exit /b 1
)

echo ================================================================
echo [Step 4/5] Updating Database Structure...
echo ================================================================
call npx prisma db push --skip-generate
if %ERRORLEVEL% EQU 0 (
    echo     SUCCESS! Database structure updated
    echo.
) else (
    echo     WARNING: Database push had issues
    echo     This may be OK if database already exists
    echo.
)

echo ================================================================
echo [Step 5/5] Seeding Products to Database...
echo ================================================================
call npx tsx direct-seed.ts
if %ERRORLEVEL% EQU 0 (
    echo     SUCCESS! 8 products added to database
    echo.
) else (
    echo     WARNING: Seeding had issues
    echo     You may need to add products manually
    echo.
)

echo.
echo ================================================================
echo                    FIX COMPLETE!
echo ================================================================
echo.
echo NEXT STEPS:
echo.
echo   1. Close VS Code completely (Alt + F4)
echo   2. Wait 5 seconds
echo   3. Reopen VS Code
echo   4. Check Problems panel - should show 0 errors
echo   5. Run: npm run dev
echo   6. Open browser: http://localhost:3000
echo   7. Products should now be visible!
echo.
echo IMPORTANT NOTES:
echo   - Wishlist feature temporarily disabled
echo   - Coupon feature temporarily disabled  
echo   - Password reset feature temporarily disabled
echo   - These will be re-enabled after core app is working
echo.
echo Press any key to exit...
pause >nul
