"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
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
  description: string;
  image_url: string | null;
  url: string | null;
  category: string | null;
  subsection: string | null;
}

interface BrandsViewProps {
  artists: unknown[];
  isMobileView: boolean;
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

  useEffect(() => {
    async function fetchBrands() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("brands")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        setBrands(data || []);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
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
    <ScrollArea className="h-full" bottomMargin="0">
      <div className={cn("p-6", isMobileView && "p-4 pb-20")}>
        {!isMobileView && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">brands getting it right</h2>
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            {BRAND_SUBSECTIONS.map((subsection) => (
              <div key={subsection}>
                <div className="h-4 w-16 bg-muted rounded animate-pulse mb-4" />
                <div
                  className={cn(
                    "grid gap-4",
                    isMobileView ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  )}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
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
          <div className="space-y-10">
            {BRAND_SUBSECTIONS.map((subsection) => {
              const subsectionBrands = brandsBySubsection[subsection];

              return (
                <section key={subsection}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 px-1">
                    {subsection}
                  </h3>
                  {subsectionBrands.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-1 mb-2">
                      No brands in this bucket yet.
                    </p>
                  ) : (
                    <div
                      className={cn(
                        "grid gap-4",
                        isMobileView ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                      )}
                    >
                      {subsectionBrands.map((brand) => (
                        <a
                          key={brand.id}
                          href={brand.url || undefined}
                          target={brand.url ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="group flex flex-col items-center min-w-0 w-full"
                        >
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-muted">
                            <BrandThumbnail brand={brand} />
                          </div>
                          <p className="text-sm font-medium truncate w-full text-center px-1">
                            {brand.name}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
