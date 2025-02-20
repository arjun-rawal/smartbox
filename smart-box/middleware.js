import { NextResponse } from 'next/server';

export async function middleware(request) {
  const sessionCookie = request.cookies.get('session')?.value;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile'];
  const authRoutes = ['/auth', '/auth'];

  // Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if the user is trying to access an auth route
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  // Redirect unauthenticated users from protected routes to the login page
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Verify the session cookie for protected routes
  if (isProtectedRoute && sessionCookie) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `session=${sessionCookie}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid session cookie');
      }

      const { uid } = await response.json();
      console.log('User authenticated:', uid);

      // Allow the request to continue
      return NextResponse.next();
    } catch (error) {
      console.error('Error verifying session cookie:', error);

      // Redirect to login if the session cookie is invalid
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && sessionCookie) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `session=${sessionCookie}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid session cookie');
      }

      const { uid } = await response.json();
      console.log('User authenticated:', uid);

      // Redirect to dashboard if the user is already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('Error verifying session cookie:', error);

      // Allow the request to continue if the session cookie is invalid
      return NextResponse.next();
    }
  }

  // Allow the request to continue for non-protected routes
  return NextResponse.next();
}

// Define which routes the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};