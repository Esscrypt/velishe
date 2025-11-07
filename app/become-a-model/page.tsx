"use client";

import { useState } from "react";

interface FormErrors {
  gender?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  height?: string;
  dateOfBirth?: string;
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
    tiktok: "",
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

  // Formspree endpoint - replace with your Formspree form ID
  // Get your form endpoint from https://formspree.io/
  // Example: https://formspree.io/f/YOUR_FORM_ID
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xovvozyz"

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateHeight = (height: string): boolean => {
    // Accept formats like: 5'8", 5'8, 5ft 8in, 5 feet 8 inches, 173cm, 173
    const heightRegex = /^(\d+['"]?\s*\d*[""]?|\d+\s*(ft|feet|')\s*\d+\s*(in|inches|")|\d+\s*cm|\d+)$/i;
    return heightRegex.test(height.trim());
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    
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

  const validateForm = (): { isValid: boolean; errors: FormErrors } => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid phone number";
    }

    if (formData.height && !validateHeight(formData.height)) {
      newErrors.height = "Please enter height in format like 5'8\" or 173cm";
    }

    if (formData.dateOfBirth && !validateDateOfBirth(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "You must be at least 16 years old";
    }

    // Validate files (optional, but if provided must be valid)
    const headshotError = validateFile(formData.headshot, "Headshot");
    if (headshotError) {
      newErrors.headshot = headshotError;
    }

    const fullProfileError = validateFile(formData.fullProfile, "Full profile");
    if (fullProfileError) {
      newErrors.fullProfile = fullProfileError;
    }

    const halfProfileError = validateFile(formData.halfProfile, "Half profile");
    if (halfProfileError) {
      newErrors.halfProfile = halfProfileError;
    }

    const fullLengthProfileError = validateFile(formData.fullLengthProfile, "Full length profile");
    if (fullLengthProfileError) {
      newErrors.fullLengthProfile = fullLengthProfileError;
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      // Scroll to first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        // Try to find the input element
        const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Focus the element to highlight it
          element.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Create JSON payload for Formspree (works with CORS and static builds)
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
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        message: formData.message,
        agreeToTerms: formData.agreeToTerms.toString(),
      };

      // Add base64 images if they exist
      // Create HTML content with embedded images for email display
      const imageHtmlParts: string[] = [];
      
      if (formData.headshotBase64) {
        payload.headshot = formData.headshotBase64;
        payload.headshot_filename = formData.headshot?.name || "headshot.jpg";
        imageHtmlParts.push(`
          <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Headshot</h3>
            <img src="${formData.headshotBase64}" alt="Headshot" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 4px;" />
            <p style="margin-top: 5px; color: #666; font-size: 12px;">Filename: ${formData.headshot?.name || "headshot.jpg"}</p>
          </div>
        `);
      }
      if (formData.fullProfileBase64) {
        payload.fullProfile = formData.fullProfileBase64;
        payload.fullProfile_filename = formData.fullProfile?.name || "fullProfile.jpg";
        imageHtmlParts.push(`
          <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Full Profile</h3>
            <img src="${formData.fullProfileBase64}" alt="Full Profile" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 4px;" />
            <p style="margin-top: 5px; color: #666; font-size: 12px;">Filename: ${formData.fullProfile?.name || "fullProfile.jpg"}</p>
          </div>
        `);
      }
      if (formData.halfProfileBase64) {
        payload.halfProfile = formData.halfProfileBase64;
        payload.halfProfile_filename = formData.halfProfile?.name || "halfProfile.jpg";
        imageHtmlParts.push(`
          <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Half Profile</h3>
            <img src="${formData.halfProfileBase64}" alt="Half Profile" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 4px;" />
            <p style="margin-top: 5px; color: #666; font-size: 12px;">Filename: ${formData.halfProfile?.name || "halfProfile.jpg"}</p>
          </div>
        `);
      }
      if (formData.fullLengthProfileBase64) {
        payload.fullLengthProfile = formData.fullLengthProfileBase64;
        payload.fullLengthProfile_filename = formData.fullLengthProfile?.name || "fullLengthProfile.jpg";
        imageHtmlParts.push(`
          <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Full Length Profile</h3>
            <img src="${formData.fullLengthProfileBase64}" alt="Full Length Profile" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 4px;" />
            <p style="margin-top: 5px; color: #666; font-size: 12px;">Filename: ${formData.fullLengthProfile?.name || "fullLengthProfile.jpg"}</p>
          </div>
        `);
      }

      // Add HTML-formatted images section that Formspree can include in email
      if (imageHtmlParts.length > 0) {
        const imagesHtml = `
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
            <h2 style="margin-bottom: 20px;">Portfolio Images</h2>
            ${imageHtmlParts.join("")}
          </div>
        `;
        payload._images_html = imagesHtml;
      }

      // Submit directly to Formspree using JSON (CORS-compatible for static builds)
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
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
          tiktok: "",
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status message */}
          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <p className="font-medium">{submitStatus.message}</p>
            </div>
          )}

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
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
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
                Height
              </label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g., 5'8&quot;"
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
                Bust
              </label>
              <input
                type="text"
                name="bust"
                value={formData.bust}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist
              </label>
              <input
                type="text"
                name="waist"
                value={formData.waist}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hips
              </label>
              <input
                type="text"
                name="hips"
                value={formData.hips}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shoe Size
              </label>
              <input
                type="text"
                name="shoeSize"
                value={formData.shoeSize}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hair Color
              </label>
              <input
                type="text"
                name="hairColor"
                value={formData.hairColor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eye Color
              </label>
              <input
                type="text"
                name="eyeColor"
                value={formData.eyeColor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok
              </label>
              <input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
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
              BY SENDING US YOUR APPLICATION, YOU AGREE WITH OUR TERMS AND CONDITIONS AND THE TREATMENT OF YOUR PERSONAL DATA BY OUR AGENCY
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

