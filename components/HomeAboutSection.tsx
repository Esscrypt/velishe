"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  EditableText,
  HomeFaqItemEditable,
  useCmsPreviewMode,
  usePreviewPatchSender,
} from "@/components/CmsPreview";
import {
  CMS_PREVIEW_READY,
  CMS_PREVIEW_SNAPSHOT,
  isCmsPreviewFlush,
  isCmsPreviewPush,
  isTrustedCmsPreviewOrigin,
  type HomeFaqPreviewDraft,
} from "@/lib/cms-preview";

export type HomeAboutVisibleCopy = {
  intro: string;
  whatWeDo: string;
  requirements: string;
  academy: string;
  booking: string;
  journal?: string;
  vision: string;
  questions: {
    about: string;
    whatWeDo: string;
    requirements: string;
    academy: string;
    booking: string;
    journal?: string;
  };
};

type HomeAboutSectionProps = {
  locale: "en" | "bg";
  initial: HomeAboutVisibleCopy;
  becomeHref: string;
  mainboardHref: string;
  contactHref: string;
  blogHref?: string;
  showJournal?: boolean;
  usingEnglishLayout?: boolean;
};

function toDraft(copy: HomeAboutVisibleCopy): HomeFaqPreviewDraft {
  return {
    intro: copy.intro,
    whatWeDo: copy.whatWeDo,
    requirements: copy.requirements,
    academy: copy.academy,
    booking: copy.booking,
    journal: copy.journal ?? "",
    vision: copy.vision,
    questionAbout: copy.questions.about,
    questionWhatWeDo: copy.questions.whatWeDo,
    questionRequirements: copy.questions.requirements,
    questionAcademy: copy.questions.academy,
    questionBooking: copy.questions.booking,
    questionJournal: copy.questions.journal ?? "",
  };
}

function fromDraft(draft: HomeFaqPreviewDraft): HomeAboutVisibleCopy {
  return {
    intro: draft.intro,
    whatWeDo: draft.whatWeDo,
    requirements: draft.requirements,
    academy: draft.academy,
    booking: draft.booking,
    journal: draft.journal,
    vision: draft.vision,
    questions: {
      about: draft.questionAbout,
      whatWeDo: draft.questionWhatWeDo,
      requirements: draft.questionRequirements,
      academy: draft.questionAcademy,
      booking: draft.questionBooking,
      journal: draft.questionJournal,
    },
  };
}

