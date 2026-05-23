import { PrismaClient, BookingStatus, PaymentStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const tenantId = "5a7796ed-c6b8-4d89-b112-f4a51c18bf05"; // Guessing from logs
    
    // Create or find a service
    const services = await prisma.service.findMany({ where: { tenantId }});
    if (services.length === 0) {
       console.log("No services found");
       return;
    }
    const service = services[0];
    
    console.log("Found service:", service.id, service.name);

    let dbCustomer = await prisma.customer.findFirst({
      where: { tenantId, phone: "5551142412" }
    });

    if (!dbCustomer) {
      console.log("Creating customer");
      dbCustomer = await prisma.customer.create({
        data: {
          tenantId,
          name: "May",
          phone: "5551142412",
          points: 35,
        }
      });
    }

    console.log("Customer OK:", dbCustomer.id);

    console.log("Attempting to create booking...");
    const booking = await prisma.booking.create({
      data: {
        tenantId,
        customerName: "May",
        customerPhone: "5551142412",
        serviceId: service.id,
        staffId: null,
        customerId: dbCustomer.id,
        date: new Date("2026-05-11"), 
        time: "09:00",
        status: BookingStatus.Approved,
        notes: null,
        depositAmount: 0,
        paymentStatus: PaymentStatus.Unpaid,
      },
    });
    console.log("Booking created successfully!", booking.id);
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
