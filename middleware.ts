import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isUnlocked =
    request.cookies.get('portfolio_unlocked')?.value === 'true';

  const pwQuery = searchParams.get('pw');
  const maxAgeSevenDays = 604800;

  if (pwQuery && pwQuery === process.env.PORTFOLIO_PASSWORD) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('portfolio_unlocked', 'true', {
      maxAge: maxAgeSevenDays,
      httpOnly: true,
      sameSite: 'lax',
    });
    return response;
  }

  if (!isUnlocked) {
    return new NextResponse(
      '<html><head><title>Maintenance</title></head><body style="font-family:sans-serif;background:#0A0A0A;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;"><h2 style="font-weight:600;">portfolio under maintenance</h2><p style="opacity:0.6;font-size:14px;">check back soon</p></body></html>',
      { status: 401, headers: { 'content-type': 'text/html' } }
    );
  }

  return NextResponse.next();
}
