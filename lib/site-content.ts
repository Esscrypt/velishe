import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import {
  SITE_CONTENT_SINGLETON_ID,
  type ContactPageContentRow,
  type HomeFaqContentRow,
} from "@/lib/db/schema";
import { getDb, schema } from "@/lib/db/index";

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

export type HomeFaqLocaleBody = {
  intro?: string;
  whatWeDo?: string;
  requirements?: string;
  academy?: string;
  booking?: string;
  journal?: string;
  vision?: string;
  questionAbout?: string;
  questionWhatWeDo?: string;
  questionRequirements?: string;
  questionAcademy?: string;
  questionBooking?: string;
  questionJournal?: string;
};

export type HomeFaqStored = {
  en?: HomeFaqLocaleBody;
  bg?: HomeFaqLocaleBody;
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

export function homeFaqRowToStored(
  row: HomeFaqContentRow | null | undefined,
): HomeFaqStored {
  if (!row) {
    return {
      en: {
        intro: "",
        whatWeDo: "",
        requirements: "",
        academy: "",
        booking: "",
        journal: "",
        vision: "",
        questionAbout: "",
        questionWhatWeDo: "",
        questionRequirements: "",
        questionAcademy: "",
        questionBooking: "",
        questionJournal: "",
      },
      bg: {
        intro: "",
        whatWeDo: "",
        requirements: "",
        academy: "",
        booking: "",
        journal: "",
        vision: "",
        questionAbout: "",
        questionWhatWeDo: "",
        questionRequirements: "",
        questionAcademy: "",
        questionBooking: "",
        questionJournal: "",
      },
    };
  }
  return {
    en: {
      intro: textOrEmpty(row.introEn),
      whatWeDo: textOrEmpty(row.whatWeDoEn),
      requirements: textOrEmpty(row.requirementsEn),
      academy: textOrEmpty(row.academyEn),
      booking: textOrEmpty(row.bookingEn),
      journal: textOrEmpty(row.journalEn),
      vision: textOrEmpty(row.visionEn),
      questionAbout: textOrEmpty(row.questionAboutEn),
      questionWhatWeDo: textOrEmpty(row.questionWhatWeDoEn),
      questionRequirements: textOrEmpty(row.questionRequirementsEn),
      questionAcademy: textOrEmpty(row.questionAcademyEn),
      questionBooking: textOrEmpty(row.questionBookingEn),
      questionJournal: textOrEmpty(row.questionJournalEn),
    },
    bg: {
      intro: textOrEmpty(row.introBg),
      whatWeDo: textOrEmpty(row.whatWeDoBg),
      requirements: textOrEmpty(row.requirementsBg),
      academy: textOrEmpty(row.academyBg),
      booking: textOrEmpty(row.bookingBg),
      journal: textOrEmpty(row.journalBg),
      vision: textOrEmpty(row.visionBg),
      questionAbout: textOrEmpty(row.questionAboutBg),
      questionWhatWeDo: textOrEmpty(row.questionWhatWeDoBg),
      questionRequirements: textOrEmpty(row.questionRequirementsBg),
      questionAcademy: textOrEmpty(row.questionAcademyBg),
      questionBooking: textOrEmpty(row.questionBookingBg),
      questionJournal: textOrEmpty(row.questionJournalBg),
    },
  };
}

export function pickFilled(override: string | null | undefined, fallback: string): string {
  const trimmed = override?.trim();
  return trimmed ? trimmed : fallback;
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

async function fetchHomeFaqRow(): Promise<HomeFaqContentRow | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(schema.homeFaqContent)
      .where(eq(schema.homeFaqContent.id, SITE_CONTENT_SINGLETON_ID))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[fetchHomeFaqRow]", error);
    return null;
  }
}

export function getContactPageStored(): Promise<ContactPageStored> {
  return unstable_cache(
    async () => contactRowToStored(await fetchContactRow()),
    ["site-content-contact"],
    { tags: [CACHE_TAG_SITE_CONTENT, "site-content-contact"], revalidate: 3600 },
  )();
}

export function getHomeFaqStored(): Promise<HomeFaqStored> {
  return unstable_cache(
    async () => homeFaqRowToStored(await fetchHomeFaqRow()),
    ["site-content-home-faq"],
    { tags: [CACHE_TAG_SITE_CONTENT, "site-content-home-faq"], revalidate: 3600 },
  )();
}
