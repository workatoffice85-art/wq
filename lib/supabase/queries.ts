import { supabase } from './client'
import type { Product, Order, Review, ContactMessage, FAQ, SiteSetting } from './client'

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(filters?: {
  category?: string
  featured?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.featured) {
    query = query.eq('is_featured', true)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data as Product
}

export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

export async function getRelatedProducts(productId: string, category: string, limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .neq('id', productId)
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

// ============================================
// ORDERS
// ============================================

export async function createOrder(orderData: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error) throw error
  return data as Order
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Order[]
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

// ============================================
// REVIEWS
// ============================================

export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Review[]
}

export async function createReview(reviewData: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single()

  if (error) throw error
  return data as Review
}

// ============================================
// CONTACT MESSAGES
// ============================================

export async function createContactMessage(messageData: Partial<ContactMessage>) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([messageData])
    .select()
    .single()

  if (error) throw error
  return data as ContactMessage
}

export async function getContactMessages(unreadOnly = false) {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query

  if (error) throw error
  return data as ContactMessage[]
}

// ============================================
// FAQ
// ============================================

export async function getFAQ() {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data as FAQ[]
}

// ============================================
// SITE SETTINGS
// ============================================

export async function getSiteSetting(key: string) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('setting_key', key)
    .single()

  if (error) throw error
  return data as SiteSetting
}

export async function getAllSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) throw error
  return data as SiteSetting[]
}

export async function updateSiteSetting(key: string, value: any) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ setting_value: value })
    .eq('setting_key', key)
    .select()
    .single()

  if (error) throw error
  return data as SiteSetting
}
