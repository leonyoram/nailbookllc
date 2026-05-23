import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
    try {
        const tenant = await prisma.tenant.findFirst();
        console.log("Tenant Slug:", tenant.slug);
        
        const phone = "0362631945";
        const password = "123456";
        
        const staffList = await prisma.$queryRaw`SELECT * FROM "Staff" WHERE "tenantId" = ${tenant.id} AND "phone" = ${phone} AND "loginPassword" = ${password} LIMIT 1`;
        console.log("Found staff length:", staffList.length);
        if (staffList.length > 0) {
             console.log("Staff:", staffList[0]);
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}
run();
