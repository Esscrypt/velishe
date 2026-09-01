import type { SiteLocale } from "./locale";

export type BecomeAModelStrings = {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  introLead: string;
  femaleMin: string;
  maleMin: string;
  photosNote: string;
  whatToWear: string;
  femaleWear: string;
  maleWear: string;
  fixIssues: string;
  gender: string;
  woman: string;
  man: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateOfBirth: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
  instagram: string;
  message: string;
  photosHeading: string;
  headshot: string;
  fullProfile: string;
  halfProfile: string;
  fullLength: string;
  submit: string;
  submitting: string;
  privacyAgreeBefore: string;
  privacyAgreeAfter: string;
  privacyPolicyLinkLabel: string;
  respondNote: string;
  submitShort: string;
  successMessage: string;
  submitError: string;
  fillAllRequired: string;
  errors: {
    genderRequired: string;
    firstNameRequired: string;
    lastNameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    contactRequired: string;
    contactInvalid: string;
    addressRequired: string;
    cityRequired: string;
    stateRequired: string;
    zipRequired: string;
    countryRequired: string;
    dobRequired: string;
    dobAge: string;
    heightRequired: string;
    heightInvalid: string;
    bustRequired: string;
    bustInvalid: string;
    waistRequired: string;
    waistInvalid: string;
    hipsRequired: string;
    hipsInvalid: string;
    shoeRequired: string;
    shoeInvalid: string;
    hairRequired: string;
    eyeRequired: string;
    instagramRequired: string;
    instagramInvalid: string;
    messageRequired: string;
    agreeRequired: string;
    fileProcessError: string;
    totalSize: string;
  };
};

const EN: BecomeAModelStrings = {
  metaTitle: "Become a Model",
  metaDescription:
    "Apply to join Velishe Model Management in Sofia, Bulgaria. Female models from 173 cm, male from 183 cm. Natural unedited photos required.",
  heading: "Become a Model",
  introLead: "We would love to hear from you if you have what it takes and are",
  femaleMin: "Female minimum 173 cm",
  maleMin: "Male minimum 183 cm",
  photosNote:
    "Pictures must be natural, no filter, no editing, no makeup, no hair extension etc.",
  whatToWear: "WHAT TO WEAR",
  femaleWear:
    "Female black bumshort, legging or jeans with a tank top and heels or/and swimwear",
  maleWear: "Male black fitted jeans, a shirt and sneakers or/and swimwear",
  fixIssues: "Please fix the following issues:",
  gender: "Gender *",
  woman: "Woman",
  man: "Man",
  firstName: "Firstname *",
  lastName: "Lastname *",
  email: "Email *",
  contactNumber: "Contact Number *",
  address: "Address *",
  city: "City *",
  state: "State *",
  zipCode: "Zip Code *",
  country: "Country *",
  dateOfBirth: "Date of Birth *",
  height: "Height *",
  bust: "Bust *",
  waist: "Waist *",
  hips: "Hips *",
  shoeSize: "Shoe Size (EU) *",
  hairColor: "Hair Color *",
  eyeColor: "Eye Color *",
  instagram: "Instagram *",
  message: "Message *",
  photosHeading: "Photos *",
  headshot: "Headshot *",
  fullProfile: "Full Profile *",
  halfProfile: "Half Profile *",
  fullLength: "Full Length Profile *",
  submit: "SUBMIT APPLICATION",
  submitting: "SUBMITTING...",
  privacyAgreeBefore: "BY SENDING US YOUR APPLICATION, YOU AGREE WITH OUR ",
  privacyPolicyLinkLabel: "PRIVACY POLICY",
  privacyAgreeAfter: " AND THE TREATMENT OF YOUR PERSONAL DATA BY OUR AGENCY",
  respondNote: "Please note we can only respond to successful applicants",
  submitShort: "SUBMIT",
  successMessage:
    "Thank you for your application! We will contact you if you are successful.",
  submitError:
    "An error occurred while submitting your application. Please try again later.",
  fillAllRequired:
    "Please fill in all required fields and accept the privacy policy.",
  errors: {
    genderRequired: "Gender is required",
    firstNameRequired: "First name is required",
    lastNameRequired: "Last name is required",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    contactRequired: "Contact number is required",
    contactInvalid: "Please enter a valid phone number",
    addressRequired: "Address is required",
    cityRequired: "City is required",
    stateRequired: "State is required",
    zipRequired: "Zip code is required",
    countryRequired: "Country is required",
    dobRequired: "Date of birth is required",
    dobAge: "You must be at least 16 years old",
    heightRequired: "Height is required",
    heightInvalid: "Please enter height in cm, e.g. 173cm (100-250 cm)",
    bustRequired: "Bust measurement is required",
    bustInvalid: "Bust must be a valid number in cm with max 3 digits (e.g., 80-90)",
    waistRequired: "Waist measurement is required",
    waistInvalid: "Waist must be a valid number in cm with max 3 digits (e.g., 60-70)",
    hipsRequired: "Hips measurement is required",
    hipsInvalid: "Hips must be a valid number in cm with max 3 digits (e.g., 90-100)",
    shoeRequired: "Shoe size is required",
    shoeInvalid: "Shoe size must be a valid EU size with max 2 digits (e.g., 40)",
    hairRequired: "Hair color is required",
    eyeRequired: "Eye color is required",
    instagramRequired: "Instagram handle is required",
    instagramInvalid:
      "Please enter a valid Instagram handle (e.g., username or @username)",
    messageRequired: "Message is required",
    agreeRequired: "You must agree to the privacy policy",
    fileProcessError: "Failed to process image. Please try again.",
    totalSize: "Total file size must not exceed 4MB",
  },
};

