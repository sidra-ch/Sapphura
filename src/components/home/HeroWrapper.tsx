import { getDynamicMediaLibrary } from '@/lib/cloudinary'
import HeroClient from './Hero'

export default async function Hero() {
  let initialMedia = null
  let error = null

  try {
    // Pre-fetch media on server
    initialMedia = await getDynamicMediaLibrary()
  } catch (err) {
    console.error('Server-side media fetch failed:', err)
    error = 'Failed to load media'
  }

  return <HeroClient initialMedia={initialMedia} initialError={error} />
}
