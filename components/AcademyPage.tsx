"use client";

import { useState, useEffect } from "react";
import { academyCopy } from "@/lib/i18n/academy";
import type { SiteLocale } from "@/lib/i18n/locale";

const SESSION_STORAGE_KEY = "academy_waitlist_submitted";

interface WaitlistFormState {
  email: string;
  phoneNumber: string;
}

interface WaitlistFormErrors {
  email?: string;
  phoneNumber?: string;
}

const API_ENDPOINT = "/api/academy-wishlist";

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const numericLength = phoneNumber.replace(/\D/g, "").length;
  return phoneRegex.test(phoneNumber) && numericLength >= 7 && numericLength <= 20;
}

export default function AcademyPage({ locale = "en" }: { locale?: SiteLocale }) {
  const t = academyCopy(locale);
  const [formData, setFormData] = useState<WaitlistFormState>({
    email: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<WaitlistFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [hasSubmittedThisSession, setHasSubmittedThisSession] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_STORAGE_KEY) === "true") {
      setHasSubmittedThisSession(true);
    }
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (errors[name as keyof WaitlistFormErrors]) {
      setErrors((previous) => ({ ...previous, [name]: undefined }));
    }
  };

  const validateForm = (): { isValid: boolean; errors: WaitlistFormErrors } => {
    const newErrors: WaitlistFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = t.emailInvalid;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t.phoneRequired;
    } else if (!validatePhoneNumber(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = t.phoneInvalid;
    }

    setErrors(newErrors);

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { isValid } = validateForm();
    if (!isValid) {
      setSubmitStatus({
        type: "error",
        message: t.fixForm,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          (data && typeof data.error === "string" && data.error) ||
          "An error occurred while submitting the form. Please try again.";

        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
        return;
      }

      setSubmitStatus({
        type: "success",
        message: t.successMessage,
      });

      setFormData({
        email: "",
        phoneNumber: "",
      });
      setErrors({});
      setIsFormVisible(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      }
      setHasSubmittedThisSession(true);
    } catch (error) {
      console.error("[AcademyPage] Failed to submit wishlist form", error);
      setSubmitStatus({
        type: "error",
        message: t.unexpectedError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" lang={locale === "bg" ? "bg" : "en"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 items-start">
        <div className="order-1 md:col-start-1 md:row-start-1">
          <h1 className="text-6xl font-bold text-gray-900 mb-8 text-center md:text-left">{t.heading}</h1>
        </div>
        <div className="order-2 md:hidden -mb-1">
          <p className="text-2xl text-gray-700 mb-0 text-center">{t.tagline}</p>
        </div>

        {/* 3. Image - third on mobile (after first line), right column on desktop */}
        <div className="order-3 md:col-start-2 md:row-start-1 md:row-span-2 -my-1 md:my-0">
          <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[28rem] sm:min-h-[32rem]">
            <img
              src="/academy-certificate.png"
              alt={t.certificateAlt}
              className="w-full h-[28rem] object-contain sm:h-[32rem] md:h-[620px] transition-transform duration-700 ease-out hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </div>

        {/* 4. Rest of text + CTA - fourth on mobile, full text block on desktop (left column) */}
        <div className="order-4 md:col-start-1 md:row-start-2 -mt-1 md:mt-0">
          <div className="mb-10 md:mt-0 pt-0">
            <p className="hidden md:block text-2xl text-gray-700 mb-4">{t.tagline}</p>
            <p className="text-xl text-gray-700 md:mb-3">{t.intro}</p>
            <p className="mt-2 text-base text-gray-500">{t.waitlistCta}</p>
          </div>

          {submitStatus.type && submitStatus.message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                submitStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
              role="alert"
            >
              <p className="font-medium">{submitStatus.message}</p>
            </div>
          )}

          {hasSubmittedThisSession ? (
            <p className="text-lg font-medium text-gray-700">{t.waitlistDone}</p>
          ) : (
            <button
              type="button"
              onClick={() => setIsFormVisible(true)}
              className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg transition-colors font-medium hover:bg-gray-800"
            >
              {t.joinWaitlist}
            </button>
          )}
        </div>
      </div>

      <section className="max-w-3xl mt-16 space-y-6 text-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900">{t.whatIsHeading}</h2>
        <p className="text-lg leading-relaxed">{t.whatIsBody}</p>
        <h2 className="text-2xl font-semibold text-gray-900">{t.coversHeading}</h2>
        <p>{t.coversIntro}</p>
        <ol className="list-decimal list-inside space-y-2">
          {t.modules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 text-sm"
            >
              {t.close}
            </button>

            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{t.modalTitle}</h2>
            <p className="mb-6 text-sm text-gray-600">{t.modalIntro}</p>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
              toolname="joinAcademyWaitlist"
              tooldescription="Join the VÈLISHE Academy waitlist in Sofia to be notified when the next model-training intake opens. Completing the Academy does not mean you are signed."
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    toolparamdescription="Email address for Academy intake notifications"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-black"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    toolparamdescription="Phone number including country code"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-black"
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-3 bg-black text-white rounded-lg transition-colors font-medium ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                {isSubmitting ? t.submitting : t.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

