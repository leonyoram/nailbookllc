import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'demo-salon';
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  
  if (!tenant) {
    console.log("Tenant not found.");
    return;
  }
  
  const staff = await prisma.staff.findMany({ where: { tenantId: tenant.id } });
  const services = await prisma.service.findMany({ where: { tenantId: tenant.id } });
  
  console.log(JSON.stringify({ staff, services }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
