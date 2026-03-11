import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const position = searchParams.get('position')
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (type) {
      where.type = type.toUpperCase()
    }

    if (position) {
      where.position = position.toUpperCase()
    }

    if (active !== null) {
      where.isActive = active === 'true'
    }

    // Check date range for scheduled banners
    const now = new Date()
    where.OR = [
      { startDate: null, endDate: null },
      { startDate: null, endDate: { gte: now } },
      { startDate: { lte: now }, endDate: null },
      { startDate: { lte: now }, endDate: { gte: now } }
    ]

    const banners = await prisma.banner.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({
      success: true,
      banners
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      subtitle, 
      description, 
      imageUrl, 
      mobileUrl, 
      videoUrl,
      linkUrl, 
      linkText, 
      collectionSlug,
      type, 
      position, 
      sortOrder,
      startDate,
      endDate 
    } = body

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        description,
        imageUrl,
        mobileUrl,
        videoUrl,
        linkUrl,
        linkText,
        collectionSlug,
        type: type?.toUpperCase() || 'HOME',
        position: position?.toUpperCase() || 'HERO',
        sortOrder: sortOrder || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    })

    return NextResponse.json({
      success: true,
      banner
    })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
