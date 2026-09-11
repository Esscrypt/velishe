import { JOURNAL_ABOUT } from "@/lib/blog-journal";
import { buildBgHomeCopy } from "@/lib/bg-content";
import { buildEnVisibleHomeCopy } from "@/lib/en-content";
import { ORGANIZATION_EMAIL } from "@/lib/metadata";

export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
};

type Locale = "en" | "bg";

type LegacyLocaleFields = {
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

function trimOrEmpty(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function stableId(locale: Locale, slot: string): string {
  return `default-${locale}-${slot}`;
}

/**
 * Brand-default FAQ items for EN (stable ids for SSR/hydration).
 * Vision is its own item when present.
 */
export function buildDefaultEnFaqItems(modelCount: number): HomeFaqItem[] {
  const visible = buildEnVisibleHomeCopy({ modelCount });
  const items: HomeFaqItem[] = [
    {
      id: stableId("en", "about"),
      question: visible.questions.about,
      answer: visible.intro,
    },
    {
      id: stableId("en", "what-we-do"),
      question: visible.questions.whatWeDo,
      answer: visible.whatWeDo,
    },
  ];
  if (visible.vision.trim()) {
    items.push({
      id: stableId("en", "vision"),
      question: "Our Vision",
      answer: visible.vision,
    });
  }
  items.push(
    {
      id: stableId("en", "requirements"),
      question: visible.questions.requirements,
      answer: visible.requirementsLead,
    },
    {
      id: stableId("en", "academy"),
      question: visible.questions.academy,
      answer: visible.academy,
    },
    {
      id: stableId("en", "booking"),
      question: visible.questions.booking,
      answer: visible.booking,
    },
  );
  return items;
}

/** Brand-default FAQ items for BG (stable ids). */
export function buildDefaultBgFaqItems(modelCount: number): HomeFaqItem[] {
  const copy = buildBgHomeCopy({ modelCount, locationPhrase: "" });
  return [
    {
      id: stableId("bg", "about"),
      question: copy.questions.about,
      answer: copy.intro,
    },
    {
      id: stableId("bg", "what-we-do"),
      question: copy.questions.whatWeDo,
      answer: copy.whatWeDo,
    },
    {
      id: stableId("bg", "requirements"),
      question: copy.questions.requirements,
      answer: copy.requirements,
    },
    {
      id: stableId("bg", "academy"),
      question: copy.questions.academy,
      answer: copy.academy,
    },
    {
      id: stableId("bg", "journal"),
      question: copy.questions.journal,
      answer: copy.journal,
    },
    {
      id: stableId("bg", "booking"),
      question: copy.questions.booking,
      answer: copy.booking,
    },
  ];
}

/**
 * Map a legacy home_faq_content locale slice into ordered items.
 * Vision becomes its own Q when non-empty; journal only when answer non-empty.
 */
export function legacyLocaleToFaqItems(
  locale: Locale,
  fields: LegacyLocaleFields | null | undefined,
  defaults: HomeFaqItem[],
): HomeFaqItem[] {
  if (!fields) return defaults;

  const aboutQ = trimOrEmpty(fields.questionAbout);
  const aboutA = trimOrEmpty(fields.intro);
  const whatQ = trimOrEmpty(fields.questionWhatWeDo);
  const whatA = trimOrEmpty(fields.whatWeDo);
  const visionA = trimOrEmpty(fields.vision);
  const reqQ = trimOrEmpty(fields.questionRequirements);
  const reqA = trimOrEmpty(fields.requirements);
  const academyQ = trimOrEmpty(fields.questionAcademy);
  const academyA = trimOrEmpty(fields.academy);
  const journalQ = trimOrEmpty(fields.questionJournal);
  const journalA = trimOrEmpty(fields.journal);
  const bookingQ = trimOrEmpty(fields.questionBooking);
  const bookingA = trimOrEmpty(fields.booking);

  const hasAnyAnswer = [aboutA, whatA, visionA, reqA, academyA, journalA, bookingA].some(
    Boolean,
  );
  if (!hasAnyAnswer) {
    // Titles-only overrides: start from defaults, overlay question titles.
    return defaults.map((item) => {
      if (item.id.endsWith("-about") && aboutQ) return { ...item, question: aboutQ };
      if (item.id.endsWith("-what-we-do") && whatQ) return { ...item, question: whatQ };
      if (item.id.endsWith("-requirements") && reqQ) return { ...item, question: reqQ };
      if (item.id.endsWith("-academy") && academyQ) return { ...item, question: academyQ };
      if (item.id.endsWith("-journal") && journalQ) return { ...item, question: journalQ };
      if (item.id.endsWith("-booking") && bookingQ) return { ...item, question: bookingQ };
      return item;
    });
  }

  const defaultBySlot = (slot: string) =>
    defaults.find((item) => item.id.endsWith(`-${slot}`));

  const items: HomeFaqItem[] = [];
  const push = (
    slot: string,
    question: string,
    answer: string,
    fallbackQuestion: string,
    fallbackAnswer: string,
  ) => {
    const q = question || fallbackQuestion;
    const a = answer || fallbackAnswer;
    if (!q && !a) return;
    items.push({
      id: stableId(locale, slot),
      question: q || fallbackQuestion,
      answer: a || fallbackAnswer,
    });
  };

  const aboutDef = defaultBySlot("about");
  push(
    "about",
    aboutQ,
    aboutA,
    aboutDef?.question ?? "About",
    aboutDef?.answer ?? "",
  );
  const whatDef = defaultBySlot("what-we-do");
  push(
    "what-we-do",
    whatQ,
    whatA,
    whatDef?.question ?? "What we do",
    whatDef?.answer ?? "",
  );

  if (visionA) {
    push(
      "vision",
      locale === "bg" ? "Нашата визия" : "Our Vision",
      visionA,
      locale === "bg" ? "Нашата визия" : "Our Vision",
      visionA,
    );
  }

  const reqDef = defaultBySlot("requirements");
  push(
    "requirements",
    reqQ,
    reqA,
    reqDef?.question ?? "Requirements",
    reqDef?.answer ?? "",
  );
  const academyDef = defaultBySlot("academy");
  push(
    "academy",
    academyQ,
    academyA,
    academyDef?.question ?? "Academy",
    academyDef?.answer ?? "",
  );

  if (journalA || (locale === "bg" && journalQ)) {
    const journalDef = defaultBySlot("journal");
    push(
      "journal",
      journalQ,
      journalA,
      journalDef?.question ?? (locale === "bg" ? "Какво е Velishe Journal?" : "Journal"),
      journalDef?.answer ?? (locale === "en" ? JOURNAL_ABOUT : journalA),
    );
  }

  const bookingDef = defaultBySlot("booking");
  push(
    "booking",
    bookingQ,
    bookingA,
    bookingDef?.question ?? "Booking",
    bookingDef?.answer ?? `Contact ${ORGANIZATION_EMAIL}.`,
  );

  return items.length > 0 ? items : defaults;
}
