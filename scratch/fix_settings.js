const fs = require('fs');

const path = 'd:/Antigravity/src/app/(customer)/[tenantSlug]/admin/settings/page.tsx';
let content = fs.readFileSync(path, 'utf-8');

// The file was broken around line 440.
// Let me just recreate the file from the original content I have saved in previous steps.
// Since I know the exact content of settings/page.tsx, I will just rewrite the whole thing.

// Instead of rewriting the whole thing, let's just restore from git? Git doesn't exist.
// Let me use fetch to get it from github if it's pushed? No.

// I will write a regex to find "Booking Rules Section" and correctly append "Automated CRM Section"
// First I need to restore the broken `activeTab === "social"`

const brokenSocialRegex = /<option value="120">2 hours before<\/option>[\s\S]*?<Share2 size=\{20\}/;

const fixedSocialStr = `<option value="120">2 hours before</option>
                    <option value="1440">1 day before</option>
                  </select>
                  <p className="text-xs text-gray-500 italic">How far in advance customers must book.</p>
                </div>
              </div>
            </div>

            {/* Automated CRM Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-2 text-gray-900 font-bold">
                <MessageSquare size={20} className="text-primary" />
                Automated CRM (Win-back Campaign)
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Tự động gửi SMS tặng mã giảm giá cho khách hàng đã không quay lại tiệm sau 60 ngày.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign size={16} /> Win-back Discount (%)
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={formData.smsTemplates?.winbackDiscount || "5"}
                      onChange={(e) => setFormData({
                        ...formData, 
                        smsTemplates: {
                          ...formData.smsTemplates,
                          winbackDiscount: e.target.value
                        }
                      })}
                      className="w-full max-w-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" 
                    />
                    <p className="text-xs text-gray-500 italic">Mức giảm giá này sẽ được gắn vào nội dung tin nhắn (ví dụ mã WINBACK5).</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : activeTab === "social" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Social Media Links Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-2 text-gray-900 font-bold">
                <Share2 size={20}`;

content = content.replace(brokenSocialRegex, fixedSocialStr);

fs.writeFileSync(path, content, 'utf-8');
console.log("Fixed social block and added CRM section!");
