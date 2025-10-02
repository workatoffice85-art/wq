import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', req.url))
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const adminRoles = ['super_admin', 'admin', 'editor', 'support']
    if (!profile || !adminRoles.includes(profile.role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Protected user routes
  if (req.nextUrl.pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/account', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
