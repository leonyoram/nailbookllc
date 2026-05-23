import fs from 'fs';
const path = 'd:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx';
let text = fs.readFileSync(path, 'utf8');

const regex = /className=\{`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap \$\{tenant\?.staffLimit && staffList.length >= tenant\.staffLimit \? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'\}`\}(?:\r?\n.*?){5}<\/select>\r?\n.*?<\/div>\r?\n.*?<\/div>/;

const replacement = `className={\`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap \${tenant?.staffLimit && staffList.length >= tenant.staffLimit ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'}\`}
          >
            <Plus size={18} /> Add Staff
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-6 bg-gray-50 border-b border-gray-100 animate-in fade-in slide-in-from-top-4 overflow-y-auto max-h-[60vh]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="John Doe" 
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="(555) 123-4567" 
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
              <select 
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login Password</label>
              <input 
                type="text" 
                value={formLoginPassword}
                onChange={(e) => setFormLoginPassword(e.target.value)}
                placeholder="Password for portal" 
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Off</label>
              <select 
                value={formDayOff}
                onChange={(e) => setFormDayOff(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white"
              >
                {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>`;

if (regex.test(text)) {
  const newText = text.replace(regex, replacement);
  fs.writeFileSync(path, newText);
  console.log("REPLACED SUCCESSFULLY");
} else {
  console.log("NOT REPLACED. REGEX MISMATCH");
}
