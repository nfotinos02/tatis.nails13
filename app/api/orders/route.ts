import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateOrderNumber } from '@/lib/utils'
import { sendCustomerConfirmation, sendOwnerNotification } from '@/lib/email'
import { Order, NailShape, NailLength, BudgetRange, SizeMeasurements } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const supabase = createAdminClient()

    // ─── Parse fields ──────────────────────────────────────────────────────
    const get = (key: string) => formData.get(key)?.toString() || ''

    const customerName = get('customer_name')
    const customerEmail = get('customer_email')
    const customerPhone = get('customer_phone')
    const nailShape = get('nail_shape') as NailShape
    const nailLength = get('nail_length') as NailLength
    const primaryColor = get('primary_color')
    const secondaryColor = get('secondary_color') || undefined
    const designNotes = get('design_notes') || undefined
    const desiredDate = get('desired_completion_date')
    const quantity = parseInt(get('quantity') || '1')
    const budgetRange = get('budget_range') as BudgetRange

    // Validate required
    if (!customerName || !customerEmail || !customerPhone || !nailShape || !nailLength || !primaryColor || !desiredDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ─── Sizing ────────────────────────────────────────────────────────────
    let sizeMeasurements: SizeMeasurements | undefined
    const useMeasurements = get('use_measurements') === 'true'
    if (useMeasurements) {
      const measurements: SizeMeasurements = {
        thumb: get('thumb_size') || undefined,
        index: get('index_size') || undefined,
        middle: get('middle_size') || undefined,
        ring: get('ring_size') || undefined,
        pinky: get('pinky_size') || undefined,
      }
      const hasMeasurements = Object.values(measurements).some(Boolean)
      if (hasMeasurements) sizeMeasurements = measurements
    }

    // ─── Upload inspiration images ─────────────────────────────────────────
    const inspirationFiles = formData.getAll('inspiration_images') as File[]
    const inspirationUrls: string[] = []

    for (const file of inspirationFiles) {
      if (!file.size) continue
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { data, error } = await supabase.storage
        .from('inspiration-images')
        .upload(fileName, file, { contentType: file.type, upsert: false })

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('inspiration-images')
          .getPublicUrl(data.path)
        inspirationUrls.push(urlData.publicUrl)
      }
    }

    // ─── Upload size photo ─────────────────────────────────────────────────
    let sizePhotoUrl: string | undefined
    const sizePhotoFile = formData.get('size_photo') as File | null
    if (sizePhotoFile && sizePhotoFile.size) {
      const fileName = `size-${Date.now()}-${sizePhotoFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { data, error } = await supabase.storage
        .from('size-photos')
        .upload(fileName, sizePhotoFile, { contentType: sizePhotoFile.type })

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('size-photos')
          .getPublicUrl(data.path)
        sizePhotoUrl = urlData.publicUrl
      }
    }

    // ─── Insert order ──────────────────────────────────────────────────────
    const orderNumber = generateOrderNumber()

    const { data: insertedOrder, error: insertError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        nail_shape: nailShape,
        nail_length: nailLength,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        design_notes: designNotes,
        size_measurements: sizeMeasurements || null,
        size_photo_url: sizePhotoUrl || null,
        inspiration_image_urls: inspirationUrls,
        desired_completion_date: desiredDate,
        quantity,
        budget_range: budgetRange,
        status: 'new',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    const order = insertedOrder as Order

    // ─── Send emails (don't block response on failure) ─────────────────────
    await Promise.allSettled([
      sendCustomerConfirmation(order),
      sendOwnerNotification(order),
    ])

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (err: any) {
    console.error('Order API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET — fetch orders (used by customer tracking)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const orderNumber = searchParams.get('order_number')

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  let query = supabase
    .from('orders')
    .select('*')
    .ilike('customer_email', email)
    .order('created_at', { ascending: false })

  if (orderNumber) {
    query = query.ilike('order_number', `%${orderNumber}%`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })

  return NextResponse.json({ orders: data })
}
