import { Playlist } from "./types";

// ─── BRANDS ──────────────────────────────────────────────────────────────────
// Maps to "Artists" view → renamed "Brands" in the UI
// Each entry: a brand I find inspiring
export const BRANDS: { id: string; name: string; image: string; trackCount: number }[] = [
  {
    id: "patagonia",
    name: "Patagonia",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    trackCount: 3,
  },
  {
    id: "huckberry",
    name: "Huckberry",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
    trackCount: 2,
  },
  {
    id: "duolingo",
    name: "Duolingo",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
    trackCount: 2,
  },
  {
    id: "morning-brew",
    name: "Morning Brew",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80",
    trackCount: 3,
  },
  {
    id: "innocent",
    name: "Innocent Drinks",
    image: "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "craighill",
    name: "Craighill",
    image: "https://images.unsplash.com/photo-1615796153287-98eacf0abb13?w=600&q=80",
    trackCount: 2,
  },
  {
    id: "clay",
    name: "Clay",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "ryanair",
    name: "Ryanair",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "the-whole-truth",
    name: "The Whole Truth",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "dollar-shave-club",
    name: "Dollar Shave Club",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "surreal",
    name: "Surreal Cereal",
    image: "https://images.unsplash.com/photo-1517093928436-906522a7d462?w=600&q=80",
    trackCount: 2,
  },
  {
    id: "nyt-cooking",
    name: "NYT Cooking",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80",
    trackCount: 1,
  },
];

// ─── CAMPAIGNS ───────────────────────────────────────────────────────────────
// Maps to "Albums" view → renamed "Campaigns" in the UI
// Cover images: `public/beyond-desk/campaigns/{id}.png` or `{id}.jpg`

export type CampaignIcon =
  | "leaf"
  | "mountain"
  | "languages"
  | "scissors"
  | "plane"
  | "sparkles"
  | "snowflake"
  | "coffee"
  | "youtube"
  | "trophy"
  | "camera"
  | "film"
  | "mail";

export interface CampaignItem {
  id: string;
  name: string;
  artist: string;
  icon: CampaignIcon;
  albumArt: string;
  trackCount: number;
}

export const CAMPAIGNS: CampaignItem[] = [
  {
    id: "dont-buy-jacket",
    name: "Don't Buy This Jacket",
    artist: "Patagonia",
    icon: "leaf",
    albumArt: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "dirt-series",
    name: "DIRT Series",
    artist: "Huckberry",
    icon: "mountain",
    albumArt: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
    trackCount: 4,
  },
  {
    id: "duolingo-ux",
    name: "Onboarding Flow & UX Copy",
    artist: "Duolingo",
    icon: "languages",
    albumArt: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "our-blades",
    name: "Our Blades Are F***ing Great",
    artist: "Dollar Shave Club",
    icon: "scissors",
    albumArt: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "ryanair-twitter",
    name: "Please Don't Lick Our Planes",
    artist: "Ryanair",
    icon: "plane",
    albumArt: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "surreal-linkedin",
    name: "Surreal LinkedIn Persona",
    artist: "Surreal Cereal",
    icon: "sparkles",
    albumArt: "https://images.unsplash.com/photo-1517093928436-906522a7d462?w=600&q=80",
    trackCount: 3,
  },
  {
    id: "innocent-winter",
    name: "Winter Campaign",
    artist: "Innocent Drinks",
    icon: "snowflake",
    albumArt: "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "morning-brew-all",
    name: "All Forms of Media",
    artist: "Morning Brew",
    icon: "coffee",
    albumArt: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80",
    trackCount: 5,
  },
  {
    id: "nyt-cooking-yt",
    name: "YouTube Series",
    artist: "NYT Cooking",
    icon: "youtube",
    albumArt: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80",
    trackCount: 2,
  },
  {
    id: "bridgways-graphics",
    name: "Chelsea FC Fan Graphics",
    artist: "Bridgways",
    icon: "trophy",
    albumArt: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80",
    trackCount: 4,
  },
  {
    id: "craighill-explainers",
    name: "Instagram Explainers",
    artist: "Craighill",
    icon: "camera",
    albumArt: "https://images.unsplash.com/photo-1615796153287-98eacf0abb13?w=600&q=80",
    trackCount: 3,
  },
  {
    id: "life-of-riza",
    name: "Cinematography / You Only Have One Life",
    artist: "Life of Riza",
    icon: "film",
    albumArt: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=600&q=80",
    trackCount: 1,
  },
  {
    id: "really-good-emails",
    name: "Really Good Emails",
    artist: "Really Good Emails",
    icon: "mail",
    albumArt: "https://images.unsplash.com/photo-1596526131083-7188c7cadfda?w=600&q=80",
    trackCount: 1,
  },
];

