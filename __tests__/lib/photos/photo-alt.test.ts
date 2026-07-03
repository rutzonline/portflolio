import { describe, it, expect } from "vitest";
import { getPhotoAlt } from "@/lib/photos/photo-alt";

describe("getPhotoAlt", () => {
  it("strips extension and replaces dashes/underscores with spaces", () => {
    expect(getPhotoAlt({ filename: "sunset-at-beach.jpg" })).toBe("sunset at beach");
  });

  it("handles underscores", () => {
    expect(getPhotoAlt({ filename: "my_photo_2024.png" })).toBe("my photo 2024");
  });

  it("handles mixed separators", () => {
    expect(getPhotoAlt({ filename: "vacation--trip__photo.webp" })).toBe("vacation trip photo");
  });

  it("returns 'Photo' for empty base name", () => {
    expect(getPhotoAlt({ filename: ".jpg" })).toBe("Photo");
  });

  it("handles filenames without extension", () => {
    expect(getPhotoAlt({ filename: "landscape" })).toBe("landscape");
  });

  it("handles complex extensions", () => {
    expect(getPhotoAlt({ filename: "image.backup.png" })).toBe("image.backup");
  });
});
