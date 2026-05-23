import fs from 'fs';
import path from 'path';

const files = [
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/working-hours/page.tsx",
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx",
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/settings/page.tsx",
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/services/page.tsx",
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/page.tsx",
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/promotions/page.tsx",
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/customers/page.tsx",
  "d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/appointments/page.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('import toast from "react-hot-toast"')) {
    content = content.replace(/"use client";\r?\n/, '"use client";\nimport toast from "react-hot-toast";\n');
    fs.writeFileSync(file, content);
    console.log("Fixed import in", file);
  }
}
