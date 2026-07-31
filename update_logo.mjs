import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating all tenants to use the new logo...");
  const result = await prisma.tenant.updateMany({
    data: {
      logo: '/logo.png',
    },
  });
  console.log(`Updated ${result.count} tenants successfully.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
