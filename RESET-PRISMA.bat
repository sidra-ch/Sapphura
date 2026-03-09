@echo off
cls
echo ================================================
echo   Prisma Client Complete Reset
echo ================================================
echo.

cd /d "C:\My Web Sites\Sappura\Sappura-react"

echo [1/4] Deleting old Prisma Client...
rmdir /s /q node_modules\.prisma 2>nul
echo      Done!

echo.
echo [2/4] Regenerating Prisma Client...
call npx prisma generate
echo      Done!

echo.
echo [3/4] Creating database tables...
call npx prisma db push --skip-generate
echo      Done!

echo.
echo [4/4] Adding products...
call npx tsx direct-seed.ts

echo.
echo ================================================
echo   Prisma Client fixed!
echo   Now close VS Code and reopen it
echo ================================================
echo.
pause
