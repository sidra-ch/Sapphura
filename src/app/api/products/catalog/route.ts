import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '16');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * limit;

    // Build the "Where" clause based on search
    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Build the "OrderBy" clause based on sort
    let orderByClause: any = { createdAt: 'desc' }; // default newest
    if (sort === 'price_asc') orderByClause = { price: 'asc' };
    if (sort === 'price_desc') orderByClause = { price: 'desc' };
    if (sort === 'name_asc') orderByClause = { name: 'asc' };

    // Fetch total count for pagination math
    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    // Fetch actual paginated data
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
    });

    // Format products for frontend
    const formattedProducts = products.map((p) => {
      // Safely parse media JSON
      let heroImage = '/placeholder.png';
      try {
        if (p.media && typeof p.media === 'string') {
          const mediaArr = JSON.parse(p.media);
          if (Array.isArray(mediaArr) && mediaArr.length > 0) {
            heroImage = mediaArr[0].url;
          }
        }
      } catch (e) {
        // fallback to dummy if invalid JSON
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        image: heroImage,
        isNewArrival: p.isNewArrival,
        inStock: p.stock > 0,
        category: p.category,
        collections: p.collections,
      };
    });

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      total: totalCount,
    });

  } catch (error: any) {
    // error logging removed for production
    // console.error('Catalog API Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}
