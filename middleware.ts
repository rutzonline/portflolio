import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isUnlocked = req.cookies.get("site_access_v2")?.value === "granted";
  const { pathname } = req.nextUrl;

  const isPublicPath =
    pathname.startsWith("/unlock") ||
    pathname.startsWith("/api/unlock") ||
    pathname.startsWith("/_next") ||
    pathname.includes("favicon");

  // 1. If unlocked and trying to go to /unlock, send them home
  if (isUnlocked && pathname === "/unlock") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. If NOT unlocked and NOT on a public path, send to /unlock
  if (!isUnlocked && !isPublicPath) {
    return NextResponse.redirect(new URL("/unlock", req.url));
  }

  // 3. Apply the SEO protection ONLY to the unlock page
  if (pathname === "/unlock") {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  // 4. Otherwise, proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};