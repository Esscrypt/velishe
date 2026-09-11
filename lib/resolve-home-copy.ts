import { buildBgHomeCopy } from "@/lib/bg-content";
import { buildEnHomeCopy, buildEnVisibleHomeCopy } from "@/lib/en-content";
import {
  type HomeFaqLocaleBody,
  type HomeFaqStored,
  pickFilled,
} from "@/lib/site-content";

type HomeCopyArgs = {
  modelCount: number;
  locationPhrase: string;
};

function applyLocaleOverrides<T extends Record<string, unknown>>(
  base: T,
  stored: HomeFaqLocaleBody | undefined,
  map: Partial<Record<keyof HomeFaqLocaleBody, keyof T>>,
): T {
  const next = { ...base };
  for (const [storedKey, baseKey] of Object.entries(map) as Array<
    [keyof HomeFaqLocaleBody, keyof T]
  >) {
    const override = stored?.[storedKey];
    if (typeof next[baseKey] === "string") {
      next[baseKey] = pickFilled(override, next[baseKey] as string) as T[keyof T];
    }
  }
  return next;
}

function hasFilledBgAnswers(stored: HomeFaqStored | null | undefined): boolean {
  const bg = stored?.bg;
  if (!bg) return false;
  const answerKeys = [
    "intro",
    "whatWeDo",
    "requirements",
    "academy",
    "booking",
    "journal",
    "vision",
  ] as const;
  return answerKeys.some((key) => Boolean(bg[key]?.trim()));
}

/**
 * Visible About = brand defaults (or DB overrides).
 * seo = densified entity facts for JSON-LD + sr-only (not admin-editable).
 */
export function resolveEnHomeCopy(
  args: HomeCopyArgs,
  stored: HomeFaqStored | null | undefined,
) {
  const visibleBase = buildEnVisibleHomeCopy(args);
  const seo = buildEnHomeCopy(args);
  const en = stored?.en;
  const withAnswers = applyLocaleOverrides(visibleBase, en, {
    intro: "intro",
    whatWeDo: "whatWeDo",
    requirements: "requirementsLead",
    academy: "academy",
    booking: "booking",
    vision: "vision",
  });
  return {
    ...withAnswers,
    questions: {
      about: pickFilled(en?.questionAbout, visibleBase.questions.about),
      whatWeDo: pickFilled(en?.questionWhatWeDo, visibleBase.questions.whatWeDo),
      requirements: pickFilled(
        en?.questionRequirements,
        visibleBase.questions.requirements,
      ),
      academy: pickFilled(en?.questionAcademy, visibleBase.questions.academy),
      booking: pickFilled(en?.questionBooking, visibleBase.questions.booking),
    },
    seo,
  };
}

/**
 * BG CMS filled → use BG.
 * BG empty → English visible About (EN CMS or brand defaults). No AI BG densified copy in the UI.
 */
export function resolveBgHomeCopy(
  args: HomeCopyArgs,
  stored: HomeFaqStored | null | undefined,
) {
  const bgPopulated = hasFilledBgAnswers(stored);
  const enVisible = resolveEnHomeCopy(args, stored);
  const bgHardcoded = buildBgHomeCopy(args);
  const bg = stored?.bg;

  if (!bgPopulated) {
    return {
      intro: enVisible.intro,
      whatWeDo: enVisible.whatWeDo,
      requirements: enVisible.requirementsLead,
      academy: enVisible.academy,
      booking: enVisible.booking,
      journal: "",
      vision: enVisible.vision,
      questions: {
        about: pickFilled(bg?.questionAbout, enVisible.questions.about),
        whatWeDo: pickFilled(bg?.questionWhatWeDo, enVisible.questions.whatWeDo),
        requirements: pickFilled(
          bg?.questionRequirements,
          enVisible.questions.requirements,
        ),
        academy: pickFilled(bg?.questionAcademy, enVisible.questions.academy),
        journal: pickFilled(bg?.questionJournal, ""),
        booking: pickFilled(bg?.questionBooking, enVisible.questions.booking),
      },
      usingEnglishFallback: true as const,
      seo: enVisible.seo,
    };
  }

  const withAnswers = applyLocaleOverrides(bgHardcoded, bg, {
    intro: "intro",
    whatWeDo: "whatWeDo",
    requirements: "requirements",
    academy: "academy",
    booking: "booking",
    journal: "journal",
  });
  return {
    ...withAnswers,
    vision: pickFilled(bg?.vision, enVisible.vision),
    questions: {
      about: pickFilled(bg?.questionAbout, bgHardcoded.questions.about),
      whatWeDo: pickFilled(bg?.questionWhatWeDo, bgHardcoded.questions.whatWeDo),
      requirements: pickFilled(
        bg?.questionRequirements,
        bgHardcoded.questions.requirements,
      ),
      academy: pickFilled(bg?.questionAcademy, bgHardcoded.questions.academy),
      journal: pickFilled(bg?.questionJournal, bgHardcoded.questions.journal),
      booking: pickFilled(bg?.questionBooking, bgHardcoded.questions.booking),
    },
    usingEnglishFallback: false as const,
    seo: bgHardcoded,
  };
}
