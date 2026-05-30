import { Metadata } from 'next'
import OrderForm from '@/components/order/OrderForm'

export const metadata: Metadata = {
  title: 'Place an Order',
  description: 'Order your custom handcrafted press-on nails from Tati\'s Nails.',
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-gradient-nude pt-20">
      {/* Page header */}
      <div className="py-12 px-4 text-center">
        <span className="inline-block text-champagne-600 text-sm font-semibold tracking-widest uppercase mb-3">
          ✦ Custom Order
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-mink mb-3">
          Order Your Perfect Set
        </h1>
        <p className="text-nude-500 max-w-md mx-auto text-sm leading-relaxed">
          Fill out the form below and I&apos;ll be in touch within 24 hours to confirm your design.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <OrderForm />
      </div>
    </div>
  )
}
