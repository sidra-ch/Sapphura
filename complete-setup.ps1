Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  🔧 Sappura Database Complete Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\My Web Sites\Sappura\Sappura-react"

Write-Host "[1/5] ⏹️  Killing any running Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "[2/5] 🔄 Resetting database (creating fresh tables)..." -ForegroundColor Yellow
npx prisma migrate reset --force

Write-Host ""
Write-Host "[3/5] 🌱 Seeding database with 8 products..." -ForegroundColor Yellow
npm run db:seed

Write-Host ""
Write-Host "[4/5] ✅ Verification - checking products..." -ForegroundColor Yellow
npx tsx test-db-connection.ts

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ DATABASE SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[5/5] 🚀 Starting dev server..." -ForegroundColor Yellow
Write-Host ""

npm run dev
