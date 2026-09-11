"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import {
  EditableText,
  useCmsPreviewMode,
  usePreviewPatchSender,
} from "@/components/CmsPreview";
import {
  CMS_PREVIEW_READY,
  isCmsPreviewPush,
  isTrustedCmsPreviewOrigin,
  type ContactPreviewDraft,
} from "@/lib/cms-preview";
import {
  INSTAGRAM_URL,
  ORGANIZATION_EMAIL,
  WHATSAPP_URL,
} from "@/lib/metadata";

type ContactEditableBodyProps = {
  locale: "en" | "bg";
  heading: string;
  intro1: string;
  intro2: string;
  companyHeading: string;
  officeAddress: string;
  officeAddressLabel: string;
  emailLabel: string;
  socialMediaLabel: string;
  whatsAppLabel: string;
  legalHeading: string;
  termsLink: string;
  privacyLink: string;
  termsHref: string;
  privacyHref: string;
  mailtoHref: string;
  seoFacts: string;
  bookingBlock?: {
    title: string;
    portfolioLabel: string;
    portfolioHref: string;
    hint: string;
  };
};

export default function ContactEditableBody({
  locale,
  heading,
  intro1,
  intro2,
  companyHeading,
  officeAddress,
  officeAddressLabel,
  emailLabel,
  socialMediaLabel,
  whatsAppLabel,
  legalHeading,
  termsLink,
  privacyLink,
  termsHref,
  privacyHref,
  mailtoHref,
  seoFacts,
  bookingBlock,
}: ContactEditableBodyProps) {
  const previewMode = useCmsPreviewMode();
  const sendPatch = usePreviewPatchSender("contact", locale, previewMode);
  const [draft, setDraft] = useState<ContactPreviewDraft>({
    intro1,
    intro2,
    companyHeading,
    officeAddress,
  });

  useEffect(() => {
    setDraft({ intro1, intro2, companyHeading, officeAddress });
  }, [intro1, intro2, companyHeading, officeAddress]);

  useEffect(() => {
    if (!previewMode) return;
    const onMessage = (event: MessageEvent) => {
      if (!isTrustedCmsPreviewOrigin(event.origin)) return;
      if (!isCmsPreviewPush(event.data)) return;
      if (event.data.page !== "contact") return;
      if (event.data.locale !== locale) return;
      setDraft(event.data.draft as ContactPreviewDraft);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: CMS_PREVIEW_READY, page: "contact" },
      "*",
    );
    return () => window.removeEventListener("message", onMessage);
  }, [locale, previewMode]);

  const patch = (partial: Partial<ContactPreviewDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...partial };
      sendPatch(partial as Record<string, string>);
      return next;
    });
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{heading}</h1>
      {previewMode ? (
        <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 not-prose">
          CMS preview — click text to edit in place. Save from admin to persist.
        </p>
      ) : null}
      <div className="prose prose-lg max-w-none mb-12">
        {previewMode ? (
          <>
            <EditableText
              value={draft.intro1}
              onChange={(value) => patch({ intro1: value })}
              className="text-lg text-gray-700 mb-4"
            />
            <EditableText
              value={draft.intro2}
              onChange={(value) => patch({ intro2: value })}
              className="text-lg text-gray-700 mb-8"
            />
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-4">{draft.intro1}</p>
            <p className="text-lg text-gray-700 mb-8">{draft.intro2}</p>
          </>
        )}

        <p className="sr-only">{seoFacts}</p>

        {bookingBlock ? (
          <div className="not-prose mb-8 border border-gray-200 bg-gray-50 p-6">
            <p className="text-base font-medium text-gray-900">
              {bookingBlock.title}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <Link
                href={bookingBlock.portfolioHref}
                className="underline hover:text-gray-900"
              >
                {bookingBlock.portfolioLabel}
              </Link>
              {" · "}
              {bookingBlock.hint}
            </p>
          </div>
        ) : null}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8 not-prose">
          {previewMode ? (
            <EditableText
              as="h2"
              value={draft.companyHeading}
              onChange={(value) => patch({ companyHeading: value })}
              className="text-2xl font-semibold text-gray-900 mb-6"
              multiline={false}
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {draft.companyHeading}
            </h2>
          )}
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-medium mb-1">{officeAddressLabel}</p>
              {previewMode ? (
                <EditableText
                  value={draft.officeAddress}
                  onChange={(value) => patch({ officeAddress: value })}
                  className="text-gray-700"
                  multiline={false}
                />
              ) : (
                <p>{draft.officeAddress}</p>
              )}
            </div>
            <div>
              <p className="font-medium mb-1">{emailLabel}</p>
              <a
                href={mailtoHref}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                {ORGANIZATION_EMAIL}
              </a>
            </div>
            <div>
              <p className="font-medium mb-1">{socialMediaLabel}</p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <Instagram size={20} aria-hidden />
                  @velishe.mgmt
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {whatsAppLabel}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {legalHeading}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <Link href={termsHref} className="hover:text-gray-900 transition-colors">
                {termsLink}
              </Link>
              <span>|</span>
              <Link href={privacyHref} className="hover:text-gray-900 transition-colors">
                {privacyLink}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
