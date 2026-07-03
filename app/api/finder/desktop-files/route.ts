import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DESKTOP_FINDER_PATH, getDesktopPdfSlugForFilename } from "@/lib/desktop-folder";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "desktop");

    if (!fs.existsSync(dir)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs
      .readdirSync(dir)
      .filter((name) => name.toLowerCase().endsWith(".pdf") && !name.startsWith("."))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        slug: getDesktopPdfSlugForFilename(name),
        type: "file" as const,
        path: `${DESKTOP_FINDER_PATH}/${name}`,
      }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Failed to read desktop files:", error);
    return NextResponse.json(
      { error: "Failed to read desktop files", files: [] },
      { status: 500 }
    );
  }
}
