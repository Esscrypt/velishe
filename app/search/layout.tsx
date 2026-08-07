import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Search Models",
  description:
    "Search Velishe Model Management roster. Find models by name and view portfolios.",
  path: "/search/",
  index: false,
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
