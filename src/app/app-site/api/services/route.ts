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

    const services = await prisma.service.findMany({
      where: { tenantId },
      orderBy: [
        { name: 'asc' },
      ],
    });
    
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("API Services error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenantId = await getTenantFromToken(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, price, duration, description } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ success: false, error: "Name and price are required" }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        categoryId: category || null,
        price: Number(price),
        duration: Number(duration || 30),
        tenantId,
      },
    });
    
    return NextResponse.json({ success: true, data: newService });
  } catch (error) {
    console.error("API Services POST error:", error);
    return NextResponse.json({ success: false, error: "A system error occurred." }, { status: 500 });
  }
}
