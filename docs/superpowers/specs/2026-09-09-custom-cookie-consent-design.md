# Custom GDPR cookie consent UI — design

Date: 2026-09-09  
Status: approved (approach 1)  
Repo: `modeling-portfolio`

## Goal

Replace Cookiebot with a first-party, agency-fit consent bar that does not cover the hero, and load non-essential third-party scripts only after the visitor accepts.

## Decisions

| Topic | Choice |
| --- | --- |
| Consent model | **C** — Accept all / Reject non-essential (no category toggles) |
| Placement | **A** — slim fixed bottom bar |
| Banner language | **C** — browser language (`navigator.languages` / `language`); `bg*` → Bulgarian, else English |
| CMP | First-party only; **remove Cookiebot** (script, env, privacy copy mentions) |
| Reopen | Footer link “Cookie settings” / Bulgarian equivalent |

## Out of scope

- IAB TCF / Cookiebot auto-blocking  
- Per-category preference UI  
- Server-side consent logging / CMP vendor certification  
- Changing Privacy Policy legal substance beyond removing Cookiebot references and describing this banner  
- Gating first-party essential app cookies (none beyond consent preference itself)

## Consent state

Storage key: `velishe_cookie_consent` in `localStorage`.

Value JSON:

```ts
type CookieConsentChoice = {
  status: "accepted" | "rejected";
  updatedAt: string; // ISO timestamp
  version: 1;
};
```

- Missing / invalid → show bar; non-essential scripts **off**  
- `accepted` → load non-essential scripts; hide bar  
- `rejected` → keep non-essential off; hide bar  
- Footer reopen clears UI visibility only (shows bar again) without erasing choice until user picks again — or shows bar with current choice still applied until they click Accept/Reject again. **Chosen behavior:** reopen shows the bar; existing choice remains in effect until a new click updates storage.

Optional mirror: **skip for v1** — `localStorage` only. Revisit a SameSite cookie if SSR ever needs the choice.

## What is gated (non-essential)

Load **only after** `status === "accepted"`:

- Google Tag Manager (`GoogleTagManager`)  
- Google Analytics gtag (`GoogleAnalytics`) when used without GTM  
- `@vercel/analytics` (`Analytics`)  
- Trustpilot bootstrap script + widget render in footer  

Always allowed (necessary / first-party product):

- Site HTML/CSS/JS, images, forms  
- Consent preference storage itself  
- `PageViewTracker` / `dataLayer` pushes: only fire when analytics allowed (no-op or skip when rejected)

## UI

### Bottom bar (`CookieConsentBar`)

- Fixed bottom, full width, white background, hairline top border (`border-gray-200`), subtle shadow optional only if needed for legibility  
- Does **not** use a full-screen underlay; page remains scrollable and visible  
- Copy: one short sentence + privacy policy link  
- Actions: primary black **Accept all**; secondary outline/text **Reject non-essential**  
- `z-index` above content, below nothing critical (above sticky header is fine for a bottom bar — use e.g. `z-[60]`)  
- Focus trap not required (non-modal); first focusable control reachable; `role="dialog"` **avoided** (not a modal). Use `role="region"` + `aria-label`  
- Respect `prefers-reduced-motion` (no flashy enter animation required; optional short fade)

### Copy (EN / BG)

EN (default):

- Body: “We use cookies for essential site functions and, with your OK, analytics to improve Velishe.”  
- Accept: “Accept all”  
- Reject: “Reject non-essential”  
- Privacy link: “Privacy policy”  
- Footer reopen: “Cookie settings”

BG (when browser language starts with `bg`):

- Body: “Използваме бисквитки за основни функции на сайта и, с вашето съгласие, аналитични бисквитки за подобряване на Velishe.”  
- Accept: “Приемам всички”  
- Reject: “Отхвърли несъществените”  
- Privacy link: “Политика за поверителност”  
- Footer reopen: “Настройки за бисквитки”

Privacy href: prefer path matching current page locale (`/privacy/` vs `/bg/privacy/`) via existing locale detection from pathname — independent of banner language.

### Footer

Add text button/link next to Trustpilot / copyright row that dispatches reopen (custom event or shared React context). When Trustpilot is not consented, show the static Trustpilot text link only (current fallback `<a href={TRUSTPILOT_URL}>`) without loading the widget script.

## Architecture

```
lib/cookie-consent.ts          // types, storage read/write, version, language helper
components/CookieConsentProvider.tsx  // client context: choice, setChoice, reopen, hydrated
components/CookieConsentBar.tsx       // bottom bar UI
components/ConsentGatedScripts.tsx    // render GTM/GA/Analytics/Trustpilot when accepted
```

Root `app/layout.tsx`:

1. Remove `Cookiebot`  
2. Wrap app (or at least scripts + footer + bar) in `CookieConsentProvider`  
3. Do **not** mount GTM/GA/`Analytics`/Trustpilot script until accepted  

`PageViewTracker` / `lib/gtm.ts`: guard pushes when consent is not accepted.

## Privacy / legal copy updates

- `lib/i18n/legal.ts` (and EN privacy page if hardcoded Cookiebot): replace Cookiebot mentions with first-party banner description  
- Contact footer strings already say “Privacy and cookies policy” — keep  

## Testing

- Unit: parse/store consent JSON; language helper `bg` vs `en`; “shouldLoadAnalytics(choice)”  
- Manual: first visit shows bar and no GTM network call until Accept; Reject keeps scripts off; reopen shows bar; `/` and `/bg/` privacy links correct  

## Success criteria

- Cookiebot script gone from production HTML  
- First paint of homepage is not covered by a consent wall  
- Non-essential third parties do not load before Accept  
- Visitor can reject and continue using the site  
- Preferences reopenable from footer  
