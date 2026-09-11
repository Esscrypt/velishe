import { JOURNAL_ABOUT } from "@/lib/blog-journal";
import {
  FOUNDER,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  ORGANIZATION_EMAIL,
  ORGANIZATION_PHONE_DISPLAY,
  ORGANIZATION_UIC,
  SITE_NAME,
} from "@/lib/metadata";

export const EN_WORK_CATEGORIES = [
  "fashion editorial",
  "commercial advertising",
  "catalogue",
  "runway",
  "beauty",
  "lifestyle",
  "digital content",
] as const;

type EnHomeCopyArgs = {
  modelCount: number;
  locationPhrase: string;
};

/**
 * Visible homepage About copy (brand / UX). Densified entity facts live in
 * buildEnHomeCopy and are rendered sr-only + JSON-LD for SEO.
 */
export function buildEnVisibleHomeCopy({ modelCount }: Pick<EnHomeCopyArgs, "modelCount">) {
  return {
    intro: `VÈLISHE Model Management is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. We represent and develop ${modelCount} professional fashion and commercial models — women and men with a distinct presence, individual attitude, and authentic character that translates across editorial, campaign, and digital work. We are a new-generation agency built on the belief that great representation shapes careers. We work with a selective, carefully curated roster and invest in each model's long-term development — from first casting to international placement.`,
    whatWeDo:
      "Our talent works across 7 categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. We connect models with leading Bulgarian and international brands, creative directors, and photographers — placing talent in campaigns that make an impact. Beyond bookings, we guide models through the industry — helping them build a professional portfolio, understand their market positioning, and navigate the demands of a modeling career with confidence and clarity.",
    requirementsLead:
      "We represent both women and men. Female models typically begin at a minimum height of 173 cm; male models at 183 cm. We prioritise natural, unedited portfolios and look for real character above all else. Applicants submit natural photos with no filters, editing, or makeup and are reviewed on a rolling basis.",
    academy:
      "The VÈLISHE Academy is our structured training programme for aspiring and signed talents who want to understand how the modeling industry truly works. The Academy covers composites and casting preparation, professional conduct on set, industry etiquette, and building a sustainable career. Enrolment is by intake — join the waitlist to be notified when the next programme opens.",
    booking: `We welcome enquiries from clients looking to book talent for campaigns, editorials, and commercial productions. For casting requests, production briefs, or general booking enquiries, reach out directly to our team at ${ORGANIZATION_EMAIL}.`,
    vision:
      "Our vision goes beyond trends. We focus on timeless presence, individuality, and a sense of narrative within every model we work with. VÈLISHE is a statement — selective, bold, and quietly assured. We exist to shape faces, stories, and moments that leave an imprint.",
    questions: {
      about: "VÈLISHE Model Management — Sofia, Bulgaria",
      whatWeDo: "What Does Velishe Model Management Do?",
      requirements: "What Are the Requirements to Become a Velishe Model?",
      academy: "What Is the VÈLISHE Model Academy?",
      booking: "How Do You Book a Model or Apply to Velishe?",
    },
  };
}

