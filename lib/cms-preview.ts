export const CMS_PREVIEW_QUERY = "cmsPreview";

export const CMS_PREVIEW_READY = "velishe-cms-preview-ready";
export const CMS_PREVIEW_PUSH = "velishe-cms-preview-push";
export const CMS_PREVIEW_PATCH = "velishe-cms-preview-patch";
export const CMS_PREVIEW_FLUSH = "velishe-cms-preview-flush";
export const CMS_PREVIEW_SNAPSHOT = "velishe-cms-preview-snapshot";

export type CmsPreviewPage = "home_faq" | "contact";
export type CmsPreviewLocale = "en" | "bg";

export type HomeFaqItemDraft = {
  id: string;
  question: string;
  answer: string;
};

export type HomeFaqPreviewDraft = {
  items: HomeFaqItemDraft[];
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
  patch?: Record<string, string>;
  items?: HomeFaqItemDraft[];
};

export type CmsPreviewReadyMessage = {
  type: typeof CMS_PREVIEW_READY;
  page: CmsPreviewPage;
};

export type CmsPreviewFlushMessage = {
  type: typeof CMS_PREVIEW_FLUSH;
  page: CmsPreviewPage;
  locale: CmsPreviewLocale;
};

export type CmsPreviewSnapshotMessage = {
  type: typeof CMS_PREVIEW_SNAPSHOT;
  page: CmsPreviewPage;
  locale: CmsPreviewLocale;
  draft: HomeFaqPreviewDraft | ContactPreviewDraft;
};

export const TRUSTED_CMS_PREVIEW_HOSTS = [
  "www.velishemodelmanagement.com",
  "velishemodelmanagement.com",
];

const ADMIN_VERCEL_HOST = "velishe-admin.vercel.app";

/**
 * Vercel branch deploys of the admin app use
 * `<project>-git-<branch>-<team>.vercel.app`, so matching the bare hostname
 * alone would break preview on every branch. Anchoring on the project name
 * keeps the admin's own deployments working without trusting all of
 * *.vercel.app, where any attacker can deploy.
 */
function isTrustedAdminVercelHost(hostname: string): boolean {
  return (
    hostname === ADMIN_VERCEL_HOST ||
    /^velishe-admin-git-[a-z0-9-]+\.vercel\.app$/.test(hostname)
  );
}

/** Origins allowed to frame preview pages, for the CSP frame-ancestors list. */
export const TRUSTED_CMS_PREVIEW_FRAME_ORIGINS = [
  "http://localhost:3001",
  `https://${ADMIN_VERCEL_HOST}`,
  ...TRUSTED_CMS_PREVIEW_HOSTS.map((host) => `https://${host}`),
];

export function isTrustedCmsPreviewOrigin(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== "http:" && protocol !== "https:") return false;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (isTrustedAdminVercelHost(hostname)) return true;
    return TRUSTED_CMS_PREVIEW_HOSTS.includes(hostname);
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
    (!!message.patch || Array.isArray(message.items))
  );
}

export function isCmsPreviewFlush(data: unknown): data is CmsPreviewFlushMessage {
  if (!data || typeof data !== "object") return false;
  const message = data as Partial<CmsPreviewFlushMessage>;
  return (
    message.type === CMS_PREVIEW_FLUSH &&
    (message.page === "home_faq" || message.page === "contact") &&
    (message.locale === "en" || message.locale === "bg")
  );
}

export function isCmsPreviewSnapshot(
  data: unknown,
): data is CmsPreviewSnapshotMessage {
  if (!data || typeof data !== "object") return false;
  const message = data as Partial<CmsPreviewSnapshotMessage>;
  return (
    message.type === CMS_PREVIEW_SNAPSHOT &&
    (message.page === "home_faq" || message.page === "contact") &&
    (message.locale === "en" || message.locale === "bg") &&
    !!message.draft &&
    typeof message.draft === "object"
  );
}
