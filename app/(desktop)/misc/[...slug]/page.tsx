import { getSearchString, type SearchParams } from "@/lib/route-utils";
import { RouteRedirect } from "@/components/route-redirect";

type PageProps = {
  searchParams?: SearchParams;
};

export default function MiscCatchAllPage({ searchParams }: PageProps) {
  return <RouteRedirect basePath="/misc" search={getSearchString(searchParams)} />;
}
