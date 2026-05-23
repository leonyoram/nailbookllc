const fs = require('fs');

function serializeResult(content, pattern, replacer) {
  return content.replace(pattern, replacer);
}

// 1. src/actions/attendance.ts
let att = fs.readFileSync('d:/Antigravity/src/actions/attendance.ts', 'utf8');
att = att.replace(/return \{ success: true, data: result \};/g, 'return { success: true, data: JSON.parse(JSON.stringify(result)) };');
att = att.replace(/return \{ success: true, data: record \};/g, 'return { success: true, data: JSON.parse(JSON.stringify(record)) };');
att = att.replace(/return \{ success: true, data: records \};/g, 'return { success: true, data: JSON.parse(JSON.stringify(records)) };');
fs.writeFileSync('d:/Antigravity/src/actions/attendance.ts', att);

// 2. src/actions/booking.ts
let bkg = fs.readFileSync('d:/Antigravity/src/actions/booking.ts', 'utf8');
bkg = bkg.replace(/return \{ success: true, booking \};/g, 'return { success: true, booking: JSON.parse(JSON.stringify(booking)) };');
fs.writeFileSync('d:/Antigravity/src/actions/booking.ts', bkg);

// 3. src/actions/coupon.ts
let cpn = fs.readFileSync('d:/Antigravity/src/actions/coupon.ts', 'utf8');
cpn = cpn.replace(/return await prisma\.coupon\.findMany\(\{([\s\S]*?)\}\);/g, `const coupons = await prisma.coupon.findMany({$1});\n    return JSON.parse(JSON.stringify(coupons));`);
cpn = cpn.replace(/return \{ success: true, coupon \};/g, 'return { success: true, coupon: JSON.parse(JSON.stringify(coupon)) };');
fs.writeFileSync('d:/Antigravity/src/actions/coupon.ts', cpn);

// 4. src/actions/promotion.ts
let prm = fs.readFileSync('d:/Antigravity/src/actions/promotion.ts', 'utf8');
prm = prm.replace(/return await prisma\.promotion\.findMany\(\{([\s\S]*?)\}\);/g, `const promotions = await prisma.promotion.findMany({$1});\n    return JSON.parse(JSON.stringify(promotions));`);
prm = prm.replace(/return \{ success: true, promotion: promo \};/g, 'return { success: true, promotion: JSON.parse(JSON.stringify(promo)) };');
fs.writeFileSync('d:/Antigravity/src/actions/promotion.ts', prm);

// 5. src/actions/review.ts
let rev = fs.readFileSync('d:/Antigravity/src/actions/review.ts', 'utf8');
rev = rev.replace(/return await prisma\.review\.findMany\(\{([\s\S]*?)\}\);/g, `const reviews = await prisma.review.findMany({$1});\n    return JSON.parse(JSON.stringify(reviews));`);
rev = rev.replace(/return \{ success: true, review \};/g, 'return { success: true, review: JSON.parse(JSON.stringify(review)) };');
fs.writeFileSync('d:/Antigravity/src/actions/review.ts', rev);

// 6. src/actions/settings.ts
let set = fs.readFileSync('d:/Antigravity/src/actions/settings.ts', 'utf8');
set = set.replace(/return settings;/g, 'return JSON.parse(JSON.stringify(settings));');
set = set.replace(/return \{ success: true, settings \};/g, 'return { success: true, settings: JSON.parse(JSON.stringify(settings)) };');
fs.writeFileSync('d:/Antigravity/src/actions/settings.ts', set);

// 7. src/actions/staff.ts
let stf = fs.readFileSync('d:/Antigravity/src/actions/staff.ts', 'utf8');
stf = stf.replace(/return \{ success: true, staff \};/g, 'return { success: true, staff: JSON.parse(JSON.stringify(staff)) };');
fs.writeFileSync('d:/Antigravity/src/actions/staff.ts', stf);

// 8. src/actions/superAdminUser.ts
let sad = fs.readFileSync('d:/Antigravity/src/actions/superAdminUser.ts', 'utf8');
sad = sad.replace(/return \{ success: true, data: users \};/g, 'return { success: true, data: JSON.parse(JSON.stringify(users)) };');
fs.writeFileSync('d:/Antigravity/src/actions/superAdminUser.ts', sad);

// 9. src/actions/support.ts
let sup = fs.readFileSync('d:/Antigravity/src/actions/support.ts', 'utf8');
sup = sup.replace(/return \{ success: true, data: message \};/g, 'return { success: true, data: JSON.parse(JSON.stringify(message)) };');
sup = sup.replace(/return \{ success: true, data: messages \};/g, 'return { success: true, data: JSON.parse(JSON.stringify(messages)) };');
fs.writeFileSync('d:/Antigravity/src/actions/support.ts', sup);

console.log("All fixes applied successfully.");
