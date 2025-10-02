import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    // اختبار اتصال Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // اختبار بسيط للاتصال
    const { data, error } = await supabase
      .from('site_settings')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'مشكلة في اتصال Supabase',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase متصل بشكل صحيح',
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: supabaseUrl ? 'مضبوط' : 'غير مضبوط',
        anonKey: supabaseAnonKey ? 'مضبوط' : 'غير مضبوط',
      }
    })

  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'خطأ في الخادم',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 })
  }
}
