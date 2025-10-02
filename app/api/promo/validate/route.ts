import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json(
        { message: 'كود البرومو مطلوب' },
        { status: 400 }
      )
    }

    // استخدام client بدلاً من admin client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // البحث عن كود البرومو في قاعدة البيانات
    const { data: promoCode, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !promoCode) {
      console.log('Promo code not found or error:', error)
      return NextResponse.json(
        { message: 'كود البرومو غير صالح أو انتهت صلاحيته' },
        { status: 400 }
      )
    }

    console.log('Found promo code:', promoCode)

    // التحقق من تاريخ الانتهاء
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return NextResponse.json(
        { message: 'انتهت صلاحية كود البرومو' },
        { status: 400 }
      )
    }

    // التحقق من الحد الأدنى للطلب
    if (promoCode.minimum_amount && cartTotal < promoCode.minimum_amount) {
      return NextResponse.json(
        {
          message: `يجب أن يكون إجمالي الطلب ${promoCode.minimum_amount} جنيه على الأقل`
        },
        { status: 400 }
      )
    }

    // حساب قيمة الخصم
    let discountAmount = 0

    if (promoCode.discount_type === 'percentage') {
      discountAmount = (cartTotal * promoCode.discount_value) / 100

      // تطبيق الحد الأقصى للخصم إذا كان موجود
      if (promoCode.max_discount_amount) {
        discountAmount = Math.min(discountAmount, promoCode.max_discount_amount)
      }
    } else if (promoCode.discount_type === 'fixed') {
      discountAmount = promoCode.discount_value
    }

    // التأكد من أن الخصم لا يتجاوز إجمالي الطلب
    discountAmount = Math.min(discountAmount, cartTotal)

    return NextResponse.json({
      discountAmount,
      discountType: promoCode.discount_type,
      discountValue: promoCode.discount_value,
      message: `تم تطبيق خصم ${promoCode.discount_type === 'percentage' ? promoCode.discount_value + '%' : promoCode.discount_value + ' جنيه'}`
    })

  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { message: 'حدث خطأ أثناء التحقق من كود البرومو' },
      { status: 500 }
    )
  }
}
