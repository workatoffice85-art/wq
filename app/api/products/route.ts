import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    // Map category from Arabic to English
    const categoryMap: Record<string, string> = {
      'مطابخ': 'kitchens',
      'أبواب': 'doors',
      'نوافذ': 'windows',
      'شبابيك': 'windows',
      'واجهات': 'kitchens'
    }

    const productData = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      category: categoryMap[body.category] || body.category,
      price: body.price,
      discount_price: body.discount_price,
      images: body.images,
      features: body.features,
      specifications: body.specifications,
      is_featured: body.is_featured,
      is_active: body.is_active,
      stock_quantity: body.stock_quantity,
      created_by: user.id,
      updated_at: new Date().toISOString()
    }

    // Insert product
    const { data: product, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'فشل في إنشاء المنتج', details: error.message },
        { status: 500 }
      )
    }

    console.log('Product created successfully:', product)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المنتج' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'فشل في جلب المنتجات' },
        { status: 500 }
      )
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المنتجات' },
      { status: 500 }
    )
  }
}
