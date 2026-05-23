const fs = require('fs');

let content = fs.readFileSync('d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', 'utf8');

const startMarker = '<h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours</h4>';
const startIndex = content.indexOf(startMarker);

const replacement = `          <h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours</h4>
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

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">Cancel</button>
            <button 
              onClick={handleCreateStaff}
              disabled={isSubmitting || !formName}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-md flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              <span>{isSubmitting ? "Saving..." : "Save Member"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
        {filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <User className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No staff members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group relative">
                
                {/* Action Menu */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(staff)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(staff.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{staff.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{staff.role}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                </div>

                {staff.phone && (
                  <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {staff.phone}
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} className="text-gray-400" />
                      <span>Today's Hours</span>
                    </div>
                    <span className="font-medium text-gray-900">{getTodayHours(staff.workHours)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarOff size={16} className="text-gray-400" />
                      <span>Day Off</span>
                    </div>
                    <span className="font-medium text-gray-900">{staff.dayOff || "None"}</span>
                  </div>
                  
                  <button 
                    onClick={() => openEditModal(staff)}
                    className="w-full mt-2 py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium text-sm rounded-lg transition-colors border border-gray-200"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <Edit2 size={20} className="text-primary" /> Edit Staff Profile
              </h3>
              <button onClick={() => setEditingStaff(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
                  <select 
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day Off</label>
                  <select 
                    value={formDayOff}
                    onChange={(e) => setFormDayOff(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                  >
                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

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

              <h4 className="font-semibold text-gray-800 mb-3 border-t border-gray-200 pt-4">Weekly Work Hours</h4>
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

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setEditingStaff(null)} 
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStaff}
                disabled={isSubmitting || !formName}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-md flex items-center gap-2"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
`;

const newContent = content.substring(0, startIndex) + replacement;
fs.writeFileSync('d:/Antigravity/src/app/(customer)/[tenantSlug]/admin/staff/page.tsx', newContent);
console.log('Successfully fully restored the staff page!');
