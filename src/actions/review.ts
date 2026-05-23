"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  tenantId: string;
  bookingId: string;
  customerId?: string;
  rating: number;
  comment?: string;
}) {
  try {
    const existing = await prisma.review.findUnique({
      where: { bookingId: data.bookingId },
    });

    if (existing) {
      return { success: false, error: "Review already exists for this booking." };
    }

    const review = await prisma.review.create({
      data: {
        tenantId: data.tenantId,
        bookingId: data.bookingId,
        customerId: data.customerId,
        rating: data.rating,
        comment: data.comment,
        status: data.rating >= 4 ? "Published" : "Pending", // Auto-publish 4-5 stars
      },
    });

    revalidatePath(`/[tenantSlug]/admin/reviews`, "page");
    return { success: true, review: JSON.parse(JSON.stringify(review)) };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { success: false, error: "System error while creating review" };
  }
}

export async function getReviews(tenantId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { tenantId },
      include: {
        customer: true,
        booking: {
          include: { service: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}
