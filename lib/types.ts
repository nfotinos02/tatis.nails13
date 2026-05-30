// =============================================
// TATI'S NAILS — Shared TypeScript Types
// =============================================

export type NailShape = 'almond' | 'coffin' | 'square' | 'oval' | 'stiletto'
export type NailLength = 'short' | 'medium' | 'long' | 'extra-long'
export type OrderStatus = 'new' | 'in-progress' | 'ready' | 'completed' | 'cancelled'
export type BudgetRange = 'under-25' | '25-50' | '50-75' | '75-100' | '100+'

export type GalleryCategory =
  | 'short'
  | 'medium'
  | 'long'
  | 'special-occasion'
  | 'seasonal'
  | 'custom-art'

export interface SizeMeasurements {
  thumb?: string
  index?: string
  middle?: string
  ring?: string
  pinky?: string
}

export interface Order {
  id: string
  order_number: string
  created_at: string
  updated_at: string

  // Customer info
  customer_name: string
  customer_email: string
  customer_phone: string

  // Nail preferences
  nail_shape: NailShape
  nail_length: NailLength
  primary_color: string
  secondary_color?: string
  design_notes?: string

  // Sizing
  size_measurements?: SizeMeasurements
  size_photo_url?: string

  // Inspiration images
  inspiration_image_urls: string[]

  // Order info
  desired_completion_date: string
  quantity: number
  budget_range: BudgetRange

  // Status
  status: OrderStatus
  admin_notes?: string
}

export interface OrderInsert
  extends Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'status'> {}

export interface GalleryItem {
  id: string
  created_at: string
  title: string
  description?: string
  image_url: string
  category: GalleryCategory
  is_featured: boolean
  sort_order: number
}

export interface Testimonial {
  id: string
  created_at: string
  customer_name: string
  rating: number
  review: string
  nail_type?: string
  is_approved: boolean
}

export interface OrderFormData {
  // Step 1 — Customer Info
  customer_name: string
  customer_email: string
  customer_phone: string

  // Step 2 — Nail Preferences
  nail_shape: NailShape
  nail_length: NailLength
  primary_color: string
  secondary_color: string
  design_notes: string

  // Step 3 — Sizing
  use_measurements: boolean
  thumb_size: string
  index_size: string
  middle_size: string
  ring_size: string
  pinky_size: string

  // Step 4 — Order Details
  desired_completion_date: string
  quantity: number
  budget_range: BudgetRange
}

// Labels for UI display
export const NAIL_SHAPE_LABELS: Record<NailShape, string> = {
  almond: 'Almond',
  coffin: 'Coffin',
  square: 'Square',
  oval: 'Oval',
  stiletto: 'Stiletto',
}

export const NAIL_LENGTH_LABELS: Record<NailLength, string> = {
  short: 'Short',
  medium: 'Medium',
  long: 'Long',
  'extra-long': 'Extra Long',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  'in-progress': 'In Progress',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
}

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  'under-25': 'Under $25',
  '25-50': '$25 – $50',
  '50-75': '$50 – $75',
  '75-100': '$75 – $100',
  '100+': '$100+',
}

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  short: 'Short Nails',
  medium: 'Medium Nails',
  long: 'Long Nails',
  'special-occasion': 'Special Occasion',
  seasonal: 'Seasonal Designs',
  'custom-art': 'Custom Art',
}
