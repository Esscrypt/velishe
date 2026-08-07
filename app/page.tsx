import Link from "next/link";
import HomeSpotlight from "@/components/HomeSpotlight";
import WebSiteSchema from "@/components/WebSiteSchema";
import { getAllModels } from "@/lib/models";

export default async function Home() {
  const modelCount = (await getAllModels()).length;

  return (
    <>
      <WebSiteSchema />
      <HomeSpotlight />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          VÈLISHE Model Management — Sofia, Bulgaria
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            VÈLISHE Model Management is a boutique modeling agency founded in
            2025 and based in Sofia, Bulgaria. We represent and develop{" "}
            {modelCount} professional fashion and commercial models — women and
            men with a distinct presence, individual attitude, and authentic
            character that translates across editorial, campaign, and digital
            work. We are a new-generation agency built on the belief that great
            representation shapes careers. We work with a selective, carefully
            curated roster and invest in each model&apos;s long-term
            development — from first casting to international placement.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            What Does Velishe Model Management Do?
          </h2>
          <p>
            Our talent works across 7 categories: fashion editorial, commercial
            advertising, catalogue, runway, beauty, lifestyle, and digital
            content. We connect models with leading Bulgarian and international
            brands, creative directors, and photographers — placing talent in
            campaigns that make an impact. Beyond bookings, we guide models
            through the industry — helping them build a professional portfolio,
            understand their market positioning, and navigate the demands of a
            modeling career with confidence and clarity.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            What Are the Requirements to Become a Velishe Model?
          </h2>
          <p>
            Our vision goes beyond trends. We focus on timeless presence,
            individuality, and a sense of narrative within every model we work
            with. VÈLISHE is a statement — selective, bold, and quietly assured.
            We exist to shape faces, stories, and moments that leave an imprint.
          </p>
          <p>
            We represent both women and men. Female models typically begin at a
            minimum height of 173 cm; male models at 183 cm. We prioritise
            natural, unedited portfolios and look for real character above all
            else. Applicants submit natural photos with no filters, editing, or
            makeup and are reviewed on a rolling basis.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            What Is the VÈLISHE Model Academy?
          </h2>
          <p>
            The VÈLISHE Academy is our structured training programme for
            aspiring and signed talents who want to understand how the modeling
            industry truly works. The Academy covers composites and casting
            preparation, professional conduct on set, industry etiquette, and
            building a sustainable career. Enrolment is by intake — join the
            waitlist to be notified when the next programme opens.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            How Do You Book a Model or Apply to Velishe?
          </h2>
          <p>
            We welcome enquiries from clients looking to book talent for
            campaigns, editorials, and commercial productions. For casting
            requests, production briefs, or general booking enquiries, reach out
            directly to our team at models@velishemodelmanagement.com.
          </p>
          <p>
            Aspiring models can apply through our{" "}
            <Link
              href="/become-a-model/"
              className="text-gray-900 underline hover:text-gray-600 transition-colors"
            >
              Become a Model
            </Link>{" "}
            page. We review all applications and respond to those that fit our
            current development needs.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/models/"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              View Our Models
            </Link>
            <Link
              href="/contact/"
              className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
