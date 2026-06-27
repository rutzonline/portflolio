"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SECTION_SUBTEXT_CLASS, DESK_MEDIA_CARD_CLASS } from "@/lib/ui-tokens";
import { ContentFetchError } from "@/components/shared/content-fetch-error";
import { createClient } from "@/utils/supabase/client";
import { ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  image_url: string;
  url: string;
}

interface ProductsViewProps {
  songs: unknown[];
  isMobileView: boolean;
  isWindowExpanded?: boolean;
}

export function SongsView({ isMobileView, isWindowExpanded = false }: ProductsViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        setProducts(data || []);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setFetchError("Couldn't load products. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const gridClass = cn(
    "grid gap-4",
    isMobileView
      ? "grid-cols-1"
      : isWindowExpanded
        ? "grid-cols-4 max-w-6xl"
        : "grid-cols-2 lg:grid-cols-3 max-w-5xl"
  );

  return (
    <div className={cn("p-6", isMobileView && "p-4 pb-20", isWindowExpanded && "p-8")}>
        <p className={SECTION_SUBTEXT_CLASS}>
          welp! the ads got me
        </p>
        {fetchError && <ContentFetchError message={fetchError} />}
        {loading ? (
          <div className={gridClass}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border/40">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="h-16 bg-muted/60 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className={gridClass}>
            {products.map((product) => (
              <a
                key={product.id}
                href={product.url || undefined}
                target={product.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={cn(DESK_MEDIA_CARD_CLASS, "min-w-0 can-hover:hover:bg-muted/70")}
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  {product.url && (
                    <ExternalLink
                      className="absolute top-2 right-2 w-3.5 h-3.5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                    />
                  )}
                </div>
                <div className="p-3 min-w-0">
                  <p className="text-sm font-medium leading-snug line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {product.brand}
                  </p>
                  {!isMobileView && product.description ? (
                    <p className="text-[11px] text-muted-foreground/70 mt-1 line-clamp-2 leading-snug">
                      {product.description}
                    </p>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        )}
    </div>
  );
}
