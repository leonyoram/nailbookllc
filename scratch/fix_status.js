const fs = require('fs');

const files = [
  'd:/Antigravity/src/actions/booking.ts',
  'd:/Antigravity/src/app/(customer)/[tenantSlug]/admin/page.tsx',
  'd:/Antigravity/src/app/(customer)/[tenantSlug]/admin/appointments/page.tsx',
  'd:/Antigravity/src/app/(customer)/[tenantSlug]/admin/calendar/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file.includes('booking.ts')) {
    content = content.replace(/status === "Approved"/g, 'status === "Confirmed"');
  } else if (file.includes('calendar/page.tsx')) {
    content = content.replace(/status: "Approved"/g, 'status: "Confirmed"');
  } else {
    content = content.replace(/"Approved"/g, '"Confirmed"');
    content = content.replace(/>Approved</g, '>Confirmed<');
  }
  
  fs.writeFileSync(file, content);
}
console.log("Replaced Approved with Confirmed for Bookings.");
