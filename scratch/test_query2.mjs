import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
    try {
        console.log("Querying staff Quan Le...");
        const res = await prisma.$queryRaw`SELECT * FROM "Staff" WHERE phone = '0362631945'`;
        console.log("Staff list count:", res.length);
        if (res.length > 0) {
            console.log("Quan Le:", res[0]);
        }
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
