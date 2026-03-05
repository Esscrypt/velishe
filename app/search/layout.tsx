import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Models",
  description:
    "Search Velishe Model Management roster. Find models by name and view portfolios.",
  robots: { index: false, follow: false },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
