import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isUnlocked = req.cookies.get("site_access_v2")?.value === "granted";
  const { pathname } = req.nextUrl;

  const isPublicPath =
    pathname.startsWith("/unlock") ||
    pathname.startsWith("/api/unlock") ||
    pathname.startsWith("/_next") ||
    pathname.includes("favicon");

  if (!isUnlocked && !isPublicPath) {
    const url = req.nextUrl.clone();
    url.pathname = "/unlock";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};