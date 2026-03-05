import Script from "next/script";

interface CookiebotProps {
  readonly cbid: string;
}

export default function Cookiebot({
  cbid,
}: Readonly<CookiebotProps>) {
  if (!cbid) {
    return null;
  }

  return (
    <Script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={cbid}
      strategy="afterInteractive"
    />
  );
}

