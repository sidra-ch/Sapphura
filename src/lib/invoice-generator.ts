import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

interface InvoiceData {
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  items: {
    productName: string
    quantity: number
    price: number
  }[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  createdAt: Date
  paymentMethod: string
}

/**
 * Generate PDF invoice and return as Buffer
 */
export function generateInvoicePDF(data: InvoiceData): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15

  // Header with company info
  doc.setDrawColor(102, 126, 234) // Purple color
  doc.setLineWidth(2)
  doc.line(margin, margin + 10, pageWidth - margin, margin + 10)

  doc.setFontSize(24)
  doc.setTextColor(102, 126, 234)
  doc.text('SAPPURA', margin, margin + 8)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Premium Jewelry', margin, margin + 15)
  doc.text('info@sappura.com', margin, margin + 20)
  doc.text('+92-300-XXXX-XXXX', margin, margin + 25)

  // Invoice title
  doc.setFontSize(18)
  doc.setTextColor(102, 126, 234)
  doc.text('INVOICE', pageWidth - margin - 40, margin + 8)

  // Invoice details box
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  let yPos = margin + 35

  doc.text(`Invoice #: ${data.orderNumber}`, pageWidth - margin - 80, yPos)
  yPos += 7
  doc.text(`Date: ${data.createdAt.toLocaleDateString()}`, pageWidth - margin - 80, yPos)
  yPos += 7
  doc.text(`Due Date: ${new Date(data.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, pageWidth - margin - 80, yPos)

  // Customer info section
  yPos = margin + 35
  doc.setTextColor(102, 126, 234)
  doc.setFontSize(11)
  doc.text('BILL TO:', margin, yPos)

  yPos += 7
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text(data.customerName, margin, yPos)
  yPos += 5
  doc.text(data.address, margin, yPos)
  yPos += 5
  doc.text(data.city, margin, yPos)
  yPos += 5
  doc.text(`Phone: ${data.phone}`, margin, yPos)
  yPos += 5
  doc.text(`Email: ${data.email}`, margin, yPos)

  // Items table
  yPos += 10

  const tableData = data.items.map(item => [
    item.productName,
    item.quantity.toString(),
    `Rs. ${item.price.toFixed(2)}`,
    `Rs. ${(item.price * item.quantity).toFixed(2)}`
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['Product', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { left: margin, right: margin },
    didDrawPage: (data: any) => {
      // Footer
      const pageCount = (doc.internal as any).pages.length - 1
      const page = (doc.internal as any).pageNumber || 1
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${page} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' as any }
      )
    }
  })

  // Summary section
  yPos = (doc as any).lastAutoTable.finalY + 10

  // Summary box
  doc.setDrawColor(200, 200, 200)
  doc.rect(pageWidth - margin - 60, yPos, 55, 40)

  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  
  let summaryY = yPos + 5
  doc.text('Subtotal:', pageWidth - margin - 55, summaryY)
  doc.text(`Rs. ${data.subtotal.toFixed(2)}`, pageWidth - margin - 15, summaryY, { align: 'right' })

  summaryY += 6
  doc.text('Shipping:', pageWidth - margin - 55, summaryY)
  doc.text(`Rs. ${data.shipping.toFixed(2)}`, pageWidth - margin - 15, summaryY, { align: 'right' })

  summaryY += 6
  doc.text('Tax:', pageWidth - margin - 55, summaryY)
  doc.text(`Rs. ${data.tax.toFixed(2)}`, pageWidth - margin - 15, summaryY, { align: 'right' })

  // Total line
  doc.setDrawColor(102, 126, 234)
  doc.setLineWidth(0.5)
  doc.line(pageWidth - margin - 60, summaryY + 3, pageWidth - margin - 5, summaryY + 3)

  summaryY += 8
  doc.setFontSize(11)
  doc.setTextColor(102, 126, 234)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', pageWidth - margin - 55, summaryY)
  doc.text(`Rs. ${data.total.toFixed(2)}`, pageWidth - margin - 15, summaryY, { align: 'right' })

  // Payment method
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  
  doc.text(`Payment Method: ${data.paymentMethod}`, margin, yPos + 10)

  // Footer message
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  const footerY = pageHeight - 25
  doc.text('Terms & Conditions:', margin, footerY)
  doc.text(
    'Thank you for your purchase! Please keep this invoice for your records. For returns or exchanges, see our return policy at sappura.com/return',
    margin,
    footerY + 5,
    { maxWidth: pageWidth - 2 * margin }
  )

  return Buffer.from(doc.output('arraybuffer'))
}

/**
 * Generate invoice and send as email attachment
 */
export async function generateAndEmailInvoice(data: InvoiceData, customerEmail: string) {
  try {
    const pdfBuffer = generateInvoicePDF(data)
    // This would integrate with SendGrid to send email with attachment
    // Implementation depends on SendGrid SDK
    console.log('[INVOICE] Generated PDF for order:', data.orderNumber)
    console.log('[INVOICE] PDF size:', pdfBuffer.length, 'bytes')
    return pdfBuffer
  } catch (error) {
    console.error('[INVOICE] Error generating invoice:', error)
    throw error
  }
}
