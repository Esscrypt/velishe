export const CMS_PREVIEW_QUERY = "cmsPreview";

export const CMS_PREVIEW_READY = "velishe-cms-preview-ready";
export const CMS_PREVIEW_PUSH = "velishe-cms-preview-push";
export const CMS_PREVIEW_PATCH = "velishe-cms-preview-patch";

export type CmsPreviewPage = "home_faq" | "contact";
export type CmsPreviewLocale = "en" | "bg";

export type HomeFaqPreviewDraft = {
  intro: string;
  whatWeDo: string;
  requirements: string;
  academy: string;
  booking: string;
  journal: string;
  vision: string;
  questionAbout: string;
  questionWhatWeDo: string;
  questionRequirements: string;
  questionAcademy: string;
  questionBooking: string;
  questionJournal: string;
};

export type ContactPreviewDraft = {
  intro1: string;
  intro2: string;
  companyHeading: string;
  officeAddress: string;
};

export type CmsPreviewPushMessage = {
  type: typeof CMS_PREVIEW_PUSH;
  page: CmsPreviewPage;
  locale: CmsPreviewLocale;
  draft: HomeFaqPreviewDraft | ContactPreviewDraft;
};

export type CmsPreviewPatchMessage = {
  type: typeof CMS_PREVIEW_PATCH;
  page: CmsPreviewPage;
  locale: CmsPreviewLocale;
  patch: Record<string, string>;
};

export type CmsPreviewReadyMessage = {
  type: typeof CMS_PREVIEW_READY;
  page: CmsPreviewPage;
};

export function isTrustedCmsPreviewOrigin(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== "http:" && protocol !== "https:") return false;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (hostname.endsWith(".vercel.app")) return true;
    if (hostname.endsWith("velishemodelmanagement.com")) return true;
    return false;
  } catch {
    return false;
  }
}

export function isCmsPreviewPush(data: unknown): data is CmsPreviewPushMessage {
  if (!data || typeof data !== "object") return false;
  const message = data as Partial<CmsPreviewPushMessage>;
  return (
    message.type === CMS_PREVIEW_PUSH &&
    (message.page === "home_faq" || message.page === "contact") &&
    (message.locale === "en" || message.locale === "bg") &&
    !!message.draft &&
    typeof message.draft === "object"
  );
}

export function isCmsPreviewPatch(data: unknown): data is CmsPreviewPatchMessage {
  if (!data || typeof data !== "object") return false;
  const message = data as Partial<CmsPreviewPatchMessage>;
  return (
    message.type === CMS_PREVIEW_PATCH &&
    (message.page === "home_faq" || message.page === "contact") &&
    (message.locale === "en" || message.locale === "bg") &&
    !!message.patch &&
    typeof message.patch === "object"
  );
}
