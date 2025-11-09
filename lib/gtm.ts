// Google Tag Manager utility functions

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

/**
 * Push an event to Google Tag Manager dataLayer
 */
export const pushToDataLayer = (event: Record<string, unknown>): void => {
  if (globalThis.window?.dataLayer) {
    globalThis.window.dataLayer.push(event);
  }
};

/**
 * Track page view
 */
export const trackPageView = (url: string, title?: string): void => {
  const pageTitle = title ?? (globalThis.document?.title ?? "");
  const pageLocation = globalThis.window?.location.href ?? "";
  
  pushToDataLayer({
    event: "page_view",
    page_path: url,
    page_title: pageTitle,
    page_location: pageLocation,
  });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (
  formName: string,
  formData?: Record<string, unknown>
): void => {
  pushToDataLayer({
    event: "form_submit",
    form_name: formName,
    form_data: formData,
  });
};

/**
 * Track form start (when user begins filling out form)
 */
export const trackFormStart = (formName: string): void => {
  pushToDataLayer({
    event: "form_start",
    form_name: formName,
  });
};

/**
 * Track privacy policy link click
 */
export const trackPrivacyPolicyClick = (source: string): void => {
  pushToDataLayer({
    event: "privacy_policy_click",
    source: source, // e.g., "become_a_model_form"
  });
};

