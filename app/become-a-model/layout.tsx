import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Model",
  description:
    "Join Velishe Model Management. Apply to become a model with our boutique agency in Sofia, Bulgaria. Open casting and application form.",
  openGraph: {
    title: "Become a Model | Velishe Model Management",
    description: "Apply to join our roster. Open casting and model application.",
  },
};

export default function BecomeAModelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
