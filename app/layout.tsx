import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
// @ts-ignore
import "./globals.css";
import { SystemSettingsProvider } from "@/lib/system-settings-context";
import { AudioProvider } from "@/lib/music/audio-context";
import { isLowercasePreviewEnabled, LOWERCASE_PREVIEW_CLASS } from "@/lib/lowercase-preview";
import { LowercasePreviewBody } from "@/components/lowercase-preview-body";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: "Personal website of rutuja rochkari",
  icons: {
    icon: "/favicon.png",
  },


  openGraph: {
    title: siteConfig.title,
    siteName: siteConfig.title,
    url: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, interactive-widget=resizes-content"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("h-dvh", isLowercasePreviewEnabled() && LOWERCASE_PREVIEW_CLASS)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SystemSettingsProvider>
            <AudioProvider>
              <LowercasePreviewBody />
              {children}
            </AudioProvider>
          </SystemSettingsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
