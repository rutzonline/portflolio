import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DeskCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const suffix = slug?.length ? `/${slug.join("/")}` : "";
  redirect(`/misc${suffix}`);
}
