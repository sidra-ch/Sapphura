import { NextResponse } from 'next/server';
import { getDynamicMediaLibrary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const media = await getDynamicMediaLibrary();
    return NextResponse.json(
      { success: true, media },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5min, CDN for 10min
          'Vary': 'Accept-Encoding',
        },
      }
    );
  } catch (error) {
    console.error('Failed to load Cloudinary media:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load media',
      },
      { status: 500 }
    );
  }
}
