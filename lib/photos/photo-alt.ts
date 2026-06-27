export function getPhotoAlt(photo: { filename: string }): string {
  const base = photo.filename.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
  return base || "Photo";
}
