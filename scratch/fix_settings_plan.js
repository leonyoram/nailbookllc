const fs = require('fs');

let content = fs.readFileSync('src/app/(customer)/[tenantSlug]/admin/settings/page.tsx', 'utf8');

const targetStr = '<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">';
const replaceStr = `<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Subscription Details */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl border border-blue-800 shadow-sm overflow-hidden text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <CheckCircle size={100} />
              </div>
              <div className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Current Plan: <span className="bg-blue-500/30 px-3 py-1 rounded-full text-blue-200 border border-blue-400/30 text-sm uppercase tracking-wider">{tenant?.planType || 'Trial'}</span>
                  </h3>
                  <p className="text-blue-200 text-sm mt-2">
                    Staff Limit: <strong className="text-white">{tenant?.staffLimit || 1} members</strong> • 
                    SMS Limit: <strong className="text-white">{tenant?.smsLimit === -1 ? 'Unlimited' : \`\${tenant?.smsLimit || 100} msgs/month\`}</strong>
                  </p>
                </div>
                <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20 backdrop-blur-sm">
                  Upgrade Plan
                </button>
              </div>
            </div>`;

// Only replace the first occurrence (which is in the activeTab === 'general' block)
content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/app/(customer)/[tenantSlug]/admin/settings/page.tsx', content);
console.log("Done");
