const fs = require('fs');

let content = fs.readFileSync('src/app/(customer)/[tenantSlug]/admin/settings/page.tsx', 'utf8');

const modalContent = `
      {/* SMS Top Up Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="text-primary" /> Top-Up SMS Credits
              </h3>
              <button onClick={() => setShowSmsModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 mb-4">Your current SMS limit is {tenant?.smsLimit}. Buy more credits to continue sending automated notifications.</p>
              
              <div className="grid grid-cols-1 gap-3 relative">
                <button 
                  type="button"
                  onClick={() => handleBuySms(500, 10)}
                  disabled={isBuyingSms}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group disabled:opacity-50"
                >
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-primary">Starter Pack</div>
                    <div className="text-xs text-gray-500">+500 SMS</div>
                  </div>
                  <div className="font-bold text-lg text-gray-900">$10.00</div>
                </button>
                
                <button 
                  type="button"
                  onClick={() => handleBuySms(2000, 35)}
                  disabled={isBuyingSms}
                  className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-xl hover:border-blue-500 hover:bg-blue-100 transition-all text-left group relative overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">BEST VALUE</div>
                  <div>
                    <div className="font-bold text-blue-900">Pro Pack</div>
                    <div className="text-xs text-blue-700">+2000 SMS</div>
                  </div>
                  <div className="font-bold text-lg text-blue-900">$35.00</div>
                </button>

                <button 
                  type="button"
                  onClick={() => handleBuySms(5000, 80)}
                  disabled={isBuyingSms}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group disabled:opacity-50"
                >
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-primary">Volume Pack</div>
                    <div className="text-xs text-gray-500">+5000 SMS</div>
                  </div>
                  <div className="font-bold text-lg text-gray-900">$80.00</div>
                </button>

                {isBuyingSms && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    <span className="text-sm font-medium text-gray-700">Processing payment...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(/<\/form>\s*<\/div>\s*\);\s*}\s*$/m, "</form>\n" + modalContent);

fs.writeFileSync('src/app/(customer)/[tenantSlug]/admin/settings/page.tsx', content);
console.log("Done");