export default function HomeAboutSection({
  locale,
  initial,
  becomeHref,
  mainboardHref,
  contactHref,
  blogHref,
  showJournal = false,
  usingEnglishLayout = locale === "en",
}: HomeAboutSectionProps) {
  const previewMode = useCmsPreviewMode();
  const sendPatch = usePreviewPatchSender("home_faq", locale, previewMode);
  const [copy, setCopy] = useState(initial);
  const draftRef = useRef(toDraft(initial));
  draftRef.current = toDraft(copy);

  useEffect(() => {
    setCopy(initial);
    draftRef.current = toDraft(initial);
  }, [initial]);

  useEffect(() => {
    if (!previewMode) return;

    const onMessage = (event: MessageEvent) => {
      if (!isTrustedCmsPreviewOrigin(event.origin)) return;
      if (isCmsPreviewPush(event.data)) {
        if (event.data.page !== "home_faq") return;
        if (event.data.locale !== locale) return;
        const nextDraft = event.data.draft as HomeFaqPreviewDraft;
        draftRef.current = nextDraft;
        setCopy(fromDraft(nextDraft));
        return;
      }
      if (!isCmsPreviewFlush(event.data)) return;
      if (event.data.page !== "home_faq") return;
      if (event.data.locale !== locale) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
      const replyOrigin = event.origin;
      queueMicrotask(() => {
        window.parent.postMessage(
          {
            type: CMS_PREVIEW_SNAPSHOT,
            page: "home_faq",
            locale,
            draft: draftRef.current,
          },
          replyOrigin,
        );
      });
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: CMS_PREVIEW_READY, page: "home_faq" } satisfies {
        type: typeof CMS_PREVIEW_READY;
        page: "home_faq";
      },
      "*",
    );
    return () => window.removeEventListener("message", onMessage);
  }, [locale, previewMode]);

  const patch = (partial: Partial<HomeFaqPreviewDraft>) => {
    const nextDraft = { ...draftRef.current, ...partial };
    draftRef.current = nextDraft;
    setCopy(fromDraft(nextDraft));
    sendPatch(partial as Record<string, string>);
  };

  const editable = previewMode;

  return (
    <div className="text-gray-700">
      {previewMode ? (
        <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          CMS preview — click a question title or paragraph to edit in place.
          Unsaved until you hit Save in admin.
        </p>
      ) : null}

      <HomeFaqItemEditable
        title={copy.questions.about}
        defaultOpen
        editable={editable}
        onTitleChange={(questionAbout) => patch({ questionAbout })}
      >
        {editable ? (
          <EditableText
            value={copy.intro}
            onChange={(intro) => patch({ intro })}
            className="text-gray-700 leading-relaxed"
          />
        ) : (
          <p>{copy.intro}</p>
        )}
      </HomeFaqItemEditable>

      <HomeFaqItemEditable
        title={copy.questions.whatWeDo}
        editable={editable}
        onTitleChange={(questionWhatWeDo) => patch({ questionWhatWeDo })}
      >
        {editable ? (
          <EditableText
            value={copy.whatWeDo}
            onChange={(whatWeDo) => patch({ whatWeDo })}
            className="text-gray-700 leading-relaxed"
          />
        ) : (
          <p>{copy.whatWeDo}</p>
        )}
      </HomeFaqItemEditable>

      <HomeFaqItemEditable
        title={copy.questions.requirements}
        editable={editable}
        onTitleChange={(questionRequirements) =>
          patch({ questionRequirements })
        }
      >
        {usingEnglishLayout ? (
          editable ? (
            <>
              <EditableText
                value={copy.vision}
                onChange={(vision) => patch({ vision })}
                className="text-gray-700 leading-relaxed"
              />
              <EditableText
                value={copy.requirements}
                onChange={(requirements) => patch({ requirements })}
                className="text-gray-700 leading-relaxed"
              />
            </>
          ) : (
            <>
              <p>{copy.vision}</p>
              <p>{copy.requirements}</p>
            </>
          )
        ) : editable ? (
          <EditableText
            value={copy.requirements}
            onChange={(requirements) => patch({ requirements })}
            className="text-gray-700 leading-relaxed"
          />
        ) : (
          <p>{copy.requirements}</p>
        )}
      </HomeFaqItemEditable>

      <HomeFaqItemEditable
        title={copy.questions.academy}
        editable={editable}
        onTitleChange={(questionAcademy) => patch({ questionAcademy })}
      >
        {editable ? (
          <EditableText
            value={copy.academy}
            onChange={(academy) => patch({ academy })}
            className="text-gray-700 leading-relaxed"
          />
        ) : (
          <p>{copy.academy}</p>
        )}
      </HomeFaqItemEditable>

      {showJournal && copy.questions.journal && copy.journal ? (
        <HomeFaqItemEditable
          title={copy.questions.journal}
          editable={editable}
          onTitleChange={(questionJournal) => patch({ questionJournal })}
        >
          {editable ? (
            <EditableText
              value={copy.journal}
              onChange={(journal) => patch({ journal })}
              className="text-gray-700 leading-relaxed"
            />
          ) : (
            <p>{copy.journal}</p>
          )}
          {blogHref ? (
            <p>
              <Link
                href={blogHref}
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                Velishe Journal
              </Link>
            </p>
          ) : null}
        </HomeFaqItemEditable>
      ) : null}

      <HomeFaqItemEditable
        title={copy.questions.booking}
        editable={editable}
        onTitleChange={(questionBooking) => patch({ questionBooking })}
      >
        {editable ? (
          <EditableText
            value={copy.booking}
            onChange={(booking) => patch({ booking })}
            className="text-gray-700 leading-relaxed"
          />
        ) : (
          <p>{copy.booking}</p>
        )}
        {usingEnglishLayout ? (
          <p>
            Aspiring models can apply through our{" "}
            <Link
              href={becomeHref}
              className="text-gray-900 underline hover:text-gray-600 transition-colors"
            >
              Become a Model
            </Link>{" "}
            page. We review all applications and respond to those that fit our
            current development needs.
          </p>
        ) : null}
      </HomeFaqItemEditable>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href={mainboardHref}
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          {locale === "bg" && !usingEnglishLayout
            ? "Виж моделите"
            : "View Our Models"}
        </Link>
        <Link
          href={contactHref}
          className="inline-block px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          {locale === "bg" && !usingEnglishLayout ? "Контакт" : "Get in Touch"}
        </Link>
        {locale === "en" ? (
          <Link
            href="/bg/"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            hrefLang="bg"
          >
            Български
          </Link>
        ) : null}
      </div>
    </div>
  );
}
