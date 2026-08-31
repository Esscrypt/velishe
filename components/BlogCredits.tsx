import Link from "next/link";
import { hasDisplayableCredits } from "@/lib/blog-credits";
import type { BlogCredits, BlogLinkedModel } from "@/types/blog";

function CreditName({ name, url }: { name: string; url: string | null }) {
  if (!url) return <>{name}</>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-gray-800"
    >
      {name}
    </a>
  );
}

export default function BlogCredits({
  credits,
  model,
}: {
  credits: BlogCredits | null;
  model: BlogLinkedModel | null;
}) {
  if (!hasDisplayableCredits(credits, Boolean(model))) return null;

  return (
    <section
      className="mb-10 border-t border-gray-200 pt-8"
      aria-labelledby="journal-credits-heading"
    >
      <h2
        id="journal-credits-heading"
        className="font-serif text-2xl font-bold text-black mb-4"
      >
        Credits
      </h2>
      <ul className="space-y-2 text-base text-gray-800">
        {model ? (
          <li>
            <span className="text-gray-500">Talent — </span>
            <Link
              href={`/models/${model.slug}/`}
              className="underline hover:text-gray-800"
            >
              {model.name}
            </Link>
          </li>
        ) : null}
        {credits?.brand ? (
          <li>
            <span className="text-gray-500">Brand — </span>
            <CreditName name={credits.brand.name} url={credits.brand.url} />
          </li>
        ) : null}
        {credits?.photographer ? (
          <li>
            <span className="text-gray-500">Photographer — </span>
            <CreditName
              name={credits.photographer.name}
              url={credits.photographer.url}
            />
          </li>
        ) : null}
        {credits?.magazine ? (
          <li>
            <span className="text-gray-500">Magazine — </span>
            <CreditName
              name={credits.magazine.name}
              url={credits.magazine.url}
            />
          </li>
        ) : null}
        {credits?.extras.map((row) => (
          <li key={`${row.role}-${row.name}`}>
            <span className="text-gray-500">{row.role} — </span>
            <CreditName name={row.name} url={row.url} />
          </li>
        ))}
        {credits?.sourceUrl ? (
          <li>
            <span className="text-gray-500">Source — </span>
            <a
              href={credits.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-800"
            >
              View original
            </a>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
