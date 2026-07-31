import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-vici-booking-key-change-in-production"
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantSlug, email, password } = body;

    if (!tenantSlug || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Tenant not found." }, { status: 404 });
    }

    // Check for IT support account or regular admin
    const isITAccount = email === "itvicimix";
    const isValidPassword = isITAccount 
      ? tenant.itPassword === password 
      : (tenant.adminEmail === email && tenant.adminPassword === password);

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid email or password!" }, { status: 401 });
    }

    // Session duration: 30 days for mobile app
    const sessionDurationDays = 30;

    // Create JWT
    const token = await new SignJWT({
      tenantId: tenant.id,
      slug: tenant.slug,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${sessionDurationDays}d`)
      .sign(JWT_SECRET);

    return NextResponse.json({ 
      success: true, 
      token, 
      tenant: { 
        id: tenant.id, 
        name: tenant.name, 
        slug: tenant.slug,
        logo: tenant.logo
      } 
    });
  } catch (error) {
    console.error("API Login error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
