"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  EditableText,
  HomeFaqItemEditable,
  useCmsPreviewMode,
  useParentOrigin,
} from "@/components/CmsPreview";
import {
  CMS_PREVIEW_PATCH,
  CMS_PREVIEW_READY,
  CMS_PREVIEW_SNAPSHOT,
  isCmsPreviewFlush,
  isCmsPreviewPush,
  isTrustedCmsPreviewOrigin,
  type HomeFaqItemDraft,
  type HomeFaqPreviewDraft,
} from "@/lib/cms-preview";

export type HomeAboutFaqItem = {
  id: string;
  question: string;
  answer: string;
};

type HomeAboutSectionProps = {
  locale: "en" | "bg";
  items: HomeAboutFaqItem[];
  mainboardHref: string;
  contactHref: string;
  usingEnglishLayout?: boolean;
};

function toDraft(items: HomeAboutFaqItem[]): HomeFaqPreviewDraft {
  return {
    items: items.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })),
  };
}

function fromDraft(draft: HomeFaqPreviewDraft): HomeAboutFaqItem[] {
  if (!Array.isArray(draft.items)) return [];
  return draft.items.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));
}

export default function HomeAboutSection({
  locale,
  items: initialItems,
  mainboardHref,
  contactHref,
  usingEnglishLayout = locale === "en",
}: HomeAboutSectionProps) {
  const previewMode = useCmsPreviewMode();
  const parentOrigin = useParentOrigin();
  const [items, setItems] = useState(initialItems);
  const draftRef = useRef(toDraft(initialItems));
  draftRef.current = toDraft(items);

  useEffect(() => {
    setItems(initialItems);
    draftRef.current = toDraft(initialItems);
  }, [initialItems]);

  const sendItemsPatch = (nextItems: HomeFaqItemDraft[]) => {
    if (!previewMode || !window.parent || window.parent === window) return;
    const target = parentOrigin && parentOrigin !== "null" ? parentOrigin : "*";
    window.parent.postMessage(
      {
        type: CMS_PREVIEW_PATCH,
        page: "home_faq",
        locale,
        items: nextItems,
      },
      target,
    );
  };

  useEffect(() => {
    if (!previewMode) return;

    const onMessage = (event: MessageEvent) => {
      if (!isTrustedCmsPreviewOrigin(event.origin)) return;
      if (isCmsPreviewPush(event.data)) {
        if (event.data.page !== "home_faq") return;
        if (event.data.locale !== locale) return;
        const nextDraft = event.data.draft as HomeFaqPreviewDraft;
        draftRef.current = nextDraft;
        setItems(fromDraft(nextDraft));
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

  const updateItem = (
    id: string,
    partial: Partial<Pick<HomeAboutFaqItem, "question" | "answer">>,
  ) => {
    const nextItems = draftRef.current.items.map((item) =>
      item.id === id ? { ...item, ...partial } : item,
    );
    draftRef.current = { items: nextItems };
    setItems(fromDraft(draftRef.current));
    sendItemsPatch(nextItems);
  };

  const deleteItem = (id: string) => {
    const nextItems = draftRef.current.items.filter((item) => item.id !== id);
    draftRef.current = { items: nextItems };
    setItems(fromDraft(draftRef.current));
    sendItemsPatch(nextItems);
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

      {items.map((item, index) => (
        <HomeFaqItemEditable
          key={item.id}
          title={item.question}
          defaultOpen={index === 0}
          editable={editable}
          onTitleChange={(question) => updateItem(item.id, { question })}
          onDelete={editable ? () => deleteItem(item.id) : undefined}
        >
          {editable ? (
            <EditableText
              value={item.answer}
              onChange={(answer) => updateItem(item.id, { answer })}
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            />
          ) : (
            <p className="whitespace-pre-wrap">{item.answer}</p>
          )}
        </HomeFaqItemEditable>
      ))}

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
