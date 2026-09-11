import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import {
  SITE_CONTENT_SINGLETON_ID,
  type ContactPageContentRow,
  type HomeFaqItemRow,
} from "@/lib/db/schema";
import { getDb, schema } from "@/lib/db/index";
import type { HomeFaqItem } from "@/lib/home-faq-defaults";

export const CACHE_TAG_SITE_CONTENT = "site-content";

export type ContactLocaleBody = {
  intro1?: string;
  intro2?: string;
  intro3?: string;
  intro4?: string;
  companyHeading?: string;
  officeAddress?: string;
};

export type ContactPageStored = {
  en?: ContactLocaleBody;
  bg?: ContactLocaleBody;
};

export type HomeFaqItemsByLocale = {
  en: HomeFaqItem[];
  bg: HomeFaqItem[];
};

function textOrEmpty(value: string | null | undefined): string {
  return typeof value === "string" ? value : "";
}

export function contactRowToStored(
  row: ContactPageContentRow | null | undefined,
): ContactPageStored {
  if (!row) {
    return {
      en: {
        intro1: "",
        intro2: "",
        intro3: "",
        intro4: "",
        companyHeading: "",
        officeAddress: "",
      },
      bg: {
        intro1: "",
        intro2: "",
        intro3: "",
        intro4: "",
        companyHeading: "",
        officeAddress: "",
      },
    };
  }
  return {
    en: {
      intro1: textOrEmpty(row.intro1En),
      intro2: textOrEmpty(row.intro2En),
      intro3: textOrEmpty(row.intro3En),
      intro4: textOrEmpty(row.intro4En),
      companyHeading: textOrEmpty(row.companyHeadingEn),
      officeAddress: textOrEmpty(row.officeAddressEn),
    },
    bg: {
      intro1: textOrEmpty(row.intro1Bg),
      intro2: textOrEmpty(row.intro2Bg),
      intro3: textOrEmpty(row.intro3Bg),
      intro4: textOrEmpty(row.intro4Bg),
      companyHeading: textOrEmpty(row.companyHeadingBg),
      officeAddress: textOrEmpty(row.officeAddressBg),
    },
  };
}

export function pickFilled(override: string | null | undefined, fallback: string): string {
  const trimmed = override?.trim();
  return trimmed ? trimmed : fallback;
}

export function rowsToHomeFaqItems(rows: HomeFaqItemRow[]): HomeFaqItem[] {
  return rows.map((row) => ({
    id: row.id,
    question: textOrEmpty(row.question),
    answer: textOrEmpty(row.answer),
  }));
}

export function hasUsableFaqAnswers(items: HomeFaqItem[]): boolean {
  return items.some((item) => item.answer.trim().length > 0);
}

async function fetchContactRow(): Promise<ContactPageContentRow | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(schema.contactPageContent)
      .where(eq(schema.contactPageContent.id, SITE_CONTENT_SINGLETON_ID))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[fetchContactRow]", error);
    return null;
  }
}

async function fetchHomeFaqItemRows(): Promise<HomeFaqItemRow[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.homeFaqItems)
      .orderBy(asc(schema.homeFaqItems.locale), asc(schema.homeFaqItems.sortOrder));
  } catch (error) {
    console.error("[fetchHomeFaqItemRows]", error);
    return [];
  }
}

function groupHomeFaqItems(rows: HomeFaqItemRow[]): HomeFaqItemsByLocale {
  const en: HomeFaqItem[] = [];
  const bg: HomeFaqItem[] = [];
  for (const row of rows) {
    const item = { id: row.id, question: row.question, answer: row.answer };
    if (row.locale === "bg") bg.push(item);
    else if (row.locale === "en") en.push(item);
  }
  return { en, bg };
}

export function getContactPageStored(): Promise<ContactPageStored> {
  return unstable_cache(
    async () => contactRowToStored(await fetchContactRow()),
    ["site-content-contact"],
    { tags: [CACHE_TAG_SITE_CONTENT, "site-content-contact"], revalidate: 3600 },
  )();
}

/** All FAQ items grouped by locale, ordered by sort_order. */
export function getHomeFaqItemsByLocale(): Promise<HomeFaqItemsByLocale> {
  return unstable_cache(
    async () => groupHomeFaqItems(await fetchHomeFaqItemRows()),
    ["site-content-home-faq"],
    { tags: [CACHE_TAG_SITE_CONTENT, "site-content-home-faq"], revalidate: 3600 },
  )();
}

/** FAQ items for one locale (raw DB rows; caller applies EN fallback). */
export async function getHomeFaqItems(
  locale: "en" | "bg",
): Promise<HomeFaqItem[]> {
  const byLocale = await getHomeFaqItemsByLocale();
  return byLocale[locale];
}
