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
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            if(document.getElementById('Cookiebot')) return;
            var s = document.createElement('script');
            s.id = 'Cookiebot';
            s.src = 'https://consent.cookiebot.com/uc.js';
            s.setAttribute('data-cbid', '${cbid}');
            s.type = 'text/javascript';
            s.async = true;
            document.head.appendChild(s);
          })();
        `,
      }}
    />
  );
}

