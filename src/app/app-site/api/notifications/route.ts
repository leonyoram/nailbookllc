import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-vici-booking-key-change-in-production"
);

async function getTenantFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.tenantId as string;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { tenantId, read: false },
        data: { read: true },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId, tenantId },
        data: { read: true },
      });
    } else {
      return NextResponse.json({ success: false, error: "Missing notificationId or markAll" }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
