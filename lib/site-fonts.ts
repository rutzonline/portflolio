import { Caveat, Playfair_Display } from "next/font/google";

/** Matches former Google Fonts link: Caveat 500, 600, 700 */
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-caveat",
});

/** Matches former Google Fonts link: Playfair Display 400, 500 + italic 400 */
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair-display",
});

export const siteFontVariables = `${caveat.variable} ${playfairDisplay.variable}`;
