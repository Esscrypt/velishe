import Link from "next/link";

interface HomeIntroStripProps {
  readonly title: string;
  readonly subtitle: string;
  readonly viewModelsHref: string;
  readonly becomeHref: string;
  readonly viewModelsLabel: string;
  readonly becomeLabel: string;
}

export default function HomeIntroStrip({
  title,
  subtitle,
  viewModelsHref,
  becomeHref,
  viewModelsLabel,
  becomeLabel,
}: HomeIntroStripProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 border-t border-gray-100">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={viewModelsHref}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          {viewModelsLabel}
        </Link>
        <Link
          href={becomeHref}
          className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          {becomeLabel}
        </Link>
      </div>
    </section>
  );
}
