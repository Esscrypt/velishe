import { buildBgHomeCopy } from "@/lib/bg-content";
import { buildEnHomeCopy } from "@/lib/en-content";
import {
  buildDefaultBgFaqItems,
  buildDefaultEnFaqItems,
  type HomeFaqItem,
} from "@/lib/home-faq-defaults";
import {
  hasUsableFaqAnswers,
  type HomeFaqItemsByLocale,
} from "@/lib/site-content";

type HomeCopyArgs = {
  modelCount: number;
  locationPhrase: string;
};

/**
 * Visible About = dynamic FAQ items (DB or brand defaults).
 * seo = densified entity facts for JSON-LD + sr-only (not admin-editable).
 */
export function resolveEnHomeCopy(
  args: HomeCopyArgs,
  stored: HomeFaqItemsByLocale | null | undefined,
) {
  const seo = buildEnHomeCopy(args);
  const defaults = buildDefaultEnFaqItems(args.modelCount);
  const fromDb = stored?.en ?? [];
  const items = hasUsableFaqAnswers(fromDb) ? fromDb : defaults;
  return { items, seo };
}

/**
 * BG items when populated; otherwise English visible items (same product rule).
 */
export function resolveBgHomeCopy(
  args: HomeCopyArgs,
  stored: HomeFaqItemsByLocale | null | undefined,
) {
  const enResolved = resolveEnHomeCopy(args, stored);
  const bgFromDb = stored?.bg ?? [];
  const bgPopulated = hasUsableFaqAnswers(bgFromDb);

  if (!bgPopulated) {
    return {
      items: enResolved.items,
      usingEnglishFallback: true as const,
      seo: enResolved.seo,
    };
  }

  return {
    items: bgFromDb,
    usingEnglishFallback: false as const,
    seo: buildBgHomeCopy(args),
  };
}

export type { HomeFaqItem };
