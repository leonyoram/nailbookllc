const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tenants = await prisma.tenant.findMany({
    select: { slug: true, adminEmail: true, adminPassword: true, itPassword: true }
  });
  console.log(tenants);
}
main().finally(() => prisma.$disconnect());
