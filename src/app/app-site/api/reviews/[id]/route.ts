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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const existingReview = await prisma.review.findFirst({
      where: { id, tenantId },
    });

    if (!existingReview) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        status: status || existingReview.status,
      },
    });

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("API Review PUT error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
