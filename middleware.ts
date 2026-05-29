import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isLoginPage = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')
  
  if (!isAdminRoute) return NextResponse.next()
  if (isLoginPage) return NextResponse.next()

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
