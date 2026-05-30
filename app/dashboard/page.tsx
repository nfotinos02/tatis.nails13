'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, Eye, ChevronDown,
  Package, Clock, CheckCircle, Sparkles, X, Download
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  Order, OrderStatus,
  ORDER_STATUS_LABELS, ORDER_STATUS_COLORS,
  NAIL_SHAPE_LABELS, NAIL_LENGTH_LABELS, BUDGET_RANGE_LABELS
} from '@/lib/types'
import { formatDateTime, formatDate, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_OPTIONS: OrderStatus[] = ['new', 'in-progress', 'ready', 'completed', 'cancelled']

const STAT_CARDS = [
  { label: 'New Orders', status: 'new' as OrderStatus, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'In Progress', status: 'in-progress' as OrderStatus, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Ready', status: 'ready' as OrderStatus, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Completed', status: 'completed' as OrderStatus, icon: Sparkles, color: 'text-nude-600', bg: 'bg-nude-50' },
]

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [filtered, setFiltered] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin') {
      setAuthenticated(true)
      localStorage.setItem('tati_admin_auth', 'true')
    } else {
      toast.error('Incorrect password')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('tati_admin_auth')) setAuthenticated(true)
  }, [])

  useEffect(() => {
    if (!authenticated) return
    setLoading(true)
    const supabase = createClient()
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || [])
        setFiltered((data as Order[]) || [])
        setLoading(false)
      })
  }, [authenticated])

  useEffect(() => {
    let result = orders
    if (statusFilter !== 'all') result = result.filter((o) => o.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q) ||
          o.order_number.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, orders])

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      toast.error('Failed to update status')
      return
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    if (selected?.id === orderId) setSelected((prev) => prev ? { ...prev, status } : null)
    toast.success(`Order marked as ${ORDER_STATUS_LABELS[status]}`)
  }

  const countByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length

  const downloadCSV = () => {
    const headers = ['Order #', 'Date', 'Name', 'Email', 'Phone', 'Shape', 'Length', 'Color', 'Date Wanted', 'Qty', 'Budget', 'Status']
    const rows = filtered.map((o) => [
      o.order_number,
      formatDateTime(o.created_at),
      o.customer_name,
      o.customer_email,
      o.customer_phone,
      NAIL_SHAPE_LABELS[o.nail_shape],
      NAIL_LENGTH_LABELS[o.nail_length],
      o.primary_color,
      formatDate(o.desired_completion_date),
      o.quantity,
      BUDGET_RANGE_LABELS[o.budget_range],
      ORDER_STATUS_LABELS[o.status],
    ])

    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tatis-nails-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  // ─── Login Screen ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-nude flex items-center justify-center px-4 pt-20">
        <div className="card p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <Sparkles className="text-champagne-500 w-10 h-10 mx-auto mb-3" />
            <h1 className="font-display text-2xl text-mink">Admin Dashboard</h1>
            <p className="text-nude-400 text-sm mt-1">Tati&apos;s Nails</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-mink">Dashboard</h1>
            <p className="text-nude-400 text-sm mt-1">{orders.length} total orders</p>
          </div>
          <button onClick={downloadCSV} className="btn-outline text-sm py-2">
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, status, icon: Icon, color, bg }) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={cn(
                'card p-4 text-left transition-all hover:-translate-y-0.5',
                statusFilter === status && 'ring-2 ring-champagne-400'
              )}
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-2xl font-bold text-mink">{countByStatus(status)}</p>
              <p className="text-xs text-nude-400 font-medium mt-0.5">{label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
              placeholder="Search by name, email, or order #"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="input max-w-[180px]"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {/* Orders table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 shimmer rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-nude-400">No orders found</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-nude-50 border-b border-nude-100">
                    {['Order #', 'Customer', 'Design', 'Date Wanted', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-nude-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-nude-50 hover:bg-nude-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-nude-600">{order.order_number}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-mink text-xs">{order.customer_name}</p>
                        <p className="text-nude-400 text-xs">{order.customer_email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-mink">{NAIL_SHAPE_LABELS[order.nail_shape]} · {NAIL_LENGTH_LABELS[order.nail_length]}</p>
                        <p className="text-xs text-nude-400">{order.primary_color}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-nude-600 whitespace-nowrap">
                        {formatDate(order.desired_completion_date)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          className={cn(
                            'text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-1 focus:ring-champagne-400',
                            ORDER_STATUS_COLORS[order.status]
                          )}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(order)}
                          className="btn-ghost text-xs py-1.5 px-3"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-mink/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-xs text-nude-400 mb-1">Order Number</p>
                  <h2 className="font-display text-xl text-mink">{selected.order_number}</h2>
                  <p className="text-xs text-nude-400 mt-0.5">{formatDateTime(selected.created_at)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-nude-400 hover:text-mink">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between p-3 bg-nude-50 rounded-xl">
                  <span className="text-xs font-medium text-nude-500">Status</span>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value as OrderStatus)}
                    className={cn('text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer', ORDER_STATUS_COLORS[selected.status])}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>

                {/* Customer */}
                <Section title="Customer">
                  <Row label="Name" value={selected.customer_name} />
                  <Row label="Email" value={selected.customer_email} />
                  <Row label="Phone" value={selected.customer_phone} />
                </Section>

                {/* Design */}
                <Section title="Design">
                  <Row label="Shape" value={NAIL_SHAPE_LABELS[selected.nail_shape]} />
                  <Row label="Length" value={NAIL_LENGTH_LABELS[selected.nail_length]} />
                  <Row label="Primary Color" value={selected.primary_color} />
                  {selected.secondary_color && <Row label="Secondary Color" value={selected.secondary_color} />}
                  {selected.design_notes && <Row label="Notes" value={selected.design_notes} />}
                </Section>

                {/* Order info */}
                <Section title="Order Details">
                  <Row label="Desired Date" value={formatDate(selected.desired_completion_date)} />
                  <Row label="Quantity" value={`${selected.quantity} set${selected.quantity > 1 ? 's' : ''}`} />
                  <Row label="Budget" value={BUDGET_RANGE_LABELS[selected.budget_range]} />
                  <Row label="Inspiration Photos" value={`${selected.inspiration_image_urls?.length || 0} uploaded`} />
                </Section>

                {/* Inspiration images */}
                {selected.inspiration_image_urls?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-nude-500 uppercase tracking-wide mb-2">Inspiration Photos</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selected.inspiration_image_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Inspiration ${i + 1}`} className="aspect-square rounded-xl object-cover w-full hover:opacity-80 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-nude-500 uppercase tracking-wide mb-2">{title}</p>
      <div className="bg-nude-50 rounded-xl p-3 space-y-2">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-nude-400 flex-shrink-0">{label}</span>
      <span className="text-xs text-mink font-medium text-right">{value}</span>
    </div>
  )
}
