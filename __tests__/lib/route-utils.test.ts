import { describe, it, expect } from "vitest";
import { getSearchString } from "@/lib/route-utils";

describe("getSearchString", () => {
  it("returns empty string for undefined", () => {
    expect(getSearchString(undefined)).toBe("");
  });

  it("returns empty string for empty object", () => {
    expect(getSearchString({})).toBe("");
  });

  it("builds query string from simple params", () => {
    const result = getSearchString({ foo: "bar", baz: "qux" });
    expect(result).toBe("?foo=bar&baz=qux");
  });

  it("handles array values by appending multiple entries", () => {
    const result = getSearchString({ tags: ["a", "b", "c"] });
    expect(result).toBe("?tags=a&tags=b&tags=c");
  });

  it("skips undefined values", () => {
    const result = getSearchString({ keep: "yes", skip: undefined });
    expect(result).toBe("?keep=yes");
  });

  it("handles mixed string and array values", () => {
    const result = getSearchString({ page: "1", ids: ["x", "y"] });
    expect(result).toContain("page=1");
    expect(result).toContain("ids=x");
    expect(result).toContain("ids=y");
    expect(result.startsWith("?")).toBe(true);
  });
});