const BG: BecomeAModelStrings = {
  metaTitle: "Стани модел",
  metaDescription:
    "Кандидатствай в Velishe Model Management, София. Жени от 173 cm, мъже от 183 cm. Задължителни естествени необработени снимки.",
  heading: "Стани модел",
  introLead: "Ще се радваме да чуем от вас, ако имате необходимото и сте",
  femaleMin: "Жена — минимум 173 cm",
  maleMin: "Мъж — минимум 183 cm",
  photosNote:
    "Снимките трябва да са естествени — без филтри, ретуш, грим, удължения на косата и т.н.",
  whatToWear: "КАКВО ДА НОСИТЕ",
  femaleWear:
    "Жена — черни кратки pantalon/legging или дънки с топ и токчета и/или бански",
  maleWear: "Мъж — черни прилежни дънки, риза и маратонки и/или бански",
  fixIssues: "Моля, коригирайте следните проблеми:",
  gender: "Пол *",
  woman: "Жена",
  man: "Мъж",
  firstName: "Име *",
  lastName: "Фамилия *",
  email: "Имейл *",
  contactNumber: "Телефон *",
  address: "Адрес *",
  city: "Град *",
  state: "Област *",
  zipCode: "Пощенски код *",
  country: "Държава *",
  dateOfBirth: "Дата на раждане *",
  height: "Височина *",
  bust: "Гърди *",
  waist: "Талия *",
  hips: "Ханш *",
  shoeSize: "Номер обувки (EU) *",
  hairColor: "Цвят на косата *",
  eyeColor: "Цвят на очите *",
  instagram: "Instagram *",
  message: "Съобщение *",
  photosHeading: "Снимки *",
  headshot: "Headshot *",
  fullProfile: "Пълен профил *",
  halfProfile: "Полупрофил *",
  fullLength: "Full length *",
  submit: "ИЗПРАТИ КАНДИДАТУРА",
  submitting: "ИЗПРАЩАНЕ...",
  privacyAgreeBefore: "С ИЗПРАЩАНЕТО НА КАНДИДАТУРАТА ПРИЕМАТЕ ",
  privacyPolicyLinkLabel: "ПОЛИТИКАТА ЗА ПОВЕРИТЕЛНОСТ",
  privacyAgreeAfter: " И ОБРАБОТКАТА НА ЛИЧНИТЕ ВИ ДАННИ ОТ АГЕНЦИЯТА",
  respondNote:
    "Моля, имайте предвид, че отговаряме само на успешни кандидати",
  submitShort: "ИЗПРАТИ",
  successMessage:
    "Благодарим за кандидатурата! Ще се свържем с вас, ако сте успешни.",
  submitError:
    "Възникна грешка при изпращане. Моля, опитайте отново по-късно.",
  fillAllRequired:
    "Моля, попълнете всички задължителни полета и приемете политиката за поверителност.",
  errors: {
    genderRequired: "Посочете пол",
    firstNameRequired: "Името е задължително",
    lastNameRequired: "Фамилията е задължителна",
    emailRequired: "Имейлът е задължителен",
    emailInvalid: "Въведете валиден имейл адрес",
    contactRequired: "Телефонът е задължителен",
    contactInvalid: "Въведете валиден телефонен номер",
    addressRequired: "Адресът е задължителен",
    cityRequired: "Градът е задължителен",
    stateRequired: "Областта е задължителна",
    zipRequired: "Пощенският код е задължителен",
    countryRequired: "Държавата е задължителна",
    dobRequired: "Датата на раждане е задължителна",
    dobAge: "Трябва да сте навършили поне 16 години",
    heightRequired: "Височината е задължителна",
    heightInvalid: "Въведете височина в cm, напр. 173cm (100–250 cm)",
    bustRequired: "Мерката за гърди е задължителна",
    bustInvalid: "Гърди — валидно число в cm, макс. 3 цифри (напр. 80–90)",
    waistRequired: "Мерката за талия е задължителна",
    waistInvalid: "Талия — валидно число в cm, макс. 3 цифри (напр. 60–70)",
    hipsRequired: "Мерката за ханш е задължителна",
    hipsInvalid: "Ханш — валидно число в cm, макс. 3 цифри (напр. 90–100)",
    shoeRequired: "Номерът на обувките е задължителен",
    shoeInvalid: "Валиден EU номер, макс. 2 цифри (напр. 40)",
    hairRequired: "Цветът на косата е задължителен",
    eyeRequired: "Цветът на очите е задължителен",
    instagramRequired: "Instagram е задължителен",
    instagramInvalid: "Въведете валиден Instagram (username или @username)",
    messageRequired: "Съобщението е задължително",
    agreeRequired: "Трябва да приемете политиката за поверителност",
    fileProcessError: "Грешка при обработка на снимката. Опитайте отново.",
    totalSize: "Общият размер на файловете не трябва да надхвърля 4 MB",
  },
};

export function becomeAModelStrings(locale: SiteLocale): BecomeAModelStrings {
  return locale === "bg" ? BG : EN;
}
