import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export function generateOrderConfirmationEmail(orderData: {
  customerName: string
  orderId: string
  rentalStartDate: string
  rentalEndDate: string
  totalPrice: number
  items: Array<{ productName: string; quantity: number; price: number }>
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Travel Tots - Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${orderData.customerName},</p>
            <p>Thank you for your order! We have received your rental request and will be in touch shortly to confirm delivery and collection arrangements.</p>
            
            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Rental Period:</strong> ${orderData.rentalStartDate} to ${orderData.rentalEndDate}</p>
              <p><strong>Total Amount:</strong> €${orderData.totalPrice.toFixed(2)}</p>
              
              <h3>Items:</h3>
              <ul>
                ${orderData.items.map(item => `
                  <li>${item.productName} x${item.quantity} - €${item.price.toFixed(2)}</li>
                `).join('')}
              </ul>
            </div>
            
            <p>We will contact you within 24 hours to confirm your order and arrange delivery.</p>
          </div>
          <div class="footer">
            <p>Travel Tots, Los Alcázares, Spain</p>
            <p>info@traveltots.es</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function generateAdminNotificationEmail(orderData: {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  rentalStartDate: string
  rentalEndDate: string
  totalPrice: number
  items: Array<{ productName: string; quantity: number; price: number }>
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ New Order Received</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>Action Required:</strong> A new rental request requires your attention.
            </div>
            
            <div class="order-details">
              <h2>Customer Information</h2>
              <p><strong>Name:</strong> ${orderData.customerName}</p>
              <p><strong>Email:</strong> ${orderData.customerEmail}</p>
              <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
              
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Rental Period:</strong> ${orderData.rentalStartDate} to ${orderData.rentalEndDate}</p>
              <p><strong>Total Amount:</strong> €${orderData.totalPrice.toFixed(2)}</p>
              
              <h3>Items:</h3>
              <ul>
                ${orderData.items.map(item => `
                  <li>${item.productName} x${item.quantity} - €${item.price.toFixed(2)}</li>
                `).join('')}
              </ul>
            </div>
            
            <p><a href="${process.env.APP_URL}/admin/orders/${orderData.orderId}" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order in Admin Panel</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}

