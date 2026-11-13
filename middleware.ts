import { NextResponse, type NextRequest } from "next/server";
import {
  CMS_PREVIEW_QUERY,
  TRUSTED_CMS_PREVIEW_FRAME_ORIGINS,
} from "@/lib/cms-preview";

const SELF_ONLY_FRAME_ANCESTORS = "frame-ancestors 'self'";

// Branch deploys of the admin app get their own origins, which the CSP cannot
// express without a wildcard, so they are allowed only when the iframe URL
// itself carries the preview flag and the message handler validates the origin.
const CMS_PREVIEW_FRAME_ANCESTORS = [
  "frame-ancestors",
  "'self'",
  ...TRUSTED_CMS_PREVIEW_FRAME_ORIGINS,
].join(" ");

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const isCmsPreview =
    request.nextUrl.searchParams.get(CMS_PREVIEW_QUERY) === "1";

  response.headers.set(
    "Content-Security-Policy",
    isCmsPreview ? CMS_PREVIEW_FRAME_ANCESTORS : SELF_ONLY_FRAME_ANCESTORS,
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all pathnames except static assets and Next internals.
     * Preview iframes hit HTML pages with ?cmsPreview=1.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
