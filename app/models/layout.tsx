import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Models",
  description:
    "Meet the models represented by Velishe Model Management. Browse portfolios of our fashion and commercial talent in Sofia, Bulgaria.",
  path: "/models/",
});

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
