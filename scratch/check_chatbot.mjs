import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndEnable() {
  const tenant = await prisma.tenant.findUnique({ where: { slug: 'ka-nail' } });
  if (!tenant) {
    console.log("Tenant ka-nail not found!");
    return;
  }
  
  console.log("Current chatbotEnabled:", tenant.chatbotEnabled);
  console.log("Current chatbotConfig:", tenant.chatbotConfig);

  const updated = await prisma.tenant.update({
    where: { slug: 'ka-nail' },
    data: {
      chatbotEnabled: true,
      chatbotConfig: tenant.chatbotConfig || JSON.stringify({ type: "script", welcomeMessage: "Xin chào! Tôi có thể giúp gì cho bạn?" })
    }
  });

  console.log("Updated chatbotEnabled to true.");
}

checkAndEnable().finally(() => prisma.$disconnect());
