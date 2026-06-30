import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DesktopLandingFirstPaint } from "@/components/desktop/desktop-landing-first-paint";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: siteConfig.title,
  openGraph: {
    images: [
      `/notes/api/og/?title=${encodeURIComponent("about me")}&emoji=${encodeURIComponent("👋🏼")}`,
    ],
  },
};

/** Explicit static — no cookies/headers/data fetches on this route. */
export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <DesktopLandingFirstPaint />
      <HomeClient />
    </>
  );
}
