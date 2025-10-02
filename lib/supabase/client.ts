import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Client-side Supabase client
export const supabase = createClientComponentClient()

// Server-side Supabase client (for API routes)
export const createServerSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Database types
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'support' | 'user'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
export type ProductCategory = 'kitchens' | 'doors' | 'windows'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category: ProductCategory
  price: number
  discount_price: number | null
  images: string[]
  features: string[]
  specifications: Record<string, any>
  is_featured: boolean
  is_active: boolean
  stock_quantity: number
  rating: number
  reviews_count: number
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string | null
  items: any[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string | null
  customer_name: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  is_read: boolean
  replied_at: string | null
  replied_by: string | null
  reply_message: string | null
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: any
  category: string
  updated_at: string
  updated_by: string | null
}
