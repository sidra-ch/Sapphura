-- Migration: Add media array field to products table
-- This adds support for the new Shopify-style media gallery

-- Add the media field as JSON array
ALTER TABLE "Product" ADD COLUMN "media" JSON[];

-- Create index for media field for better performance
CREATE INDEX IF NOT EXISTS "Product_media_idx" ON "Product" USING GIN ("media");

-- Add comment to explain the new field
COMMENT ON COLUMN "Product"."media" IS 'Array of media objects with type (image/video) and URL';

-- Migration script to convert existing data
-- This would be run in a separate migration or data update script

-- Example conversion for existing products (run as separate script):
/*
UPDATE "Product" 
SET "media" = 
  CASE 
    WHEN "images" IS NOT NULL AND array_length("images", 1) > 0 THEN
      (
        SELECT json_agg(
          json_build_object(
            'type', 'image',
            'url', img,
            'alt', name || ' - Image ' || row_number
          )
        )
        FROM (
          SELECT img, name, row_number() OVER ()
          FROM "Product", unnest("images") as img
          WHERE "Product"."id" = "Product"."id"
        ) AS subquery
      )
    ELSE '[]'::json[]
  END ||
  CASE 
    WHEN "video" IS NOT NULL THEN
      COALESCE(
        "media", 
        '[]'::json[]
      ) || 
      json_build_object(
        'type', 'video',
        'url', "video",
        'thumbnail', REPLACE("video", SUBSTRING("video" FROM '\.[^.]+$'), '.jpg')
      )::json
    ELSE "media"
  END
WHERE "media" IS NULL;
*/