/** Densified homepage copy for crawlers (FAQ schema + sr-only). */
export function buildEnHomeCopy({ modelCount, locationPhrase }: EnHomeCopyArgs) {
  const bookingsClause = locationPhrase
    ? ` Current bookings include ${locationPhrase}.`
    : "";

  const intro = `${SITE_NAME} (VÈLISHE) is a boutique modeling agency founded in 2025 and based in Sofia, Bulgaria. The legal entity is ${LEGAL_NAME} (${LEGAL_NAME_BG}), UIC ${ORGANIZATION_UIC}. The agency represents ${modelCount} professional women and men across fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. Founder and CEO: ${FOUNDER.name}. Velishe places talent with Bulgarian and international clients and develops careers from first casting to international bookings.${bookingsClause} The signed roster is split into Mainboard for established names and Development for new faces; each model page includes measurements and a short bio. Casting, campaign, and editorial enquiries go to ${ORGANIZATION_EMAIL}; briefs are handled in English and Bulgarian from Sofia. Aspiring models apply on Become a Model — typical minimum heights are 173 cm for women and 183 cm for men, with natural unedited photos. VÈLISHE Academy is a separate training programme and is not the same as being signed.`;

  const whatWeDo = `${SITE_NAME} books and develops fashion and commercial models from Sofia, Bulgaria, for Bulgarian and international productions. Talent works in seven categories: fashion editorial, commercial advertising, catalogue, runway, beauty, lifestyle, and digital content. The agency connects models with brands, creative directors, and photographers, and stays involved after the booking — portfolio building, market positioning, and career guidance. Clients request castings or book a specific model through ${ORGANIZATION_EMAIL}, with briefs handled in English or Bulgarian from the Sofia office. The signed roster is split in two: Mainboard for established names and Development for new faces. Browse those boards on this website; each model page includes measurements and a short bio. The VÈLISHE Academy is a training programme and is not the same as being signed. Velishe represents both women and men and places talent locally and abroad.`;

  const requirementsLead = `Female models at Velishe typically begin at a minimum height of 173 cm; male models at 183 cm. Applicants submit natural photos with no filters, editing, makeup, or hair extensions — headshot, full profile, half profile, and full-length. Women usually wear a black tank or swimwear with heels; men wear fitted jeans or swimwear. Submissions are reviewed on a rolling basis through the Become a Model page; the agency only contacts successful applicants and cannot reply to every file. You must be at least 16. Include an Instagram handle and measurements in centimetres. Individual images must stay under 1 MB and the set under 4 MB. Velishe represents both women and men for editorial and commercial work in Sofia and abroad, on either the Mainboard or the Development board depending on experience.`;

  const academy = `The VÈLISHE Academy is a structured training programme in Sofia for aspiring and signed models who want to understand how the industry works. It covers five areas: composites and casting preparation, professional conduct on set, industry etiquette, portfolio building, and how to sustain a modeling career. Enrolment is by intake; join the waitlist on the Academy page to be notified when the next programme opens. Classes are offered in English and Bulgarian. The Academy is run by ${SITE_NAME}, a boutique agency founded in 2025, and it is separate from the signed Mainboard and Development rosters — completing the programme does not by itself mean you are signed. Details of each module are on the Academy page next to the waitlist form. A certificate image on that page shows the format of completion.`;

  const booking = `Clients book Velishe models for campaigns, editorials, and commercial productions by emailing ${ORGANIZATION_EMAIL} with a casting request or production brief. Include dates, usage, location, and whether you need Mainboard, Development, or a named model. The team replies from Sofia and works in English and Bulgarian. For a faster first contact you can also use WhatsApp at ${ORGANIZATION_PHONE_DISPLAY} or Instagram @velishe.mgmt. Company details, UIC, and the founder contact are on the Contact page. The legal entity is ${LEGAL_NAME}, registered in Bulgaria. Aspiring models apply on the Become a Model page; we respond only to applicants who fit current development needs and who meet the height and natural-photo requirements. Privacy terms are on the Privacy Policy page. Do not send applications to the booking inbox.`;

  const journal = JOURNAL_ABOUT;

  const vision =
    "Our vision goes beyond trends. We focus on timeless presence, individuality, and a sense of narrative within every model we work with. VÈLISHE is a statement — selective, bold, and quietly assured. We exist to shape faces, stories, and moments that leave an imprint.";

  return {
    intro,
    whatWeDo,
    requirementsLead,
    academy,
    booking,
    journal,
    vision,
    questions: {
      about: "About VÈLISHE",
      whatWeDo: "What Does Velishe Model Management Do?",
      requirements: "What Are the Requirements to Become a Velishe Model?",
      academy: "What Is the VÈLISHE Model Academy?",
      booking: "How Do You Book a Model or Apply to Velishe?",
    },
  };
}
