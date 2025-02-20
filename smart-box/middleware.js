import { NextResponse } from 'next/server';

export async function middleware(request) {
  const sessionCookie = request.cookies.get('session')?.value;

  const protectedRoutes = ['/dashboard', '/profile', '/onboard'];
  const authRoutes = ['/auth'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  // If not authenticated, redirect from protected routes to /auth
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (sessionCookie) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `session=${sessionCookie}`,
        },
      });

      if (!response.ok) throw new Error('Invalid session cookie');

      const { decodedSession } = await response.json();
      const { uid, onBoard =false } = decodedSession;

      console.log(decodedSession)
      console.log('User authenticated:', uid, 'onBoard:', onBoard);

      // Authenticated users trying to access /auth -> redirect to dashboard/onboard
      if (isAuthRoute) {
        return NextResponse.redirect(
          new URL(onBoard ? '/dashboard' : '/onboard', request.url)
        );
      }

      const isOnboardRoute = request.nextUrl.pathname.startsWith('/onboard');
      const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

      // If onboard is false -> kick user to /onboard from /dashboard
      if (onBoard === false && isDashboardRoute) {
        return NextResponse.redirect(new URL('/onboard', request.url));
      }

      // If onboard is true -> kick user to /dashboard from /onboard
      if (onBoard === true && isOnboardRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Otherwise, let them continue
      return NextResponse.next();
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Default allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboard/:path*', '/auth/:path*'],
};
