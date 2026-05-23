const fs = require('fs');

let content = fs.readFileSync('src/actions/booking.ts', 'utf8');

const oldStaffLogic = `    // 2. Ensure Staff exists if provided
    let dbStaff = null;
    if (staff && staff.id) {
      dbStaff = await prisma.staff.upsert({
        where: { id: staff.id },
        update: {},
        create: {
          id: staff.id,
          tenantId,
          name: staff.name,
          role: "Staff",
        },
      });
    }`;

const newStaffLogic = `    // 2. Ensure Staff exists or Auto-assign
    let dbStaff = null;
    if (staff && staff.id) {
      dbStaff = await prisma.staff.upsert({
        where: { id: staff.id },
        update: {},
        create: {
          id: staff.id,
          tenantId,
          name: staff.name,
          role: "Staff",
        },
      });
    } else {
      // Auto Staff Assignment: Least Busy
      const allStaff = await prisma.staff.findMany({ where: { tenantId } });
      if (allStaff.length > 0) {
        const targetDate = new Date(date);
        const todaysBookings = await prisma.booking.groupBy({
          by: ['staffId'],
          where: { tenantId, date: targetDate, staffId: { not: null } },
          _count: { staffId: true }
        });
        const countMap = new Map();
        for (const tb of todaysBookings) {
          countMap.set(tb.staffId, tb._count.staffId);
        }
        let minStaff = allStaff[0];
        let minCount = countMap.get(minStaff.id) || 0;
        for (let i = 1; i < allStaff.length; i++) {
          const c = countMap.get(allStaff[i].id) || 0;
          if (c < minCount) {
            minCount = c;
            minStaff = allStaff[i];
          }
        }
        dbStaff = minStaff;
      }
    }`;

content = content.replace(oldStaffLogic, newStaffLogic); // createBooking
content = content.replace(oldStaffLogic, newStaffLogic); // createMultipleBookings

fs.writeFileSync('src/actions/booking.ts', content);
console.log("Done");
