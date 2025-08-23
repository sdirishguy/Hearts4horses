import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to validate JWT token server-side
async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log('Token validation failed:', response.status, response.statusText);
    }
    
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

// Helper function to get token from cookies
function getTokenFromCookies(request: NextRequest): string | null {
  const token = request.cookies.get('h4h_session')?.value;
  return token || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/', '/about', '/services', '/contact'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/portal');
  
  // If it's a public route, allow access without any checks
  // (Let the frontend handle logged-in user navigation)
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // If it's not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, check authentication
  const token = getTokenFromCookies(request);
  
  if (!token) {
    // No token found, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Validate token server-side
  const isValidToken = await validateToken(token);
  
  if (!isValidToken) {
    // Invalid token, redirect to login with clear error message
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'session_expired');
    loginUrl.searchParams.set('message', 'Your session has expired. Please log in again.');
    return NextResponse.redirect(loginUrl);
  }
  
  // Token is valid, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
