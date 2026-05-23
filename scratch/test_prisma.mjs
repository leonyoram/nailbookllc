import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testUpdate() {
  try {
    const data = {
      name: "KA Nail Salon",
      location: "4016 John F Kennedy Blvd",
      phone: "0362631945",
      bookingPhone: undefined,
      slotInterval: 30,
      minLeadTime: 60,
      themeColor: "#e9c929",
      logo: "",
      googleReviewUrl: "",
      paymentConfig: {
        creditCard: { apiKey: "", merchantId: "" },
        paypal: { clientId: "", secret: "" },
        localPay: { phoneNumber: "", accountName: "" }
      },
      socialLinks: {
        facebook: "",
        instagram: "",
        tiktok: "",
        yelp: "",
        googleMaps: ""
      },
      chatbotEnabled: false,
      chatbotConfig: {
        type: "whatsapp",
        value: "",
        welcomeMessage: "Hi there! How can we help you today?",
        faq: [
          { q: "I want to book an appointment", a: "Yes" },
        ]
      },
      adminEmail: "",
      adminPassword: "",
      itPassword: "",
      payments: ["Pay in Store"]
    };

    const updateData = {
      name: data.name !== undefined ? data.name : undefined,
      location: data.location !== undefined ? data.location : undefined,
      phone: data.phone !== undefined ? data.phone : undefined,
      bookingPhone: data.bookingPhone !== undefined ? data.bookingPhone : undefined,
      slotInterval: data.slotInterval !== undefined ? (parseInt(data.slotInterval) || 30) : undefined,
      minLeadTime: data.minLeadTime !== undefined ? (parseInt(data.minLeadTime) || 60) : undefined,
      themeColor: data.themeColor !== undefined ? data.themeColor : undefined,
      adminEmail: data.adminEmail !== undefined ? data.adminEmail : undefined,
      adminPassword: data.adminPassword !== undefined ? data.adminPassword : undefined,
      itPassword: data.itPassword !== undefined ? data.itPassword : undefined,
      logo: data.logo !== undefined ? data.logo : undefined,
      googleReviewUrl: data.googleReviewUrl !== undefined ? data.googleReviewUrl : undefined,
      socialLinks: data.socialLinks !== undefined ? data.socialLinks : undefined,
      paymentConfig: data.paymentConfig !== undefined ? data.paymentConfig : undefined,
      payments: data.payments !== undefined ? data.payments : undefined,
      chatbotEnabled: data.chatbotEnabled !== undefined ? data.chatbotEnabled : undefined,
      chatbotConfig: data.chatbotConfig !== undefined ? data.chatbotConfig : undefined,
      dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      status: data.status !== undefined ? data.status : undefined,
      region: data.region !== undefined ? data.region : undefined,
      timezone: data.timezone !== undefined ? data.timezone : undefined,
      currency: data.currency !== undefined ? data.currency : undefined,
      locale: data.locale !== undefined ? data.locale : undefined,
    };

    // Remove undefined explicitly like Prisma does
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    await prisma.tenant.update({
      where: { id: "5a7796ed-c6b8-4d89-b112-f4a51c18bf05" },
      data: updateData
    });
    console.log("Success");
  } catch (error) {
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
