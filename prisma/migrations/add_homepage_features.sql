-- Migration: Add collections, banners, and newsletter support
-- This adds support for the new Shopify-style homepage

-- Add collections field to products
ALTER TABLE "Product" ADD COLUMN "collections" TEXT[];

-- Add product status flags
ALTER TABLE "Product" ADD COLUMN "isFeatured" BOOLEAN DEFAULT false;
ALTER TABLE "Product" ADD COLUMN "isBestSeller" BOOLEAN DEFAULT false;
ALTER TABLE "Product" ADD COLUMN "isNewArrival" BOOLEAN DEFAULT false;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS "Product_collections_idx" ON "Product" USING GIN ("collections");
CREATE INDEX IF NOT EXISTS "Product_isFeatured_idx" ON "Product" ("isFeatured");
CREATE INDEX IF NOT EXISTS "Product_isBestSeller_idx" ON "Product" ("isBestSeller");
CREATE INDEX IF NOT EXISTS "Product_isNewArrival_idx" ON "Product" ("isNewArrival");

-- Create collections table
CREATE TABLE IF NOT EXISTS "Collection" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "image" TEXT,
  "bannerImage" TEXT,
  "type" TEXT NOT NULL DEFAULT 'STANDARD',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "showInMenu" BOOLEAN NOT NULL DEFAULT true,
  "showOnHome" BOOLEAN NOT NULL DEFAULT true,
  "title" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Collection_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Collection_slug_key" UNIQUE ("slug")
);

-- Create banners table
CREATE TABLE IF NOT EXISTS "Banner" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "description" TEXT,
  "imageUrl" TEXT,
  "mobileUrl" TEXT,
  "videoUrl" TEXT,
  "linkUrl" TEXT,
  "linkText" TEXT,
  "collectionSlug" TEXT,
  "type" TEXT NOT NULL DEFAULT 'HOME',
  "position" TEXT NOT NULL DEFAULT 'HERO',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- Create newsletter subscriptions table
CREATE TABLE IF NOT EXISTS "NewsletterSubscription" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "NewsletterSubscription_email_key" UNIQUE ("email")
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS "Collection_slug_idx" ON "Collection" ("slug");
CREATE INDEX IF NOT EXISTS "Collection_type_idx" ON "Collection" ("type");
CREATE INDEX IF NOT EXISTS "Collection_isActive_idx" ON "Collection" ("isActive");
CREATE INDEX IF NOT EXISTS "Collection_sortOrder_idx" ON "Collection" ("sortOrder");

CREATE INDEX IF NOT EXISTS "Banner_type_idx" ON "Banner" ("type");
CREATE INDEX IF NOT EXISTS "Banner_position_idx" ON "Banner" ("position");
CREATE INDEX IF NOT EXISTS "Banner_isActive_idx" ON "Banner" ("isActive");
CREATE INDEX IF NOT EXISTS "Banner_sortOrder_idx" ON "Banner" ("sortOrder");

CREATE INDEX IF NOT EXISTS "NewsletterSubscription_email_idx" ON "NewsletterSubscription" ("email");

-- Insert default collections
INSERT INTO "Collection" ("id", "name", "slug", "description", "type", "showOnHome", "sortOrder")
VALUES 
  ('collection-1', 'Ramadan Offers', 'ramadan-offers', 'Exclusive jewelry pieces for the holy month', 'SEASONAL', true, 1),
  ('collection-2', 'Eid Special', 'eid-special', 'Celebrate Eid with our stunning collection', 'SEASONAL', true, 2),
  ('collection-3', 'Featured Products', 'featured', 'Handpicked pieces from our exclusive collection', 'FEATURED', true, 3),
  ('collection-4', 'Best Sellers', 'best-sellers', 'Our most popular pieces loved by customers', 'STANDARD', true, 4),
  ('collection-5', 'New Arrivals', 'new-arrivals', 'Fresh pieces just added to our collection', 'STANDARD', true, 5)
ON CONFLICT ("slug") DO NOTHING;

-- Insert sample banners
INSERT INTO "Banner" ("id", "title", "subtitle", "description", "imageUrl", "linkUrl", "type", "position", "sortOrder")
VALUES 
  ('banner-1', 'Ramadan Collection 2024', 'Elegant pieces for the holy month', 'Discover our exclusive Ramadan jewelry collection', 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/banners/ramadan-2024.jpg', '/collections/ramadan-offers', 'HOME', 'HERO', 1),
  ('banner-2', 'Eid Special Offers', 'Celebrate in style', 'Up to 50% off on selected items', 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/banners/eid-special.jpg', '/collections/eid-special', 'HOME', 'HERO', 2)
ON CONFLICT DO NOTHING;
