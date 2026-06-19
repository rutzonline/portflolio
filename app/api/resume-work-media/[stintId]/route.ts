import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MEDIA_EXT = /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i;

function sortMediaFiles(files: string[]): string[] {
  const rank = (name: string): [number, number, string] => {
    const lower = name.toLowerCase();
    if (lower.startsWith("before.")) return [0, 0, lower];
    if (lower.startsWith("after.")) return [1, 0, lower];
    if (MEDIA_EXT.test(lower) && /\.(mp4|webm|mov)$/i.test(lower)) return [3, 0, lower];
    const num = parseInt(lower.match(/^(\d+)/)?.[1] ?? "9999", 10);
    return [2, num, lower];
  };

  return [...files].sort((a, b) => {
    const [ra, na, sa] = rank(a);
    const [rb, nb, sb] = rank(b);
    if (ra !== rb) return ra - rb;
    if (na !== nb) return na - nb;
    return sa.localeCompare(sb);
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ stintId: string }> }
) {
  const { stintId } = await params;
  const safeId = stintId.replace(/[^a-z0-9-]/gi, "");
  const dir = path.join(process.cwd(), "public", "resume", "work", safeId);

  if (!fs.existsSync(dir)) {
    return NextResponse.json({ media: [] });
  }

  const files = sortMediaFiles(
    fs
      .readdirSync(dir)
      .filter((f) => MEDIA_EXT.test(f) && !f.startsWith("."))
  ).map((f) => ({
    url: `/resume/work/${safeId}/${encodeURIComponent(f)}`,
    type: /\.(mp4|webm|mov)$/i.test(f) ? "video" : "image",
    name: f,
  }));

  return NextResponse.json({ media: files });
}
