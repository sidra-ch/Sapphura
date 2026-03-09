import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/reviews - Create new review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { productId, userName, email, rating, comment } = body

    // Validate required fields
    if (!productId || !userName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userName,
        email: email || '',
        rating,
        comment,
        verified: false, // Can be updated after order verification
      },
    })

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId },
    })

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully',
    })
  } catch (error) {
    console.error('❌ Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}

// GET /api/reviews?productId=xxx - Get reviews for a product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
    })
  } catch (error) {
    console.error('❌ Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
