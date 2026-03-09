Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🔧 Sappura Database Complete Fix" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\My Web Sites\Sappura\Sappura-react"

# Step 0: Kill any running processes
Write-Host "⏹️  Stopping any running Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Step 1: Check PostgreSQL
Write-Host "`n1️⃣ Checking PostgreSQL service..." -ForegroundColor Yellow
$service = Get-Service postgresql* -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "✅ PostgreSQL service found: $($service.Name) - Status: $($service.Status)" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL service not found, but continuing..." -ForegroundColor Yellow
}

# Step 2: Reset database & create tables
Write-Host "`n2️⃣ Resetting database & creating tables..." -ForegroundColor Yellow
npx prisma migrate reset --force

# Step 3: Seed Database with products
Write-Host "`n3️⃣ Seeding database with products..." -ForegroundColor Yellow
npm run db:seed

# Step 4: Check products
Write-Host "`n4️⃣ Verifying products in database..." -ForegroundColor Yellow
npx tsx test-db-connection.ts

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "`n5️⃣ Starting development server..." -ForegroundColor Yellow
Write-Host "   Open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

npm run dev
