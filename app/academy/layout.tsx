import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "VÈLISHE Academy is a learning path for aspiring and signed talents who want to understand how the modeling industry really works. Based in Sofia, Bulgaria.",
  alternates: {
    canonical: "https://www.velishemodelmanagement.com/academy/",
  },
  openGraph: {
    title: "Academy | Velishe Model Management",
    description:
      "Immerse yourself in the VÈLISHE world and the modeling industry. Join the waitlist for the next Academy intake.",
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
