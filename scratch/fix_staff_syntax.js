const fs = require('fs');

let content = fs.readFileSync('d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', 'utf8');

const startMarker = '<h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours</h4>';
const endMarker = '<div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `${startMarker}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.keys(defaultHours).map(day => (
                  <div key={day} className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{day}</label>
                    <input 
                      type="text" 
                      value={formWorkHours[day] || ""}
                      onChange={(e) => handleWorkHourChange(day, e.target.value)}
                      className="w-full p-1.5 rounded bg-white border border-gray-200 focus:border-primary outline-none text-xs" 
                    />
                  </div>
                ))}
              </div>
            </div>

            `;
  
  const newContent = content.slice(0, startIndex) + replacement + content.slice(endIndex);
  fs.writeFileSync('d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', newContent);
  console.log('Fixed');
} else {
  console.log('Markers not found');
}
