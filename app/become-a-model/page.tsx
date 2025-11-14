"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  trackFormSubmission,
  trackFormStart,
  trackPrivacyPolicyClick,
} from "@/lib/gtm";

interface FormErrors {
  gender?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoeSize?: string;
  hairColor?: string;
  eyeColor?: string;
  instagram?: string;
  message?: string;
  headshot?: string;
  fullProfile?: string;
  halfProfile?: string;
  fullLengthProfile?: string;
  agreeToTerms?: string;
  [key: string]: string | undefined;
}

export default function BecomeAModelPage() {
  const [formData, setFormData] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: "",
    height: "",
    bust: "",
    waist: "",
    hips: "",
    shoeSize: "",
    hairColor: "",
    eyeColor: "",
    instagram: "",
    message: "",
    headshot: null as File | null,
    fullProfile: null as File | null,
    halfProfile: null as File | null,
    fullLengthProfile: null as File | null,
    headshotBase64: "",
    fullProfileBase64: "",
    halfProfileBase64: "",
    fullLengthProfileBase64: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Track form start when user begins filling out the form
  useEffect(() => {
    if (
      !hasStartedForm &&
      (formData.firstName ||
        formData.lastName ||
        formData.email ||
        formData.contactNumber)
    ) {
      setHasStartedForm(true);
      trackFormStart("become_a_model");
    }
  }, [formData.firstName, formData.lastName, formData.email, formData.contactNumber, hasStartedForm]);

  // API route endpoint for form submission
  const API_ENDPOINT = "/api/contact"

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateHeight = (height: string): boolean => {
    if (!height.trim()) return false;
    
    // Accept formats like: 5'8", 5'8, 5ft 8in, 5 feet 8 inches, 173cm, 173
    const heightRegex = /^(\d+['"]?\s*\d*[""]?|\d+\s*(ft|feet|')\s*\d+\s*(in|inches|")|\d+\s*cm|\d+)$/i;
    
    if (!heightRegex.test(height.trim())) {
      return false;
    }
    
    // Extract all numeric parts and check each is max 3 digits
    const numericParts = height.match(/\d+/g);
    if (numericParts) {
      for (const part of numericParts) {
        if (part.length > 3) {
          return false;
        }
      }
    }
    
    return true;
  };

  const validateNumeric = (value: string, allowDecimal: boolean = true, maxDigits: number = 3): boolean => {
    if (!value.trim()) return false;
    // Allow positive numbers, optionally with one decimal point
    const regex = allowDecimal ? /^\d+(\.\d+)?$/ : /^\d+$/;
    if (!regex.test(value.trim())) {
      return false;
    }
    
    const num = parseFloat(value);
    if (num <= 0 || num >= 1000) {
      return false;
    }
    
    // Check max digits before decimal point
    const parts = value.trim().split(".");
    const integerPart = parts[0];
    if (integerPart.length > maxDigits) {
      return false;
    }
    
    return true;
  };

  const validateSocialHandle = (handle: string): boolean => {
    if (!handle.trim()) return false;
    // Remove @ if present, then validate
    const cleanHandle = handle.replace(/^@/, "").trim();
    // Instagram handles: 1-30 chars, alphanumeric, underscores, periods
    const handleRegex = /^[a-zA-Z0-9._]{1,30}$/;
    return handleRegex.test(cleanHandle);
  };

  const validateDateOfBirth = (dob: string): boolean => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;
    
    // Must be at least 16 years old and not more than 100
    return actualAge >= 16 && actualAge <= 100;
  };

  const validateFile = (file: File | null, fieldName: string): string | undefined => {
    if (!file) return undefined;
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    if (!allowedTypes.includes(file.type)) {
      return `${fieldName} must be a JPEG, PNG, or WebP image`;
    }
    
    if (file.size > maxSize) {
      return `${fieldName} must be less than 10MB`;
    }
    
    return undefined;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Restrict numeric fields to numbers and decimal point only, with max 3 digits
    if (name === "bust" || name === "waist" || name === "hips" || name === "shoeSize") {
      // Only allow numbers and one decimal point
      const numericValue = value.replace(/[^\d.]/g, "");
      // Ensure only one decimal point
      const parts = numericValue.split(".");
      let finalValue = parts.length > 2 
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;
      
      // Limit to max 3 digits before decimal point
      const integerPart = finalValue.split(".")[0];
      if (integerPart.length > 3) {
        finalValue = integerPart.slice(0, 3) + (finalValue.includes(".") ? "." + finalValue.split(".")[1] : "");
      }
      
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    } else if (name === "height") {
      // For height, allow various formats but limit numeric parts to 3 digits
      let finalValue = value;
      
      // Extract all numeric parts
      const numericParts = value.match(/\d+/g);
      if (numericParts) {
        for (const part of numericParts) {
          if (part.length > 3) {
            // Replace with truncated version
            const truncated = part.slice(0, 3);
            finalValue = finalValue.replace(part, truncated);
          }
        }
      }
      
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file
      const fieldName = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1");
      const fileError = validateFile(file, fieldName);
      if (fileError) {
        setErrors((prev) => ({ ...prev, [name]: fileError }));
        return;
      }
      
      // Convert to base64
      try {
        const base64 = await convertFileToBase64(file);
        const base64FieldName = `${name}Base64` as keyof typeof formData;
        setFormData((prev) => ({ 
          ...prev, 
          [name]: file,
          [base64FieldName]: base64,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      } catch (error) {
        setErrors((prev) => ({ 
          ...prev, 
          [name]: "Failed to process image. Please try again." 
        }));
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: e.target.checked }));
    if (errors.agreeToTerms) {
      setErrors((prev) => ({ ...prev, agreeToTerms: undefined }));
    }
  };

  const validateForm = (): { isValid: boolean; errors: FormErrors; errorSummary: string[] } => {
    const newErrors: FormErrors = {};
    const errorSummary: string[] = [];

    // Required fields
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      errorSummary.push("Gender");
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      errorSummary.push("First name");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      errorSummary.push("Last name");
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      errorSummary.push("Email");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      errorSummary.push("Valid email address");
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
      errorSummary.push("Contact number");
    } else if (!validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid phone number";
      errorSummary.push("Valid phone number");
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      errorSummary.push("Address");
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      errorSummary.push("City");
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
      errorSummary.push("State");
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
      errorSummary.push("Zip code");
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
      errorSummary.push("Country");
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
      errorSummary.push("Date of birth");
    } else if (!validateDateOfBirth(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "You must be at least 16 years old";
      errorSummary.push("Valid date of birth (must be at least 16 years old)");
    }

    if (!formData.height.trim()) {
      newErrors.height = "Height is required";
      errorSummary.push("Height");
    } else if (!validateHeight(formData.height)) {
      newErrors.height = "Please enter height in cm, e.g. 173cm (max 3 digits per number)";
      errorSummary.push("Valid height format");
    }

    if (!formData.bust.trim()) {
      newErrors.bust = "Bust measurement is required";
      errorSummary.push("Bust");
    } else if (!validateNumeric(formData.bust, true, 3)) {
      newErrors.bust = "Bust must be a valid number with max 3 digits (e.g., 80-90 cm)";
      errorSummary.push("Valid bust measurement");
    }

    if (!formData.waist.trim()) {
      newErrors.waist = "Waist measurement is required";
      errorSummary.push("Waist");
    } else if (!validateNumeric(formData.waist, true, 3)) {
      newErrors.waist = "Waist must be a valid number with max 3 digits (e.g., 60-70 cm)";
      errorSummary.push("Valid waist measurement");
    }

    if (!formData.hips.trim()) {
      newErrors.hips = "Hips measurement is required";
      errorSummary.push("Hips");
    } else if (!validateNumeric(formData.hips, true, 3)) {
      newErrors.hips = "Hips must be a valid number with max 3 digits (e.g., 90-100 cm)";
      errorSummary.push("Valid hips measurement");
    }

    if (!formData.shoeSize.trim()) {
      newErrors.shoeSize = "Shoe size is required";
      errorSummary.push("Shoe size");
    } else if (!validateNumeric(formData.shoeSize, true, 2)) {
      newErrors.shoeSize = "Shoe size must be a valid number with max 2 digits (e.g., 40)";
      errorSummary.push("Valid shoe size");
    }

    if (!formData.hairColor.trim()) {
      newErrors.hairColor = "Hair color is required";
      errorSummary.push("Hair color");
    }

    if (!formData.eyeColor.trim()) {
      newErrors.eyeColor = "Eye color is required";
      errorSummary.push("Eye color");
    }

    if (!formData.instagram.trim()) {
      newErrors.instagram = "Instagram handle is required";
      errorSummary.push("Instagram");
    } else if (!validateSocialHandle(formData.instagram)) {
      newErrors.instagram = "Please enter a valid Instagram handle (e.g., username or @username)";
      errorSummary.push("Valid Instagram handle");
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      errorSummary.push("Message");
    }

    // Check for missing images
    const missingImages: string[] = [];
    if (!formData.headshot) {
      missingImages.push("Headshot");
    }
    if (!formData.fullProfile) {
      missingImages.push("Full Profile");
    }
    if (!formData.halfProfile) {
      missingImages.push("Half Profile");
    }
    if (!formData.fullLengthProfile) {
      missingImages.push("Full Length Profile");
    }

    // Validate files (if provided must be valid)
    const headshotError = validateFile(formData.headshot, "Headshot");
    if (headshotError) {
      newErrors.headshot = headshotError;
      if (!errorSummary.includes("Valid headshot image")) {
        errorSummary.push("Valid headshot image");
      }
    }

    const fullProfileError = validateFile(formData.fullProfile, "Full profile");
    if (fullProfileError) {
      newErrors.fullProfile = fullProfileError;
      if (!errorSummary.includes("Valid full profile image")) {
        errorSummary.push("Valid full profile image");
      }
    }

    const halfProfileError = validateFile(formData.halfProfile, "Half profile");
    if (halfProfileError) {
      newErrors.halfProfile = halfProfileError;
      if (!errorSummary.includes("Valid half profile image")) {
        errorSummary.push("Valid half profile image");
      }
    }

    const fullLengthProfileError = validateFile(formData.fullLengthProfile, "Full length profile");
    if (fullLengthProfileError) {
      newErrors.fullLengthProfile = fullLengthProfileError;
      if (!errorSummary.includes("Valid full length profile image")) {
        errorSummary.push("Valid full length profile image");
      }
    }

    // Add missing images to summary if any
    if (missingImages.length > 0) {
      errorSummary.push(`Missing images: ${missingImages.join(", ")}`);
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the privacy policy";
      errorSummary.push("Privacy policy acceptance");
    }

    setErrors(newErrors);
    return { 
      isValid: Object.keys(newErrors).length === 0, 
      errors: newErrors,
      errorSummary 
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      // Show error summary with formatted message
      const errorMessage = validation.errorSummary.length > 0
        ? validation.errorSummary
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n")
        : "Please fill in all required fields and accept the privacy policy.";
      
      // Set error status immediately
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
      
      // Scroll to first error field after status message renders
      setTimeout(() => {
        const firstErrorField = Object.keys(validation.errors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
          if (element) {
            // Scroll to the element with some offset from top
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - 100; // 100px offset from top
            
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
            
            // Focus the element to highlight it
            setTimeout(() => {
              element.focus();
            }, 300);
          }
        }
      }, 150);
      
      return;
    }

    setIsSubmitting(true);

    try {
      // Create JSON payload
      // Clean social handle (remove @ if present)
      const cleanInstagram = formData.instagram.replace(/^@/, "").trim();
      
      const payload: Record<string, string> = {
        gender: formData.gender,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        dateOfBirth: formData.dateOfBirth,
        height: formData.height,
        bust: formData.bust,
        waist: formData.waist,
        hips: formData.hips,
        shoeSize: formData.shoeSize,
        hairColor: formData.hairColor,
        eyeColor: formData.eyeColor,
        instagram: cleanInstagram,
        message: formData.message,
        agreeToTerms: formData.agreeToTerms.toString(),
      };

      // Add base64 images if they exist (will be sent as email attachments)
      if (formData.headshotBase64) {
        payload.headshot = formData.headshotBase64;
        payload.headshot_filename = formData.headshot?.name || "headshot.jpg";
      }
      if (formData.fullProfileBase64) {
        payload.fullProfile = formData.fullProfileBase64;
        payload.fullProfile_filename = formData.fullProfile?.name || "fullProfile.jpg";
      }
      if (formData.halfProfileBase64) {
        payload.halfProfile = formData.halfProfileBase64;
        payload.halfProfile_filename = formData.halfProfile?.name || "halfProfile.jpg";
      }
      if (formData.fullLengthProfileBase64) {
        payload.fullLengthProfile = formData.fullLengthProfileBase64;
        payload.fullLengthProfile_filename = formData.fullLengthProfile?.name || "fullLengthProfile.jpg";
      }

      // Submit to our API route
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Track successful form submission
        trackFormSubmission("become_a_model", {
          gender: formData.gender,
          has_images: !!(
            formData.headshotBase64 ||
            formData.fullProfileBase64 ||
            formData.halfProfileBase64 ||
            formData.fullLengthProfileBase64
          ),
        });

        setSubmitStatus({
          type: "success",
          message: "Thank you for your application! We will contact you if you are successful.",
        });
        
        // Reset form
        setFormData({
          gender: "",
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          dateOfBirth: "",
          height: "",
          bust: "",
          waist: "",
          hips: "",
          shoeSize: "",
          hairColor: "",
          eyeColor: "",
          instagram: "",
          message: "",
          headshot: null,
          fullProfile: null,
          halfProfile: null,
          fullLengthProfile: null,
          headshotBase64: "",
          fullProfileBase64: "",
          halfProfileBase64: "",
          fullLengthProfileBase64: "",
          agreeToTerms: false,
        });
        setErrors({});
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(data.error || data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting your application. Please try again later.",
      });
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Become a Model</h1>

        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            We would love to hear from you if you have what it takes and are
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>
              <strong>Female</strong> minimum 5&apos;8&apos;
            </li>
            <li>
              <strong>Male</strong> minimum 6&apos;
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            Pictures must be natural, no filter, no editing, no makeup, no hair extension etc.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">WHAT TO WEAR</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Female</strong> black bumshort, legging or jeans with a tank top and heels or/and swimwear
            </li>
            <li>
              <strong>Male</strong> black fitted jeans, a shirt and sneakers or/and swimwear
            </li>
          </ul>
        </div>

        {/* Status message - outside form so it persists */}
        {submitStatus.type && submitStatus.message ? (
          <div
            id="form-status-message"
            className={`p-4 rounded-lg mb-6 ${
              submitStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
            role="alert"
          >
            {submitStatus.type === "error" && submitStatus.message.includes("\n") ? (
              <div>
                <p className="font-medium mb-2">Please fix the following issues:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {submitStatus.message
                    .split("\n")
                    .filter((line) => line.trim())
                    .map((line, index) => (
                      <li key={index} className="text-sm">
                        {line.replace(/^\d+\.\s*/, "")}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="font-medium">{submitStatus.message}</p>
            )}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="woman"
                    checked={formData.gender === "woman"}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  Woman
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="man"
                    checked={formData.gender === "man"}
                    onChange={handleInputChange}
                    className="mr-2"
                    required
                  />
                  Man
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firstname *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lastname *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.contactNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.city
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.state
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code *
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.zipCode
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.country
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.dateOfBirth
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height *
              </label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g., 5'8&quot;"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.height
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bust (inches) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="bust"
                value={formData.bust}
                onChange={handleInputChange}
                placeholder="e.g., 34 or 34.5"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.bust
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.bust && (
                <p className="mt-1 text-sm text-red-600">{errors.bust}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist (inches) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="waist"
                value={formData.waist}
                onChange={handleInputChange}
                placeholder="e.g., 24 or 24.5"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.waist
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.waist && (
                <p className="mt-1 text-sm text-red-600">{errors.waist}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hips (inches) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="hips"
                value={formData.hips}
                onChange={handleInputChange}
                placeholder="e.g., 36 or 36.5"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.hips
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.hips && (
                <p className="mt-1 text-sm text-red-600">{errors.hips}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shoe Size (US) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="shoeSize"
                value={formData.shoeSize}
                onChange={handleInputChange}
                placeholder="e.g., 8 or 8.5"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.shoeSize
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.shoeSize && (
                <p className="mt-1 text-sm text-red-600">{errors.shoeSize}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hair Color *
              </label>
              <input
                type="text"
                name="hairColor"
                value={formData.hairColor}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.hairColor
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.hairColor && (
                <p className="mt-1 text-sm text-red-600">{errors.hairColor}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eye Color *
              </label>
              <input
                type="text"
                name="eyeColor"
                value={formData.eyeColor}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.eyeColor
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.eyeColor && (
                <p className="mt-1 text-sm text-red-600">{errors.eyeColor}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram *
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="username or @username"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.instagram
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
            />
            {errors.instagram && (
              <p className="mt-1 text-sm text-red-600">{errors.instagram}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.message
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HEADSHOT
              </label>
              <input
                type="file"
                name="headshot"
                onChange={handleFileChange}
                accept="image/*"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.headshot
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.headshot && (
                <p className="mt-1 text-sm text-red-600">{errors.headshot}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FULL PROFILE
              </label>
              <input
                type="file"
                name="fullProfile"
                onChange={handleFileChange}
                accept="image/*"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullProfile
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.fullProfile && (
                <p className="mt-1 text-sm text-red-600">{errors.fullProfile}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HALF PROFILE
              </label>
              <input
                type="file"
                name="halfProfile"
                onChange={handleFileChange}
                accept="image/*"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.halfProfile
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.halfProfile && (
                <p className="mt-1 text-sm text-red-600">{errors.halfProfile}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FULL LENGTH PROFILE
              </label>
              <input
                type="file"
                name="fullLengthProfile"
                onChange={handleFileChange}
                accept="image/*"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullLengthProfile
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
              />
              {errors.fullLengthProfile && (
                <p className="mt-1 text-sm text-red-600">{errors.fullLengthProfile}</p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleCheckboxChange}
              required
              className="mt-1 mr-3"
            />
            <label className="text-sm text-gray-700">
              BY SENDING US YOUR APPLICATION, YOU AGREE WITH OUR{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPrivacyPolicyClick("become_a_model_form")}
                className="text-gray-900 underline hover:text-gray-600 transition-colors"
              >
                PRIVACY POLICY
              </Link>{" "}
              AND THE TREATMENT OF YOUR PERSONAL DATA BY OUR AGENCY
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg transition-colors font-medium ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800"
            }`}
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
          </button>

          <p className="text-sm text-gray-600 italic">
            Please note we can only respond to successful applicants
          </p>
        </form>
    </div>
  );
}

