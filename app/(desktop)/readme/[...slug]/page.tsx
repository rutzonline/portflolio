import { getSearchString, type SearchParams } from "@/lib/route-utils";
import { RouteRedirect } from "@/components/route-redirect";

type PageProps = {
  searchParams?: SearchParams;
};

export default function ReadmeCatchAllPage({ searchParams }: PageProps) {
  return <RouteRedirect basePath="/readme" search={getSearchString(searchParams)} />;
}
