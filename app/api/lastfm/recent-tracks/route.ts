import { NextResponse } from "next/server";

const LASTFM_USERNAME = "rutzonline";
const LASTFM_TRACK_LIMIT = 20;

interface LastFmImage {
  "#text": string;
  size: string;
}

interface LastFmTrack {
  name: string;
  artist: { "#text": string };
  image: LastFmImage[];
}

export interface ListenToMeTrack {
  src: string;
  song: string;
  artist: string;
}

export async function GET() {
  const apiKey =
    process.env.LASTFM_API_KEY ?? process.env.NEXT_PUBLIC_LASTFM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Last.fm API key is not configured", tracks: [] as ListenToMeTrack[] },
      { status: 503 }
    );
  }

  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.searchParams.set("method", "user.getrecenttracks");
  url.searchParams.set("user", LASTFM_USERNAME);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(LASTFM_TRACK_LIMIT));

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 120 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Last.fm returned ${res.status}`, tracks: [] as ListenToMeTrack[] },
        { status: 502 }
      );
    }

    const data = await res.json();
    const tracks: LastFmTrack[] = data?.recenttracks?.track ?? [];

    const seen = new Set<string>();
    const results: ListenToMeTrack[] = [];

    for (const track of tracks) {
      const art =
        track.image.find((i) => i.size === "extralarge")?.["#text"] ||
        track.image.find((i) => i.size === "large")?.["#text"] ||
        "";

      if (!art || seen.has(art)) continue;
      seen.add(art);

      results.push({
        src: art,
        song: track.name,
        artist: track.artist["#text"],
      });
    }

    return NextResponse.json({ tracks: results });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Last.fm tracks", tracks: [] as ListenToMeTrack[] },
      { status: 502 }
    );
  }
}
