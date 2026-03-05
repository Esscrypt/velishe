import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Models",
  description:
    "Meet the models represented by Velishe Model Management. Browse portfolios of our fashion and commercial talent in Sofia, Bulgaria.",
  alternates: {
    canonical: "https://www.velishemodelmanagement.com/models/",
  },
  openGraph: {
    title: "Models | Velishe Model Management",
    description: "Browse our roster of fashion and commercial models.",
  },
};

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
