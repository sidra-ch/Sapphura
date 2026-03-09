import nodemailer from 'nodemailer'

// Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Verify transporter configuration
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Gmail SMTP configuration error:', error)
    } else {
      console.log('✅ Gmail SMTP is ready to send emails')
    }
  })
} else {
  console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASSWORD not set. Email functionality disabled.')
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

/**
 * Send email using Gmail SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('[EMAIL] Gmail credentials not configured. Logging email instead:')
      console.log(`To: ${options.to}`)
      console.log(`Subject: ${options.subject}`)
      console.log(`Body:\n${options.html}`)
      return true
    }

    const mailOptions = {
      from: options.from || `"Sappura" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }

    await transporter.sendMail(mailOptions)
    console.log(`✅ [EMAIL SENT] To: ${options.to}, Subject: ${options.subject}`)
    return true
  } catch (error) {
    console.error('❌ [EMAIL ERROR]', error)
    return false
  }
}

/**
 * Send order confirmation email
 */
export function generateOrderConfirmationEmail(orderData: {
  orderNumber: string
  customerName: string
  email: string
  products: any[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  address: string
  city: string
}): string {
  const productList = orderData.products
    .map(
      (item: any) =>
        `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.productName}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        Rs. ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .header h1 { margin: 0; }
        .content { padding: 20px 0; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .label { font-weight: bold; color: #667eea; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; }
        .summary { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-row { font-weight: bold; font-size: 18px; color: #667eea; border-top: 2px solid #667eea; padding-top: 10px; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; }
        .cta-button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Order Confirmed!</h1>
          <p>Thank you for shopping at Sappura</p>
        </div>

        <div class="content">
          <p>Hi <strong>${orderData.customerName}</strong>,</p>
          <p>Your order has been confirmed and is being processed. Here are your order details:</p>

          <div class="order-details">
            <p><span class="label">Order Number:</span> #${orderData.orderNumber}</p>
            <p><span class="label">Order Date:</span> ${new Date().toLocaleDateString()}</p>
            <p><span class="label">Email:</span> ${orderData.email}</p>
          </div>

          <h3>Shipping Address</h3>
          <p>
            ${orderData.address}<br>
            ${orderData.city}
          </p>

          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${productList}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>Rs. ${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>Rs. ${orderData.shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>Rs. ${orderData.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>Rs. ${orderData.total.toFixed(2)}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://sappura.com'}/order-confirmation/${orderData.orderNumber}" class="cta-button">
              View Order Details
            </a>
          </div>

          <p>We'll send you a shipping update shortly. Thank you for your purchase!</p>
        </div>

        <div class="footer">
          <p>&copy; 2024 Sappura. All rights reserved.</p>
          <p>If you have any questions, reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Send password reset email
 */
export function generatePasswordResetEmail(data: {
  name: string
  resetLink: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; }
        .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .cta-button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>

        <div class="content">
          <p>Hi ${data.name},</p>
          <p>You requested a password reset for your Sappura account. Click the button below to reset your password:</p>

          <div style="text-align: center;">
            <a href="${data.resetLink}" class="cta-button">
              Reset Password
            </a>
          </div>

          <p>This link will expire in 1 hour.</p>

          <div class="warning">
            <strong>⚠️ Security Note:</strong> If you didn't request this, please ignore this email.
          </div>

          <p>You can also copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${data.resetLink}</p>
        </div>

        <div class="footer">
          <p>&copy; 2024 Sappura. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Send contact form response email
 */
export function generateContactResponseEmail(data: {
  name: string
  message: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>We Received Your Message</h1>
        </div>

        <div class="content">
          <p>Hi ${data.name},</p>
          <p>Thank you for contacting Sappura. We've received your message and will get back to you as soon as possible.</p>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Message:</strong></p>
            <p>${data.message}</p>
          </div>

          <p>Our team typically responds within 24 hours. Thank you for your patience!</p>
        </div>

        <div class="footer">
          <p>&copy; 2024 Sappura. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
