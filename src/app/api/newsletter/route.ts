import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletterSubscription.findFirst({
      where: { email }
    })

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { success: false, error: 'Email is already subscribed' },
          { status: 409 }
        )
      } else {
        // Reactivate existing subscription
        await prisma.newsletterSubscription.update({
          where: { id: existingSubscription.id },
          data: { isActive: true, updatedAt: new Date() }
        })
        
        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated successfully'
        })
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription successful',
      subscription
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const active = searchParams.get('active')

    const where: any = {}
    if (active !== null) {
      where.isActive = active === 'true'
    }

    const subscriptions = await prisma.newsletterSubscription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.newsletterSubscription.count({ where })

    return NextResponse.json({
      success: true,
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')

    if (!id && !email) {
      return NextResponse.json(
        { success: false, error: 'ID or email is required' },
        { status: 400 }
      )
    }

    const where: any = {}
    if (id) where.id = id
    if (email) where.email = email

    await prisma.newsletterSubscription.delete({ where })

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription' },
      { status: 500 }
    )
  }
}
