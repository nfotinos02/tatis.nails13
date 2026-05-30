'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS,
  NAIL_SHAPE_LABELS, NAIL_LENGTH_LABELS
} from '@/lib/types'
import { formatDate, formatDateTime, cn } from '@/lib/utils'
import Link from 'next/link'

const STATUS_STEPS = ['new', 'in-progress', 'ready', 'completed'] as const
const STATUS_EMOJIS: Record<string, string> = {
  new: '📋',
  'in-progress': '🎨',
  ready: '📦',
  completed: '✨',
  cancelled: '❌',
}

export default function MyOrdersPage() {
  const [email, setEmail] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')
    setSearched(false)

    const supabase = createClient()
    let query = supabase
      .from('orders')
      .select('*')
      .ilike('customer_email', email.trim())
      .order('created_at', { ascending: false })

    if (orderNumber.trim()) {
      query = query.ilike('order_number', `%${orderNumber.trim()}%`)
    }

    const { data, error: err } = await query

    setLoading(false)
    setSearched(true)

    if (err) {
      setError('Something went wrong. Please try again.')
      return
    }

    setOrders((data as Order[]) || [])
  }

  const getStatusStep = (status: string) =>
    STATUS_STEPS.indexOf(status as any)

  return (
    <div className="min-h-screen bg-gradient-nude pt-20">
      {/* Header */}
      <div className="py-12 px-4 text-center">
        <span className="inline-block text-champagne-600 text-sm font-semibold tracking-widest uppercase mb-3">
          ✦ Order Tracking
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-mink mb-3">
          Track Your Orders
        </h1>
        <p className="text-nude-500 max-w-sm mx-auto text-sm">
          Enter the email you used when ordering to see your order status.
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-20">
        {/* Search form */}
        <div className="card p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="The email you used when ordering"
                required
              />
            </div>
            <div>
              <label className="label">
                Order Number <span className="text-nude-400 font-normal">(optional)</span>
              </label>
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="input"
                placeholder="e.g. TN-20240501-A3F2"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Find My Orders
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {error ? (
              <div className="card p-6 text-center">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="card p-10 text-center">
                <Package size={32} className="mx-auto mb-3 text-nude-300" />
                <p className="text-nude-500 font-medium mb-1">No orders found</p>
                <p className="text-nude-400 text-sm mb-4">
                  Double-check your email address, or place your first order!
                </p>
                <Link href="/order" className="btn-primary text-sm py-2.5">
                  Place an Order
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-nude-400 text-sm">Found {orders.length} order{orders.length > 1 ? 's' : ''}</p>
                {orders.map((order) => (
                  <div key={order.id} className="card p-5">
                    {/* Order header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-nude-400 mb-0.5">Order Number</p>
                        <p className="font-mono text-sm font-bold text-mink">{order.order_number}</p>
                        <p className="text-xs text-nude-400 mt-0.5">{formatDateTime(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <span className={cn('badge text-xs', ORDER_STATUS_COLORS[order.status])}>
                          {STATUS_EMOJIS[order.status]} {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </div>
                    </div>

                    {/* Progress tracker */}
                    {order.status !== 'cancelled' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute left-0 right-0 top-3 h-0.5 bg-nude-100" />
                          <div
                            className="absolute left-0 top-3 h-0.5 bg-gradient-brand transition-all duration-500"
                            style={{
                              width: `${(getStatusStep(order.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                            }}
                          />
                          {STATUS_STEPS.map((s, i) => {
                            const current = getStatusStep(order.status)
                            const done = i <= current
                            return (
                              <div key={s} className="relative flex flex-col items-center gap-1.5 z-10">
                                <div
                                  className={cn(
                                    'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all',
                                    done
                                      ? 'bg-gradient-brand border-transparent text-white'
                                      : 'bg-white border-nude-200 text-nude-300'
                                  )}
                                >
                                  {done ? '✓' : i + 1}
                                </div>
                                <span className="text-xs text-nude-400 text-center max-w-[60px]">
                                  {ORDER_STATUS_LABELS[s]}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-nude-50 rounded-xl p-3">
                      <div>
                        <span className="text-nude-400">Shape</span>
                        <p className="text-mink font-medium">{NAIL_SHAPE_LABELS[order.nail_shape]}</p>
                      </div>
                      <div>
                        <span className="text-nude-400">Length</span>
                        <p className="text-mink font-medium">{NAIL_LENGTH_LABELS[order.nail_length]}</p>
                      </div>
                      <div>
                        <span className="text-nude-400">Color</span>
                        <p className="text-mink font-medium">{order.primary_color}</p>
                      </div>
                      <div>
                        <span className="text-nude-400">Desired Date</span>
                        <p className="text-mink font-medium">{formatDate(order.desired_completion_date)}</p>
                      </div>
                    </div>

                    {/* Status message */}
                    {order.status === 'ready' && (
                      <div className="mt-3 p-3 bg-green-50 rounded-xl text-xs text-green-700 font-medium text-center">
                        🎉 Your nails are ready! Check your email for pickup/shipping details.
                      </div>
                    )}
                    {order.status === 'new' && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700 text-center">
                        I&apos;ll reach out within 24 hours to confirm your design!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
