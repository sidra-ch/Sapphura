import { NextResponse } from 'next/server'
import { sendEmail, generateContactResponseEmail } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Log the contact request
    console.log('Contact request:', {
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    })

    // Send confirmation email to customer
    const customerEmailHtml = generateContactResponseEmail({
      name,
      message
    })

    await sendEmail({
      to: email,
      subject: 'We Received Your Message',
      html: customerEmailHtml
    })

    // Send notification email to admin
    const adminEmailHtml = `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@sappura.com',
      subject: `New Contact: ${name}`,
      html: adminEmailHtml
    })

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you shortly.',
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
