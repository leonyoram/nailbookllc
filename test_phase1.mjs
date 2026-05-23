import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: 'demo-salon' } });
  if (!tenant) {
    console.log("Tenant not found");
    return;
  }
  const tenantId = tenant.id;
  const staff = await prisma.staff.findFirst({ where: { tenantId } });
  const service = await prisma.service.findFirst({ where: { tenantId } });
  let customer = await prisma.customer.findFirst({ where: { tenantId } });

  if (!customer) {
    customer = await prisma.customer.create({
      data: { tenantId, name: "Test Customer", phone: "999-999-9999" }
    });
  }

  if (!staff || !service) {
    console.log("Missing test data (staff or service)");
    return;
  }

  // Set staff commission rate
  await prisma.staff.update({
    where: { id: staff.id },
    data: { commissionRate: 15 } // 15%
  });

  // Create booking with deposit
  const booking = await prisma.booking.create({
    data: {
      tenantId,
      customerName: customer.name,
      customerPhone: customer.phone,
      serviceId: service.id,
      staffId: staff.id,
      customerId: customer.id,
      date: "2026-05-15",
      time: "10:00",
      status: "Pending",
      depositAmount: 20, // $20 deposit
      paymentStatus: "Partial",
    }
  });

  console.log("Booking created with deposit:", booking.depositAmount);

  // Update status to Completed (simulate the logic in booking.ts)
  const status = "Completed";
  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: { status },
    include: { service: true, staff: true }
  });

  if (status === "Completed" && updatedBooking.staffId && updatedBooking.staff) {
    const commissionRate = updatedBooking.staff.commissionRate || 0;
    if (commissionRate > 0) {
      const amount = (updatedBooking.service.price * commissionRate) / 100;
      await prisma.commission.upsert({
        where: { bookingId: updatedBooking.id },
        update: { amount, staffId: updatedBooking.staffId },
        create: {
          tenantId: updatedBooking.tenantId,
          staffId: updatedBooking.staffId,
          bookingId: updatedBooking.id,
          amount,
        }
      });
    }
  }

  // Check commission
  const commission = await prisma.commission.findUnique({
    where: { bookingId: booking.id }
  });

  console.log("Commission created:", commission);
}

runTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
