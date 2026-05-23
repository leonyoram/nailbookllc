import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: 'demo-salon' } });
  if (!tenant) {
    console.log("Tenant not found");
    return;
  }
  const tenantId = tenant.id;

  const customer = await prisma.customer.findFirst({ where: { tenantId } });
  const booking = await prisma.booking.findFirst({ where: { tenantId } });

  if (!customer || !booking) {
    console.log("Missing customer or booking data");
    return;
  }

  // Test 1: Create Promotion
  const promo = await prisma.promotion.create({
    data: {
      tenantId,
      title: "Tuesday Happy Hour",
      description: "20% off all services on Tuesday mornings",
      discount: 20,
      type: "percentage",
      startTime: "09:00",
      endTime: "12:00",
      dayOfWeek: "Tuesday",
      isActive: true,
    }
  });
  console.log("Promotion created:", promo.title);

  // Test 2: Create Review
  // Check if review exists for this booking first
  let review = await prisma.review.findUnique({ where: { bookingId: booking.id } });
  
  if (!review) {
    review = await prisma.review.create({
      data: {
        tenantId,
        bookingId: booking.id,
        customerId: customer.id,
        rating: 3,
        comment: "Service was okay but a bit rushed.",
        status: "Pending", // 3 stars is pending
      }
    });
    console.log("Review created:", review.rating, "stars, status:", review.status);
  } else {
    console.log("Review already exists for this booking.");
  }
}

runTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
