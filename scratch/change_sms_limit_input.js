const fs = require('fs');

let content = fs.readFileSync('src/app/(super-admin)/super-admin/page.tsx', 'utf8');

const targetStr = `<label className="block text-xs font-medium text-gray-400 mb-1">SMS Limit</label>
                                <select name="smsLimit" defaultValue={selectedTenant.smsLimit ?? 100} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs focus:border-blue-500 outline-none">
                                  <option value="100">100 Messages</option>
                                  <option value="500">500 Messages</option>
                                  <option value="1000">1000 Messages</option>
                                  <option value="5000">5000 Messages</option>
                                  <option value="-1">Unlimited</option>
                                </select>`;

const replaceStr = `<label className="block text-xs font-medium text-gray-400 mb-1">SMS Limit</label>
                                <div className="flex items-center gap-1">
                                  <input type="number" name="smsLimit" defaultValue={selectedTenant.smsLimit ?? 100} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs focus:border-blue-500 outline-none" />
                                  <button type="button" onClick={(e) => { const input = e.currentTarget.previousElementSibling as HTMLInputElement; input.value = (parseInt(input.value || "0") + 500).toString(); }} className="px-2 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-green-400 font-bold border border-gray-700 transition-colors shrink-0" title="Add 500 SMS">+500</button>
                                  <button type="button" onClick={(e) => { const input = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement; input.value = (parseInt(input.value || "0") + 2000).toString(); }} className="px-2 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-blue-400 font-bold border border-gray-700 transition-colors shrink-0" title="Add 2000 SMS">+2K</button>
                                </div>
                                <div className="text-[9px] text-gray-500 mt-1">Set to -1 for Unlimited</div>`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/app/(super-admin)/super-admin/page.tsx', content);
console.log("Done");
