"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SECTION_SUBTEXT_CLASS } from "@/lib/ui-tokens";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";
import { CAPTION_ANNOTATION_TEXT_CLASS } from "@/lib/ui-tokens";
import { BeyondDeskMediaImage } from "../beyond-desk-media-image";
import {
  BEYOND_DESK_BRANDS_DIR,
  slugifyBeyondDeskName,
} from "@/lib/beyond-desk-media";
import {
  BRAND_SUBSECTIONS,
  resolveBrandSubsection,
  type BrandSubsectionId,
} from "@/lib/beyond-desk-brands";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  url: string | null;
  category: string | null;
  subsection: string | null;
}

interface BrandsViewProps {
  artists: unknown[];
  isMobileView: boolean;
}

const GRID_CLASS = "grid gap-4 grid-cols-4 sm:grid-cols-5 lg:grid-cols-7";
const MOBILE_GRID_CLASS = "grid gap-4 grid-cols-4";

const BRAND_SUBSECTION_HEADING_CLASS =
  "shrink-0 text-base font-semibold text-zinc-600 dark:text-zinc-300";

const BRAND_SUBSECTION_LINE_CLASS =
  "min-w-0 flex-1 border-0 border-t-[1.5px] border-zinc-200/60 dark:border-zinc-700/40";

function BrandSubsectionHeading({
  title,
  isFirst,
}: {
  title: string;
  isFirst: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-1 mb-5",
        isFirst ? "mt-1" : "mt-5"
      )}
    >
      <h3 className={BRAND_SUBSECTION_HEADING_CLASS}>{title}</h3>
      <div className={BRAND_SUBSECTION_LINE_CLASS} aria-hidden />
    </div>
  );
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function useBrandGridColumns(isMobileView: boolean) {
  const [columns, setColumns] = useState(isMobileView ? 4 : 7);

  useEffect(() => {
    if (isMobileView) {
      setColumns(4);
      return;
    }

    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (mqLg.matches) setColumns(7);
      else if (mqSm.matches) setColumns(5);
      else setColumns(4);
    };

    update();
    mqSm.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, [isMobileView]);

  return columns;
}

function BrandThumbnail({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const localId = slugifyBeyondDeskName(brand.name);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground">
        {brand.name.charAt(0)}
      </div>
    );
  }

  return (
    <BeyondDeskMediaImage
      basePath={BEYOND_DESK_BRANDS_DIR}
      localId={localId}
      remoteUrl={brand.image_url}
      alt={brand.name}
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onFailed={() => setFailed(true)}
    />
  );
}

export function ArtistsView({ isMobileView }: BrandsViewProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openBrandId, setOpenBrandId] = useState<string | null>(null);
  const gridColumns = useBrandGridColumns(isMobileView);
  const gridClass = isMobileView ? MOBILE_GRID_CLASS : GRID_CLASS;

  useEffect(() => {
    async function fetchBrands() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("brands")
          .select(
            "id, name, description, image_url, url, category, subsection, created_at"
          )
          .order("created_at", { ascending: true });
        if (error) throw error;
        setBrands(data || []);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setFetchError("Couldn't load brands. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const brandsBySubsection = useMemo(() => {
    const grouped: Record<BrandSubsectionId, Brand[]> = {
      d2c: [],
      b2b: [],
      b2b2c: [],
      b2c: [],
    };

    for (const brand of brands) {
      const subsection = resolveBrandSubsection(brand.subsection, brand.category);
      grouped[subsection].push(brand);
    }

    return grouped;
  }, [brands]);

  return (
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        <p className={SECTION_SUBTEXT_CLASS}>
          branding done right. click to know more
        </p>
        {fetchError && <ContentFetchError message={fetchError} />}
        {loading ? (
          <div>
            {BRAND_SUBSECTIONS.map((subsection, index) => (
              <div key={subsection} className={index === BRAND_SUBSECTIONS.length - 1 ? "pb-10" : undefined}>
                <BrandSubsectionHeading title={subsection} isFirst={index === 0} />
                <div className={cn(gridClass)}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 min-w-0">
                        <div className="aspect-square w-full rounded-xl bg-muted animate-pulse" />
                        <div className="h-3 w-3/4 max-w-[100px] rounded bg-muted animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        ) : (
          <div>
            {BRAND_SUBSECTIONS.map((subsection, index) => {
              const subsectionBrands = brandsBySubsection[subsection];
              const brandRows = chunk(subsectionBrands, gridColumns);
              const isLastSection = index === BRAND_SUBSECTIONS.length - 1;

              return (
                <section key={subsection} className={isLastSection ? "pb-10" : undefined}>
                  <BrandSubsectionHeading title={subsection} isFirst={index === 0} />
                    {subsectionBrands.length === 0 ? (
                      <p className="text-xs text-muted-foreground px-1 mb-2">
                        No brands in this bucket yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {brandRows.map((rowBrands, rowIndex) => {
                          const openBrand = rowBrands.find((brand) => brand.id === openBrandId);
                          const isLastRow = rowIndex === brandRows.length - 1;

                          return (
                            <Fragment key={`${subsection}-${rowIndex}`}>
                              <div className={gridClass}>
                                {rowBrands.map((brand) => {
                                  const isOpen = openBrandId === brand.id;
                                  return (
                                    <button
                                      key={brand.id}
                                      type="button"
                                      onClick={() => setOpenBrandId(isOpen ? null : brand.id)}
                                      className="group flex flex-col items-center min-w-0 w-full"
                                    >
                                      <div
                                        className={cn(
                                          "relative aspect-square w-full rounded-xl overflow-hidden mb-2 transition-all",
                                          isOpen
                                            ? "ring-1 ring-accent-blue ring-offset-2 ring-offset-background"
                                            : "bg-muted"
                                        )}
                                      >
                                        <BrandThumbnail brand={brand} />
                                      </div>
                                      <p
                                        className="text-xs font-medium text-center px-0.5 leading-snug line-clamp-2 break-words"
                                        title={brand.name}
                                      >
                                        {brand.name}
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>

                              {openBrand && (
                                <p
                                  className={cn(
                                    CAPTION_ANNOTATION_TEXT_CLASS,
                                    isLastRow ? "mt-16 mb-2" : "mt-12"
                                  )}
                                >
                                  {openBrand.description?.trim()
                                    ? openBrand.description
                                    : "more on this one soon."}
                                </p>
                              )}
                            </Fragment>
                          );
                        })}
                      </div>
                    )}
                  </section>
              );
            })}
          </div>
        )}
      </div>
  );
}
