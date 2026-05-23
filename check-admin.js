const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.tenant.findFirst().then(t => {
  console.log('TENANT_ADMIN_EMAIL:', t.adminEmail);
  console.log('TENANT_ADMIN_PASSWORD:', t.adminPassword);
  return prisma.$disconnect();
}).catch(console.error);
