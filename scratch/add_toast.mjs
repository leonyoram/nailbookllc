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
  
  // Skip if already imported
  if (!content.includes('import toast from "react-hot-toast"')) {
    // Add import after the first import or "use client";
    content = content.replace(/("use client";\n)/, '$1import toast from "react-hot-toast";\n');
  }

  // Replace `if (result.success) {` with toast if it doesn't have a toast immediately
  content = content.replace(/if\s*\(\s*result\.success\s*\)\s*\{(?!\s*toast\.success)/g, 'if (result.success) {\n        toast.success("Action completed successfully!");');

  fs.writeFileSync(file, content);
  console.log("Updated", file);
}
