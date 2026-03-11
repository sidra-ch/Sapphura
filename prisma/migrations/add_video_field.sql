-- Add video field to products table
ALTER TABLE "Product" ADD COLUMN "video" TEXT;

-- Create index for video field for better performance
CREATE INDEX IF NOT EXISTS "Product_video_idx" ON "Product"("video") WHERE "video" IS NOT NULL;

-- Update existing products with sample video URLs (optional)
-- UPDATE "Product" SET "video" = 'https://res.cloudinary.com/your-cloud-name/video/upload/v1/sample-product-video.mp4' 
-- WHERE "category" = 'featured' AND "video" IS NULL;
