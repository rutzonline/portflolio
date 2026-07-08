import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const SITE_PASSWORD = process.env.SITE_PASSWORD;

  if (!SITE_PASSWORD) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  if (password === SITE_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("site_access", "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60, // 60 days
    });
    return res;
  }

  return NextResponse.json({ error: "Invalid" }, { status: 401 });
}