// ─── PRODUCTS I LOVE ─────────────────────────────────────────────────────────
// Maps to "Songs" view → renamed "Products I Love" in the UI
// Each entry: a product I genuinely like
export const PRODUCTS: {
  id: string;
  name: string;
  artist: string;    // = brand
  album: string;     // = category
  albumArt: string;
  previewUrl: string;
  duration: number;
}[] = [
  {
    id: "p1",
    name: "Kindle Paperwhite",
    artist: "Amazon",
    album: "E-readers",
    albumArt: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p2",
    name: "Notion",
    artist: "Notion Labs",
    album: "Productivity",
    albumArt: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p3",
    name: "Arc Browser",
    artist: "The Browser Company",
    album: "Browsers",
    albumArt: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p4",
    name: "Lamy Safari Pen",
    artist: "Lamy",
    album: "Stationery",
    albumArt: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p5",
    name: "Aesop Resurrection Rinse",
    artist: "Aesop",
    album: "Skincare",
    albumArt: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p6",
    name: "Muji Gel Pen 0.38",
    artist: "Muji",
    album: "Stationery",
    albumArt: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p7",
    name: "Spotify",
    artist: "Spotify",
    album: "Apps",
    albumArt: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p8",
    name: "Field Notes",
    artist: "Field Notes Brand",
    album: "Stationery",
    albumArt: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p9",
    name: "Linear",
    artist: "Linear",
    album: "Productivity",
    albumArt: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
  {
    id: "p10",
    name: "Moleskine Cahier",
    artist: "Moleskine",
    album: "Stationery",
    albumArt: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
    previewUrl: "",
    duration: 0,
  },
];

// ─── COOL WEBSITES ───────────────────────────────────────────────────────────
// Used by browse-view.tsx — not derived from playlists
export const COOL_WEBSITES: {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  image: string;
}[] = [
  {
    id: "w1",
    name: "Stripe",
    description: "Best-in-class landing page copy and design",
    url: "https://stripe.com",
    category: "Design",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  },
  {
    id: "w2",
    name: "Linear",
    description: "Product design that feels like magic",
    url: "https://linear.app",
    category: "Design",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  },
  {
    id: "w3",
    name: "Lenny's Newsletter",
    description: "The go-to resource for product & growth",
    url: "https://www.lennysnewsletter.com",
    category: "Newsletter",
    image: "https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=600&q=80",
  },
  {
    id: "w4",
    name: "Really Good Emails",
    description: "The biggest library of email inspiration",
    url: "https://reallygoodemails.com",
    category: "Email",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&q=80",
  },
  {
    id: "w5",
    name: "Craighill",
    description: "Gorgeous product design + Instagram explainers",
    url: "https://craighill.com",
    category: "Brand",
    image: "https://images.unsplash.com/photo-1615796153287-98eacf0abb13?w=600&q=80",
  },
  {
    id: "w6",
    name: "Notion",
    description: "The tool I use for everything",
    url: "https://notion.so",
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=600&q=80",
  },
  {
    id: "w7",
    name: "Awwwards",
    description: "Best designed websites on the internet",
    url: "https://awwwards.com",
    category: "Design",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    id: "w8",
    name: "Morning Brew",
    description: "Business news that doesn't put you to sleep",
    url: "https://morningbrew.com",
    category: "Newsletter",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80",
  },
  {
    id: "w9",
    name: "Poolside FM",
    description: "A vibe, not just a music site",
    url: "https://poolside.fm",
    category: "Fun",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
  },
  {
    id: "w10",
    name: "Patagonia",
    description: "Environmental storytelling done right",
    url: "https://patagonia.com",
    category: "Brand",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  },
  {
    id: "w11",
    name: "Clay",
    description: "Product explainers and branding that pop",
    url: "https://clay.com",
    category: "Brand",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    id: "w12",
    name: "Minimal Gallery",
    description: "Curated minimal web design",
    url: "https://minimal.gallery",
    category: "Design",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  },
];

// ─── PLAYLISTS (kept for type compatibility — now used as named collections) ──
export const DEFAULT_PLAYLISTS: Playlist[] = [];

// ─── Derived helpers — same signatures as before ──────────────────────────────

export function getAlbumsFromPlaylists() {
  return CAMPAIGNS;
}

export function getArtistsFromPlaylists() {
  return BRANDS;
}

export function getAllSongs() {
  return PRODUCTS;
}

export function getFeaturedPlaylist() {
  return DEFAULT_PLAYLISTS[0] ?? null;
}

// ─── DEFAULT TRACK ────────────────────────────────────────────────────────────
// Shown in the status bar "Now Playing" widget.
// Drop your files at:
//   public/now-playing-media/track.mp3   ← audio file
//   public/now-playing-media/cover.jpg   ← cover image
export const DEFAULT_TRACK = {
  id: "default",
  name: "There She Goes",
  artist: "The La's",
  album: "misc",
  albumArt: "/now-playing-media/cover.jpg",
  previewUrl: "/now-playing-media/track.mp3",
  duration: 0,
};
