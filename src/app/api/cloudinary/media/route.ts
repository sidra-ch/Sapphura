import { NextResponse } from 'next/server';
import { getDynamicMediaLibrary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const media = await getDynamicMediaLibrary();
    return NextResponse.json(
      { success: true, media },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
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
