import ModelPageContent from "@/components/ModelPageContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export default async function BgModelPage({ params }: Props) {
  const { slug } = await params;
  return <ModelPageContent slug={slug} locale="bg" />;
}
