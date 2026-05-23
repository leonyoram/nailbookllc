const fs = require('fs');

let content = fs.readFileSync('src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', 'utf8');

// Use regex to be more forgiving with whitespace
content = content.replace(
  /const handleCreateStaff = async \(\) => {\s+if \(!tenant \|\| !formName \|\| isSubmitting\) return;\s+setIsSubmitting\(true\);/,
  `const handleCreateStaff = async () => {
    if (!tenant || !formName || isSubmitting) return;

    if (tenant.staffLimit !== undefined && staffList.length >= tenant.staffLimit) {
      toast.error(\`Staff limit reached! Your plan allows max \${tenant.staffLimit} members.\`);
      return;
    }

    setIsSubmitting(true);`
);

content = content.replace(
  /<button\s+onClick=\{\(\) => \{ resetForm\(\); setShowAddForm\(!showAddForm\); \}\}\s+className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap"\s+>/,
  `<button 
            onClick={() => { 
              if (tenant?.staffLimit && staffList.length >= tenant.staffLimit) {
                toast.error(\`Upgrade your plan to add more than \${tenant.staffLimit} staff members.\`);
                return;
              }
              resetForm(); 
              setShowAddForm(!showAddForm); 
            }}
            className={\`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap \${tenant?.staffLimit && staffList.length >= tenant.staffLimit ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'}\`}
          >`
);

fs.writeFileSync('src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', content);
console.log("Done");
