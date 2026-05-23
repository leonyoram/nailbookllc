const fs = require('fs');

let page = fs.readFileSync('d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', 'utf8');

// 1. Add state for salary
if (!page.includes('formBaseSalary')) {
  page = page.replace(
    /const \[formRole, setFormRole\] = useState\("Technician"\);/,
    `const [formRole, setFormRole] = useState("Technician");\n  const [formBaseSalary, setFormBaseSalary] = useState("0");\n  const [formSalaryType, setFormSalaryType] = useState("Commission");\n  const [formSalaryCycle, setFormSalaryCycle] = useState("Monthly");\n  const [formCommissionRate, setFormCommissionRate] = useState("0");`
  );
}

// 2. Add reset form
if (!page.includes('setFormBaseSalary("0")')) {
  page = page.replace(
    /setFormDayOff\("None"\);/g,
    `setFormDayOff("None");\n    setFormBaseSalary("0");\n    setFormSalaryType("Commission");\n    setFormSalaryCycle("Monthly");\n    setFormCommissionRate("0");`
  );
}

// 3. Update handleCreateStaff
if (!page.includes('baseSalary: formBaseSalary')) {
  page = page.replace(
    /dayOff: formDayOff,/,
    `dayOff: formDayOff,\n        baseSalary: formBaseSalary,\n        salaryType: formSalaryType,\n        salaryCycle: formSalaryCycle,\n        commissionRate: formCommissionRate,`
  );
}

// 4. Update openEditModal
if (!page.includes('setFormBaseSalary(staff.baseSalary')) {
  page = page.replace(
    /setFormDayOff\(staff\.dayOff \|\| "None"\);/,
    `setFormDayOff(staff.dayOff || "None");\n    setFormBaseSalary(staff.baseSalary || "0");\n    setFormSalaryType(staff.salaryType || "Commission");\n    setFormSalaryCycle(staff.salaryCycle || "Monthly");\n    setFormCommissionRate(staff.commissionRate || "0");`
  );
}

// 5. Inject salary UI to Add Form
const salaryFieldsUI = `
          <h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4 mt-6">Salary & Commission</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type</label>
              <select value={formSalaryType} onChange={(e) => setFormSalaryType(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white">
                <option value="Commission">Commission Only</option>
                <option value="Fixed">Fixed Salary</option>
                <option value="Hybrid">Hybrid (Base + Commission)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary ($)</label>
              <input type="number" value={formBaseSalary} onChange={(e) => setFormBaseSalary(e.target.value)} disabled={formSalaryType === 'Commission'} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
              <input type="number" value={formCommissionRate} onChange={(e) => setFormCommissionRate(e.target.value)} disabled={formSalaryType === 'Fixed'} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Cycle</label>
              <select value={formSalaryCycle} onChange={(e) => setFormSalaryCycle(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white">
                <option value="Weekly">Weekly</option>
                <option value="BiWeekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>
`;

if (!page.includes('Salary & Commission')) {
  page = page.replace(
    /<h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours<\/h4>/,
    salaryFieldsUI + '\n          <h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours</h4>'
  );
  
  // Also for the Edit Modal
  page = page.replace(
    /<h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours<\/h4>/,
    salaryFieldsUI + '\n              <h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours</h4>'
  );
}

fs.writeFileSync('d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', page);
console.log("Staff page updated");
