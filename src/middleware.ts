import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/jwt";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, etc
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. app.nailbook247.com or app.localhost:3000)
  const hostname = req.headers.get("host") || "";

  // Check if subdomain is 'app'
  const isApp = hostname.startsWith("app.");

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // Rewrite to the correct folder
  if (isApp) {
    return NextResponse.rewrite(new URL(`/app-site${path}`, req.url));
  }

  return NextResponse.rewrite(new URL(`/landing-site${path}`, req.url));
}
