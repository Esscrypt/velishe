import { NextResponse, type NextRequest } from "next/server";
import { CMS_PREVIEW_QUERY } from "@/lib/cms-preview";

const SELF_ONLY_FRAME_ANCESTORS = "frame-ancestors 'self'";

const CMS_PREVIEW_FRAME_ANCESTORS = [
  "frame-ancestors",
  "'self'",
  "http://localhost:3001",
  "https://velishe-admin.vercel.app",
  "https://*.vercel.app",
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
