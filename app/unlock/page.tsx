import { Metadata } from "next";
import { UnlockClient } from "./unlock-client";

export const metadata: Metadata = {
  title: "rutuja rochkari",
  // noindex stops Google indexing this page.
  // nosnippet stops it using any text from this page in descriptions.
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function UnlockPage() {
  return <UnlockClient />;
}