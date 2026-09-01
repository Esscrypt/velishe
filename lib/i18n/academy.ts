import type { SiteLocale } from "./locale";

export type AcademyCopy = {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  tagline: string;
  intro: string;
  waitlistCta: string;
  waitlistDone: string;
  joinWaitlist: string;
  whatIsHeading: string;
  whatIsBody: string;
  coversHeading: string;
  coversIntro: string;
  modules: string[];
  modalTitle: string;
  modalIntro: string;
  emailLabel: string;
  phoneLabel: string;
  submit: string;
  submitting: string;
  close: string;
  successMessage: string;
  submitError: string;
  fixForm: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  unexpectedError: string;
  certificateAlt: string;
};

const EN: AcademyCopy = {
  metaTitle: "VÈLISHE Academy",
  metaDescription:
    "VÈLISHE Academy in Sofia — structured model training: composites, casting prep, etiquette, portfolio building, and career guidance. Join the waitlist.",
  heading: "Academy",
  tagline: "Immerse yourself in the VÈLISHE world and the modeling industry.",
  intro:
    "VÈLISHE Academy is our learning path for aspiring and signed talents who want to understand how the industry really works.",
  waitlistCta: "Apply for priority access - Join the Waitlist for the Next Intake.",
  waitlistDone:
    "You're on the waitlist. We'll be in touch when the next Academy program opens.",
  joinWaitlist: "JOIN THE WAITLIST",
  whatIsHeading: "What is the VÈLISHE Model Academy?",
  whatIsBody:
    "The VÈLISHE Academy is a structured training programme in Sofia for aspiring and signed models who want to understand how the modeling industry really works. It is run by Velishe Model Management, a boutique agency founded in 2025, and it is separate from the signed Mainboard and Development rosters. Enrolment is by intake. Join the waitlist to be notified when the next programme opens. The Academy is taught in English and Bulgarian and is designed for people who want professional composites, casting preparation, and a sustainable approach to a modeling career — not a one-off photoshoot.",
  coversHeading: "What the Academy covers",
  coversIntro:
    "The programme covers five areas that match how bookings actually happen in Sofia and on international jobs:",
  modules: [
    "Composites and casting preparation — how to present measurements, digitals, and a book that clients can use.",
    "Professional conduct on set — timing, direction, and working with photographers, stylists, and clients.",
    "Industry etiquette — agency communication, usage, and how bookings are confirmed.",
    "Portfolio building — what to shoot, what to leave out, and how a board evolves over a season.",
    "Building a sustainable career — markets, travel, and long-term representation with Velishe.",
  ],
  modalTitle: "Join the Academy waitlist",
  modalIntro:
    "Share your contact details and we will notify you when the next Academy intake opens.",
  emailLabel: "Email *",
  phoneLabel: "Phone number *",
  submit: "JOIN WAITLIST",
  submitting: "SUBMITTING...",
  close: "Close",
  successMessage:
    "Thank you for your interest. We will contact you with more information.",
  submitError: "An error occurred while submitting the form. Please try again.",
  fixForm: "Please fix the errors in the form and try again.",
  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email address",
  phoneRequired: "Phone number is required",
  phoneInvalid: "Please enter a valid phone number",
  unexpectedError: "An unexpected error occurred. Please try again later.",
  certificateAlt: "VÉLISHE Model Academy certificate of completion",
};

const BG: AcademyCopy = {
  metaTitle: "VÈLISHE Academy",
  metaDescription:
    "VÈLISHE Academy в София — структурирано обучение за модели: композити, кастинг, етикет, портфолио и кариера. Запишете се в waitlist.",
  heading: "Academy",
  tagline: "Потопете се в света на VÈLISHE и моделната индустрия.",
  intro:
    "VÈLISHE Academy е нашата програма за кандидати и подписани таленти, които искат да разберат как наистина работи индустрията.",
  waitlistCta:
    "Кандидатствайте за приоритетен достъп — Join the Waitlist за следващата група.",
  waitlistDone:
    "Вече сте в waitlist. Ще се свържем с вас, когато отвори следващата Academy група.",
  joinWaitlist: "JOIN THE WAITLIST",
  whatIsHeading: "Какво е VÈLISHE Model Academy?",
  whatIsBody:
    "VÈLISHE Academy е структурирана програма за обучение в София за кандидати и подписани модели. Управлява се от Velishe Model Management, бутикова агенция основана през 2025 г., и е отделна от подписаните roster-и Mainboard и Development. Записването е по intake; присъединете се към waitlist за следващата група. Занятията са на английски и български и са насочени към професионални композити, подготовка за кастинг и устойчива моделска кариера — не е еднократна фотосесия.",
  coversHeading: "Какво включва Academy",
  coversIntro:
    "Програмата обхваща пет области, съответстващи на реални резервации в София и в чужбина:",
  modules: [
    "Композити и подготовка за кастинг — как да представите мерки, digitals и book, които клиентите могат да използват.",
    "Професионално поведение на сет — timing, direction и работа с фотографи, стylistи и клиенти.",
    "Етикет в индустрията — комуникация с агенцията, usage и потвърждаване на резервации.",
    "Изграждане на портфолио — какво да снимате, какво да пропуснете и как се развива board през сезона.",
    "Устойчива кариера — пазари, пътувания и дългосрочно представителство с Velishe.",
  ],
  modalTitle: "Waitlist за Academy",
  modalIntro:
    "Споделете контактите си и ще ви уведомим, когато отвори следващата Academy група.",
  emailLabel: "Имейл *",
  phoneLabel: "Телефон *",
  submit: "JOIN WAITLIST",
  submitting: "ИЗПРАЩАНЕ...",
  close: "Затвори",
  successMessage:
    "Благодарим за интереса. Ще се свържем с вас с повече информация.",
  submitError: "Грешка при изпращане. Моля, опитайте отново.",
  fixForm: "Моля, коригирайте грешките във формуляра и опитайте отново.",
  emailRequired: "Имейлът е задължителен",
  emailInvalid: "Въведете валиден имейл адрес",
  phoneRequired: "Телефонът е задължителен",
  phoneInvalid: "Въведете валиден телефонен номер",
  unexpectedError: "Неочаквана грешка. Моля, опитайте по-късно.",
  certificateAlt: "Сертификат за завършване на VÉLISHE Model Academy",
};

export function academyCopy(locale: SiteLocale): AcademyCopy {
  return locale === "bg" ? BG : EN;
}
