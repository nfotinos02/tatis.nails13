import nodemailer from 'nodemailer'
import { Order } from './types'
import { formatDate } from './utils'
import { NAIL_SHAPE_LABELS, NAIL_LENGTH_LABELS, BUDGET_RANGE_LABELS } from './types'

// Re-export from types for convenience
export { NAIL_SHAPE_LABELS, NAIL_LENGTH_LABELS, BUDGET_RANGE_LABELS }

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

const brandColor = '#C08A62'
const brandLight = '#FAF6F1'

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#C08A62,#D4A44A);padding:40px 40px 32px;text-align:center;">
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:4px;text-transform:uppercase;font-family:system-ui,sans-serif;">✦ Handcrafted with love ✦</p>
            <h1 style="margin:8px 0 0;font-size:36px;color:#ffffff;font-family:Georgia,serif;font-weight:normal;letter-spacing:2px;">Tati's Nails</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:${brandLight};padding:24px 40px;text-align:center;border-top:1px solid #EDD8C4;">
            <p style="margin:0;font-size:12px;color:#9A8070;font-family:system-ui,sans-serif;">
              Questions? Reply to this email or DM us on Instagram.<br>
              © ${new Date().getFullYear()} Tati's Nails. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendCustomerConfirmation(order: Order): Promise<void> {
  const content = `
    <h2 style="margin:0 0 8px;font-size:24px;color:#2C1810;font-family:Georgia,serif;font-weight:normal;">
      Order Confirmed! 🌸
    </h2>
    <p style="margin:0 0 24px;color:#7A6558;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;">
      Hi ${order.customer_name}, thank you so much for your order! I'm so excited to create your custom set.
      Here's a summary of what you ordered:
    </p>

    <table width="100%" style="background:${brandLight};border-radius:8px;padding:24px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${brandColor};font-family:system-ui,sans-serif;">Order Number</p>
          <p style="margin:0 0 20px;font-size:22px;font-weight:bold;color:#2C1810;font-family:Georgia,serif;">${order.order_number}</p>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${detailRow('Shape', NAIL_SHAPE_LABELS[order.nail_shape])}
            ${detailRow('Length', NAIL_LENGTH_LABELS[order.nail_length])}
            ${detailRow('Primary Color', order.primary_color)}
            ${order.secondary_color ? detailRow('Secondary Color', order.secondary_color) : ''}
            ${detailRow('Quantity', `${order.quantity} set${order.quantity > 1 ? 's' : ''}`)}
            ${detailRow('Desired Date', formatDate(order.desired_completion_date))}
            ${detailRow('Budget', BUDGET_RANGE_LABELS[order.budget_range])}
          </table>
        </td>
      </tr>
    </table>

    ${order.design_notes ? `
    <div style="border-left:3px solid ${brandColor};padding:12px 16px;margin-bottom:24px;background:#FDF9F5;border-radius:0 6px 6px 0;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${brandColor};font-family:system-ui,sans-serif;">Your Design Notes</p>
      <p style="margin:0;color:#5A4A40;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;">${order.design_notes}</p>
    </div>` : ''}

    <p style="margin:0 0 8px;color:#7A6558;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;">
      <strong>What happens next?</strong><br>
      I'll review your order and reach out within <strong>24 hours</strong> to confirm details and discuss your design.
      Keep an eye on your inbox!
    </p>

    <p style="margin:24px 0 0;color:#7A6558;font-family:system-ui,sans-serif;font-size:14px;">
      With love,<br>
      <em style="color:${brandColor};font-size:18px;font-family:Georgia,serif;">Tati 💅</em>
    </p>
  `

  await transporter.sendMail({
    from: `"Tati's Nails" <${process.env.EMAIL_FROM}>`,
    to: order.customer_email,
    subject: `✨ Order Confirmed — ${order.order_number} | Tati's Nails`,
    html: emailWrapper(content),
  })
}

export async function sendOwnerNotification(order: Order): Promise<void> {
  const content = `
    <h2 style="margin:0 0 8px;font-size:24px;color:#2C1810;font-family:Georgia,serif;font-weight:normal;">
      New Order Received! 🎉
    </h2>
    <p style="margin:0 0 24px;color:#7A6558;font-family:system-ui,sans-serif;font-size:15px;">
      You have a new order from <strong>${order.customer_name}</strong>.
    </p>

    <table width="100%" style="background:${brandLight};border-radius:8px;padding:24px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
      <tr><td>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${brandColor};font-family:system-ui,sans-serif;">Order Number</p>
        <p style="margin:0 0 20px;font-size:22px;font-weight:bold;color:#2C1810;font-family:Georgia,serif;">${order.order_number}</p>

        <table width="100%" cellpadding="0" cellspacing="0">
          ${detailRow('Customer', order.customer_name)}
          ${detailRow('Email', order.customer_email)}
          ${detailRow('Phone', order.customer_phone)}
          ${detailRow('Shape', NAIL_SHAPE_LABELS[order.nail_shape])}
          ${detailRow('Length', NAIL_LENGTH_LABELS[order.nail_length])}
          ${detailRow('Primary Color', order.primary_color)}
          ${order.secondary_color ? detailRow('Secondary Color', order.secondary_color) : ''}
          ${detailRow('Quantity', `${order.quantity} set${order.quantity > 1 ? 's' : ''}`)}
          ${detailRow('Desired Date', formatDate(order.desired_completion_date))}
          ${detailRow('Budget', BUDGET_RANGE_LABELS[order.budget_range])}
          ${detailRow('Inspiration Photos', `${order.inspiration_image_urls.length} uploaded`)}
        </table>
      </td></tr>
    </table>

    ${order.design_notes ? `
    <div style="border-left:3px solid ${brandColor};padding:12px 16px;margin-bottom:24px;background:#FDF9F5;border-radius:0 6px 6px 0;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${brandColor};font-family:system-ui,sans-serif;">Design Notes</p>
      <p style="margin:0;color:#5A4A40;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;">${order.design_notes}</p>
    </div>` : ''}

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
       style="display:inline-block;background:linear-gradient(135deg,#C08A62,#D4A44A);color:white;text-decoration:none;padding:14px 28px;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.5px;">
      View in Dashboard →
    </a>
  `

  await transporter.sendMail({
    from: `"Tati's Nails Orders" <${process.env.EMAIL_FROM}>`,
    to: process.env.OWNER_EMAIL,
    subject: `💅 New Order: ${order.order_number} from ${order.customer_name}`,
    html: emailWrapper(content),
  })
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 0;border-bottom:1px solid #EDD8C4;font-family:system-ui,sans-serif;font-size:13px;color:#9A8070;width:40%;">${label}</td>
      <td style="padding:6px 0;border-bottom:1px solid #EDD8C4;font-family:system-ui,sans-serif;font-size:13px;color:#2C1810;font-weight:500;">${value}</td>
    </tr>
  `
}
