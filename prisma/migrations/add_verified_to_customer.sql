-- Migration: Add verified column to Customer table
ALTER TABLE "Customer" ADD COLUMN "verified" BOOLEAN DEFAULT false;
