import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
    try {
        console.log("Querying staff...");
        const res = await prisma.$queryRaw`SELECT * FROM "Staff"`;
        console.log("Staff list count:", res.length);
        if (res.length > 0) {
            console.log("First staff:", res[0]);
        }
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
