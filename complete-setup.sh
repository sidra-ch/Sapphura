#!/bin/bash
# Database Setup Script - بہت اہم!

echo "========================================="
echo "  🔧 Sappura Database Complete Setup"
echo "========================================="
echo ""

cd "C:\My Web Sites\Sappura\Sappura-react"

echo "[1/4] 🗑️  Clearing old migrations..."
npx prisma migrate reset --force

echo ""
echo "[2/4] 📋 Creating tables from schema..."
npx prisma migrate deploy

echo ""
echo "[3/4] 🌱 Seeding database with products..."
npm run db:seed

echo ""
echo "[4/4] ✅ Verification..."
npx tsx test-db-connection.ts

echo ""
echo "========================================="
echo "✅ Database setup complete!"
echo "========================================="
echo ""
echo "Now starting dev server..."
echo ""

npm run dev
