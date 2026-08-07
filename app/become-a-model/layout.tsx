import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Become a Model",
  description:
    "Join Velishe Model Management. Apply to become a model with our boutique agency in Sofia, Bulgaria. Open casting and application form.",
  path: "/become-a-model/",
});

export default function BecomeAModelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
