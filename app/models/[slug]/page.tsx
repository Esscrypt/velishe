import ModelPageContent from "@/components/ModelPageContent";

type Props = {
  params: Promise<{ slug: string }>;
};

// Cache model details at the edge. Admin edits purge via /api/revalidate
// (`/models/${slug}/` with trailing slash + layout type); interval is a safety net.
export const revalidate = 3600;

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  return <ModelPageContent slug={slug} locale="en" />;
}
