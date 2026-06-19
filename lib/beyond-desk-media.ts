/** Local image folders for beyond the desk (add PNG/JPG/WebP by id). */
export const BEYOND_DESK_BRANDS_DIR = "/beyond-desk/brands";
export const BEYOND_DESK_CAMPAIGNS_DIR = "/beyond-desk/campaigns";
export const BEYOND_DESK_SANE_DIR = "/beyond-desk/sane";

export const BEYOND_DESK_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

export function slugifyBeyondDeskName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getBeyondDeskBrandLocalPath(name: string): string {
  return `${BEYOND_DESK_BRANDS_DIR}/${slugifyBeyondDeskName(name)}.png`;
}

export function getBeyondDeskCampaignImageBase(id: string): string {
  return `${BEYOND_DESK_CAMPAIGNS_DIR}/${id}`;
}

export function getBeyondDeskSaneSlug(label: string): string {
  return slugifyBeyondDeskName(label);
}
