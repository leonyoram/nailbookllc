"use server";

import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-vici-booking-key-change-in-production"
);

export async function loginAdmin(tenantSlug: string, email: string, password: string, rememberMe: boolean = true) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return { success: false, error: "Tenant not found." };
    }

    // Check for IT support account or regular admin
    const isITAccount = email === "itvicimix";
    const isValidPassword = isITAccount 
      ? tenant.itPassword === password 
      : (tenant.adminEmail === email && tenant.adminPassword === password);

    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password!" };
    }

    // Session duration: 7 days as requested, or 24h if not remembered (optional, but requested 7 days)
    const sessionDurationDays = rememberMe ? 7 : 1;
    const sessionDurationSeconds = sessionDurationDays * 24 * 60 * 60;

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

    // Set HTTP-only cookie
    (await cookies()).set(`tenant_auth_${tenant.slug}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDurationSeconds,
      expires: new Date(Date.now() + sessionDurationSeconds * 1000),
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "A system error occurred." };
  }
}

export async function logoutAdmin(tenantSlug: string) {
  (await cookies()).delete(`tenant_auth_${tenantSlug}`);
  return { success: true };
}

export async function loginStaff(tenantSlug: string, phone: string, password: string, rememberMe: boolean = true) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return { success: false, error: "Tenant not found." };
    }

    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    const staffList: any[] = await prisma.$queryRaw`SELECT * FROM "Staff" WHERE "tenantId" = ${tenant.id} AND "phone" = ${cleanPhone} AND "loginPassword" = ${cleanPassword} LIMIT 1`;
    const staff = staffList[0];

    if (!staff) {
      return { success: false, error: "Invalid phone number or password!" };
    }

    // Session duration
    const sessionDurationDays = rememberMe ? 30 : 1;
    const sessionDurationSeconds = sessionDurationDays * 24 * 60 * 60;

    // Create JWT for staff
    const token = await new SignJWT({
      tenantId: tenant.id,
      slug: tenant.slug,
      staffId: staff.id,
      role: staff.role || "Staff",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${sessionDurationDays}d`)
      .sign(JWT_SECRET);

    // Set HTTP-only cookie
    (await cookies()).set(`staff_auth_${tenant.slug}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDurationSeconds,
      expires: new Date(Date.now() + sessionDurationSeconds * 1000),
    });

    return { success: true };
  } catch (error) {
    console.error("Staff Login error:", error);
    return { success: false, error: "A system error occurred." };
  }
}

export async function logoutStaff(tenantSlug: string) {
  (await cookies()).delete(`staff_auth_${tenantSlug}`);
  return { success: true };
}
