-- Cloudinary-based bulk product sync for Sappura
-- This script uses your exact Cloudinary public IDs and makes clickable product pages work.

SELECT COUNT(*) AS before_count FROM "Product";

WITH cloudinary_assets(public_id) AS (
  VALUES
    ('wintercollection-5_a2uwvx'),
    ('wintercollection-4_waoxjm'),
    ('wintercollection-3_i0zjvc'),
    ('wintercollection-2_cr54gi'),
    ('winter-collection1_dgy3nd'),
    ('summer-collection_musek6'),
    ('summer12_dzknuk'),
    ('summer11_ddjpht'),
    ('summer10_qprrnm'),
    ('summer-9_rj6mqd'),
    ('summer-8_k9vc2l'),
    ('summer-7_lq7bqy'),
    ('summer-6_u4yimt'),
    ('summer-5_rfnfum'),
    ('summer-4_nqv3xp'),
    ('summer-3_yoelfq'),
    ('summer-2_imjyph'),
    ('summer-1_ru58wq'),
    ('suits_cwhxhg'),
    ('suit-34_orcnmb'),
    ('suit-33_s9tdp7'),
    ('suit-32_ewfeta'),
    ('suit-31_o91abs'),
    ('suit-30_iaje6j'),
    ('suit-29_tswkbr'),
    ('suit-28_pk40z9'),
    ('suit-27_dzd4kg'),
    ('suit-26_qcpeqb'),
    ('suit-25_cyojgb'),
    ('suit-24_rk5sru'),
    ('suit-23_jsz7qh'),
    ('suit-22_inqu2k'),
    ('suit-21_sccev9'),
    ('suit-20_nqqoay'),
    ('suit-19_jqfpf7'),
    ('suit-18_ftxtym'),
    ('suit-17_derxxn'),
    ('suit-16_dbhczt'),
    ('suit-15_xmdt5u'),
    ('suit-14_dhyhpd'),
    ('suit-13_xsykpo'),
    ('suit-12_nn5bfz'),
    ('suit-11_pymirg'),
    ('suit-10_aq81rd'),
    ('suit-9_crtln0'),
    ('suit-8_bini0s'),
    ('suit-7_jtmyic'),
    ('suit-6_nqlzt6'),
    ('suit-5_ki6r7l'),
    ('suit-4_vhsafd'),
    ('suit-2_vrrzjh'),
    ('suit-3_ujzin9'),
    ('suit-1_xknkvr'),
    ('newcollection-6_wrhsz1'),
    ('newcollection-5_vczdft'),
    ('newcollection-4_vhmcis'),
    ('newcollection-3_v9ewfb'),
    ('newcollection-2_afc6as'),
    ('newcollection-1_opqlt9'),
    ('new-collection_soycvp'),
    ('neckles-3_crgycd'),
    ('neckles-2_br9m4c'),
    ('neckles-1_lci92l'),
    ('make-up_aeyh44'),
    ('earing-4_mwaod1'),
    ('earing-3_kz0ik8'),
    ('earing-2_blsnop'),
    ('earing-1_zd3fr9'),
    ('clothes-collection_vmczph'),
    ('clothes_collection-4_uerze3'),
    ('clothes_collection-3_uhcnpf'),
    ('clothes_collection-2_kiukmy'),
    ('cloth_collection-9_oqrshs'),
    ('cloth_collection-8_bhoby0'),
    ('cloth_collection-7_il5wkg'),
    ('cloth_collection-6_puwjgl'),
    ('cloth_collection-5_l2utvw'),
    ('bracelet-1_sqzt5b'),
    ('bangals-5_rvmsnu'),
    ('bangals-4_rqghh8'),
    ('bangals-3_zspzaf'),
    ('bangals-2_slcypx'),
    ('bangals-1_omjvdx'),
    ('accessories_lha1av')
), prepared AS (
  SELECT
    public_id,
    lower(regexp_replace(public_id, '[^a-zA-Z0-9]+', '-', 'g')) AS slug,
    initcap(
      replace(
        regexp_replace(public_id, '[_-][a-z0-9]{6}$', '', 'i'),
        '_',
        ' '
      )
    ) AS name,
    CASE
      WHEN lower(public_id) LIKE '%bangal%' OR lower(public_id) LIKE '%bangle%' THEN 'Bangles'
      WHEN lower(public_id) LIKE '%earing%' OR lower(public_id) LIKE '%earring%' THEN 'Earrings'
      WHEN lower(public_id) LIKE '%neckles%' OR lower(public_id) LIKE '%necklace%' THEN 'Necklace'
      WHEN lower(public_id) LIKE '%bracelet%' THEN 'Bracelet'
      WHEN lower(public_id) LIKE '%winter%' THEN 'Winter Collection'
      WHEN lower(public_id) LIKE '%summer%' THEN 'Summer Collection'
      WHEN lower(public_id) LIKE '%newcollection%' OR lower(public_id) LIKE '%new-collection%' THEN 'New Collection'
      WHEN lower(public_id) LIKE '%suit%' OR lower(public_id) LIKE '%cloth%' OR lower(public_id) LIKE '%clothes%' THEN 'Suits'
      WHEN lower(public_id) LIKE '%accessories%' THEN 'Accessories'
      WHEN lower(public_id) LIKE '%make-up%' OR lower(public_id) LIKE '%makeup%' THEN 'Makeup'
      ELSE 'Collection'
    END AS category
  FROM cloudinary_assets
)
INSERT INTO "Product" (
  id,
  name,
  slug,
  description,
  price,
  "originalPrice",
  category,
  images,
  sizes,
  colors,
  stock,
  "inStock",
  rating,
  features,
  "createdAt",
  "updatedAt"
)
SELECT
  'cloud-' || substr(md5(public_id), 1, 12) AS id,
  name,
  slug,
  'Cloudinary synced product from public_id: ' || public_id,
  CASE
    WHEN category = 'Necklace' THEN 4599
    WHEN category = 'Bangles' THEN 2499
    WHEN category = 'Earrings' THEN 1799
    WHEN category = 'Bracelet' THEN 1999
    WHEN category = 'Winter Collection' THEN 4399
    WHEN category = 'Summer Collection' THEN 3499
    WHEN category = 'New Collection' THEN 3799
    WHEN category = 'Suits' THEN 3999
    ELSE 2999
  END AS price,
  CASE
    WHEN category = 'Necklace' THEN 5399
    WHEN category = 'Bangles' THEN 3099
    WHEN category = 'Earrings' THEN 2399
    WHEN category = 'Bracelet' THEN 2599
    WHEN category = 'Winter Collection' THEN 5199
    WHEN category = 'Summer Collection' THEN 4299
    WHEN category = 'New Collection' THEN 4499
    WHEN category = 'Suits' THEN 4899
    ELSE 3599
  END AS "originalPrice",
  category,
  ARRAY['https://res.cloudinary.com/dwmxdyvd2/image/upload/' || public_id] AS images,
  CASE
    WHEN category IN ('Suits', 'Summer Collection', 'Winter Collection', 'New Collection') THEN ARRAY['S', 'M', 'L', 'XL']::text[]
    WHEN category = 'Bangles' THEN ARRAY['2.4', '2.6', '2.8']::text[]
    ELSE ARRAY['Standard']::text[]
  END AS sizes,
  CASE
    WHEN category = 'Bangles' THEN '[{"name":"Gold","hex":"#FFD700"}]'::jsonb
    WHEN category = 'Earrings' THEN '[{"name":"Silver","hex":"#C0C0C0"}]'::jsonb
    WHEN category = 'Necklace' THEN '[{"name":"Rose Gold","hex":"#B76E79"}]'::jsonb
    ELSE '[{"name":"Default","hex":"#D4AF37"}]'::jsonb
  END AS colors,
  30 AS stock,
  true AS "inStock",
  4.7 AS rating,
  ARRAY['Cloudinary Synced', 'Premium Quality']::text[] AS features,
  NOW() AS "createdAt",
  NOW() AS "updatedAt"
FROM prepared
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  "originalPrice" = EXCLUDED."originalPrice",
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  colors = EXCLUDED.colors,
  stock = EXCLUDED.stock,
  "inStock" = EXCLUDED."inStock",
  rating = EXCLUDED.rating,
  features = EXCLUDED.features,
  "updatedAt" = NOW();

SELECT COUNT(*) AS after_count FROM "Product";
SELECT slug, name, category, images[1] AS primary_image
FROM "Product"
ORDER BY "updatedAt" DESC;
