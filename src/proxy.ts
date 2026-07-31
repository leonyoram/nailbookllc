import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-vici-booking-key-change-in-production"
);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /[tenantSlug]/admin routes
  const adminMatch = pathname.match(/^\/([^/]+)\/admin/);
  
  if (adminMatch) {
    const tenantSlug = adminMatch[1];
    
    // Look for the specific cookie for this tenant
    const cookieName = `tenant_auth_${tenantSlug}`;
    const token = request.cookies.get(cookieName)?.value;

    if (!token) {
      // Not logged in, redirect to login page for this tenant
      return NextResponse.redirect(new URL(`/${tenantSlug}/login`, request.url));
    }

    try {
      // Verify the token
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Ensure the token belongs to the correct tenant
      if (payload.slug !== tenantSlug) {
        return NextResponse.redirect(new URL(`/${tenantSlug}/login`, request.url));
      }
    } catch (error) {
      // Token invalid or expired
      return NextResponse.redirect(new URL(`/${tenantSlug}/login`, request.url));
    }
  }

  // Handle Domain Routing
  const hostname = request.headers.get("host") || "";
  const isApp = hostname.startsWith("app.");

  const searchParams = request.nextUrl.searchParams.toString();
  const fullPath = `${pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  if (isApp) {
    return NextResponse.rewrite(new URL(`/app-site${fullPath}`, request.url));
  } else {
    return NextResponse.rewrite(new URL(`/landing-site${fullPath}`, request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\..+).*)",
  ],
};
