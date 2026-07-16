import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isUnlocked = req.cookies.get("site_access")?.value === "granted";
  const { pathname } = req.nextUrl;

  const isPublicPath =
    pathname.startsWith("/unlock") ||
    pathname.startsWith("/api/unlock") ||
    pathname.startsWith("/_next") ||
    pathname.includes("favicon");

  // Create the response
  let response = NextResponse.next();

  if (!isUnlocked && !isPublicPath) {
    const url = req.nextUrl.clone();
    url.pathname = "/unlock";
    response = NextResponse.redirect(url);
  }

  // If they are on the unlock page, tell search engines not to index it
  if (pathname === "/unlock") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};