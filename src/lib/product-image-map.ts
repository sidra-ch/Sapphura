export type CloudinaryImageAsset = {
  publicId: string
  secureUrl: string
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

// Strict slug-based mapping. Keep this list updated whenever new products are added.
const PRODUCT_IMAGE_KEYWORDS: Record<string, string[]> = {
  'bridal-necklace-set': ['bridalnecklace', 'necklace', 'bridalset', 'bridal'],
  'pearl-drop-earrings': ['pearldropearring', 'earring', 'jhumka', 'jhumki'],
  'kundan-bridal-set': ['kundanbridal', 'kundan', 'bridalset', 'bridal'],
  'luxury-bangles-set': ['luxurybangle', 'bangles', 'bangle', 'kangan', 'churi'],
  'gold-plated-bangles': ['goldplatedbangle', 'bangles', 'bangle', 'kangan'],
  'gold-plated-ring': ['goldplatedring', 'ring', 'rings', 'fingerring'],
  'antique-anklet': ['antiqueanklet', 'anklet', 'anklets', 'payal', 'paayal'],
  'diamond-pendant': ['diamondpendant', 'pendant', 'necklace'],
  'crystal-studs': ['crystalstud', 'stud', 'earring', 'earrings'],
  'embroidered-suit': ['embroideredsuit', 'suit', 'dress', 'pret'],
  'luxury-lawn-suit': ['luxurylawnsuit', 'lawnsuit', 'suit', 'lawn'],
  'accessories-collection': ['accessories', 'accessory', 'collection'],
}

const buildFallbackKeywords = (name: string, slug: string) => {
  const text = `${name} ${slug}`.toLowerCase()
  const keywords = new Set<string>()

  if (text.includes('ring')) keywords.add('ring')
  if (text.includes('bangle')) keywords.add('bangle')
  if (text.includes('earring') || text.includes('jhumka')) keywords.add('earring')
  if (text.includes('necklace')) keywords.add('necklace')
  if (text.includes('anklet') || text.includes('payal')) keywords.add('anklet')
  if (text.includes('bridal')) keywords.add('bridal')
  if (text.includes('suit')) keywords.add('suit')
  if (text.includes('accessory')) keywords.add('accessory')

  if (keywords.size === 0) {
    text
      .split(/[-\s]+/)
      .filter((word) => word.length > 3)
      .forEach((word) => keywords.add(word))
  }

  return Array.from(keywords)
}

export function getMappedCloudinaryImage(
  slug: string,
  name: string,
  assets: CloudinaryImageAsset[]
): string | null {
  if (!assets.length) return null

  const normalizedSlug = normalize(slug)
  const exactBySlug = assets.find((asset) => normalize(asset.publicId).includes(normalizedSlug))
  if (exactBySlug) return exactBySlug.secureUrl

  const configuredKeywords = PRODUCT_IMAGE_KEYWORDS[slug] ?? buildFallbackKeywords(name, slug)
  const normalizedKeywords = configuredKeywords.map(normalize)

  const match = assets.find((asset) => {
    const publicId = normalize(asset.publicId)
    return normalizedKeywords.some((keyword) => publicId.includes(keyword))
  })

  return match?.secureUrl ?? null
}
