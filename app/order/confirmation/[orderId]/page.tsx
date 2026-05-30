import { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDate, NAIL_SHAPE_LABELS, NAIL_LENGTH_LABELS } from '@/lib/utils'
import { Order } from '@/lib/types'
import { Check, ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Confirmed!',
}

export default async function ConfirmationPage({
  params,
}: {
  params: { orderId: string }
}) {
  let order: Order | null = null

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single()
    order = data
  } catch {}

  return (
    <div className="min-h-screen bg-gradient-nude pt-20 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Check size={36} className="text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-mink mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-nude-500 text-sm leading-relaxed">
            Thank you! I&apos;ll review your order and reach out within <strong>24 hours</strong> to confirm your design details.
          </p>
        </div>

        {/* Order details card */}
        {order && (
          <div className="card p-6 mb-6">
            <div className="text-center mb-5 pb-5 border-b border-nude-100">
              <p className="text-xs text-nude-400 uppercase tracking-widest mb-1">Order Number</p>
              <p className="font-display text-2xl text-mink">{order.order_number}</p>
            </div>

            <div className="space-y-3">
              {[
                ['Name', order.customer_name],
                ['Email', order.customer_email],
                ['Shape', NAIL_SHAPE_LABELS[order.nail_shape]],
                ['Length', NAIL_LENGTH_LABELS[order.nail_length]],
                ['Primary Color', order.primary_color],
                ['Desired Date', formatDate(order.desired_completion_date)],
                ['Quantity', `${order.quantity} set${order.quantity > 1 ? 's' : ''}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-nude-400">{label}</span>
                  <span className="text-mink font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>

            {order.design_notes && (
              <div className="mt-4 pt-4 border-t border-nude-100">
                <p className="text-xs text-nude-400 uppercase tracking-widest mb-1">Design Notes</p>
                <p className="text-sm text-nude-600 leading-relaxed">{order.design_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* What's next */}
        <div className="card p-5 mb-6 bg-champagne-50 border-champagne-200">
          <h3 className="text-sm font-semibold text-mink mb-3">What happens next?</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Check your email for a confirmation with your order details.' },
              { step: '2', text: "I'll reach out within 24 hours to confirm your design and discuss any details." },
              { step: '3', text: "Once approved, I'll start handcrafting your custom set!" },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{step}</span>
                </div>
                <p className="text-xs text-nude-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/my-orders" className="btn-primary justify-center">
            Track Your Order
            <ArrowRight size={16} />
          </Link>
          <Link href="/" className="btn-ghost justify-center text-nude-500">
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
