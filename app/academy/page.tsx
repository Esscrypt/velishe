"use client";

import { useState, useEffect } from "react";

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

export default function AcademyPage() {
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
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
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
        message: "Please fix the errors in the form and try again.",
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
        message: "Thank you for your interest. We will contact you with more information.",
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
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 items-start">
        {/* 1. Header - first on mobile (centered), top-left on desktop */}
        <div className="order-1 md:col-start-1 md:row-start-1">
          <h1 className="text-6xl font-bold text-gray-900 mb-8 text-center md:text-left">Academy</h1>
        </div>

        {/* 2. First line - mobile only: above image. Desktop: shown inside text block below */}
        <div className="order-2 md:hidden -mb-1">
          <p className="text-2xl text-gray-700 mb-0 text-center">
            Immerse yourself in the VÈLISHE world and the modeling industry.
          </p>
        </div>

        {/* 3. Image - third on mobile (after first line), right column on desktop */}
        <div className="order-3 md:col-start-2 md:row-start-1 md:row-span-2 -my-1 md:my-0">
          <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[28rem] sm:min-h-[32rem]">
            <img
              src="/academy-certificate.png"
              alt="VÉLISHE Model Academy certificate of completion"
              className="w-full h-[28rem] object-contain sm:h-[32rem] md:h-[620px] transition-transform duration-700 ease-out hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </div>

        {/* 4. Rest of text + CTA - fourth on mobile, full text block on desktop (left column) */}
        <div className="order-4 md:col-start-1 md:row-start-2 -mt-1 md:mt-0">
          <div className="mb-10 md:mt-0 pt-0">
            <p className="hidden md:block text-2xl text-gray-700 mb-4">
              Immerse yourself in the VÈLISHE world and the modeling industry.
            </p>
            <p className="text-xl text-gray-700 md:mb-3">
              VÈLISHE Academy is our learning path for aspiring and signed talents who want to understand how the industry really works.
            </p>
            <p className="mt-2 text-base text-gray-500">
              Apply for priority access - Join the Waitlist for the Next Intake.
            </p>
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
            <p className="text-lg font-medium text-gray-700">
              You&apos;re on the waitlist. We&apos;ll be in touch when the next Academy program opens.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setIsFormVisible(true)}
              className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg transition-colors font-medium hover:bg-gray-800"
            >
              JOIN THE WAITLIST
            </button>
          )}
        </div>
      </div>

      <section className="max-w-3xl mt-16 space-y-6 text-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900">
          What is the VÈLISHE Model Academy?
        </h2>
        <p className="text-lg leading-relaxed">
          The VÈLISHE Academy is a structured training programme in Sofia for
          aspiring and signed models who want to understand how the modeling
          industry really works. It is run by Velishe Model Management, a
          boutique agency founded in 2025, and it is separate from the signed
          Mainboard and Development rosters. Enrolment is by intake. Join the
          waitlist to be notified when the next programme opens. The Academy is
          taught in English and Bulgarian and is designed for people who want
          professional composites, casting preparation, and a sustainable
          approach to a modeling career — not a one-off photoshoot.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">
          What the Academy covers
        </h2>
        <p>
          The programme covers five areas that match how bookings actually
          happen in Sofia and on international jobs:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Composites and casting preparation — how to present measurements,
            digitals, and a book that clients can use.
          </li>
          <li>
            Professional conduct on set — timing, direction, and working with
            photographers, stylists, and clients.
          </li>
          <li>
            Industry etiquette — agency communication, usage, and how bookings
            are confirmed.
          </li>
          <li>
            Portfolio building — what to shoot, what to leave out, and how a
            board evolves over a season.
          </li>
          <li>
            Building a sustainable career — markets, travel, and long-term
            representation with Velishe.
          </li>
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
              Close
            </button>

            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Join the Academy waitlist
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Share your contact details and we will notify you when the next Academy intake opens.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                    Phone number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
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
                {isSubmitting ? "SUBMITTING..." : "JOIN WAITLIST"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

