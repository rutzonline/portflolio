import { getSearchString, type SearchParams } from "@/lib/route-utils";
import { RouteRedirect } from "@/components/route-redirect";

type PageProps = {
  searchParams?: SearchParams;
};

export default function MusicCatchAllPage({ searchParams }: PageProps) {
  return <RouteRedirect basePath="/desk" search={getSearchString(searchParams)} />;
}
