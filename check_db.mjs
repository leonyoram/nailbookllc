import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to the database...");
    
    const counts = {
      Tenant: await prisma.tenant.count(),
      Service: await prisma.service.count(),
      Staff: await prisma.staff.count(),
      Booking: await prisma.booking.count(),
      Customer: await prisma.customer.count(),
      SuperAdminUser: await prisma.superAdminUser.count(),
      Promotion: await prisma.promotion.count(),
      Coupon: await prisma.coupon.count(),
      Review: await prisma.review.count(),
      SystemSettings: await prisma.systemSettings.count(),
    };

    console.log("\n--- DATABASE RECORD COUNTS ---");
    for (const [model, count] of Object.entries(counts)) {
      console.log(`${model.padEnd(15)}: ${count}`);
    }
    console.log("------------------------------\n");

  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
