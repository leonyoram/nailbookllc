const fs = require('fs');

let content = fs.readFileSync('src/app/(customer)/[tenantSlug]/admin/settings/page.tsx', 'utf8');

// Add import
if (!content.includes('sendSupportMessage')) {
  content = content.replace(
    'import { getTenantBySlug, updateTenantSettings, topUpSmsLimit } from "@/actions/tenant";',
    'import { getTenantBySlug, updateTenantSettings, topUpSmsLimit } from "@/actions/tenant";\nimport { sendSupportMessage } from "@/actions/support";'
  );
}

// Replace handleBuySms
const oldHandle = `const handleBuySms = async (amount: number, price: number) => {
    if (!tenant) return;
    setIsBuyingSms(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1500));
    
    const res = await topUpSmsLimit(tenant.id, amount);
    if (res.success) {
      toast.success(\`Successfully added \${amount} SMS credits!\`);
      setTenant({...tenant, smsLimit: res.data.newLimit});
      setShowSmsModal(false);
    } else {
      toast.error(res.error);
    }
    setIsBuyingSms(false);
  };`;

const newHandle = `const handleBuySms = async (amount: number, price: number) => {
    if (!tenant) return;
    setIsBuyingSms(true);
    // Send request via Support
    const message = \`[SYSTEM] Request to buy SMS Credits: +\${amount} SMS for $\${price}.00. Please contact us to proceed with payment and activation.\`;
    const res = await sendSupportMessage(tenant.id, "ADMIN", message);
    
    if (res.success) {
      toast.success("Request sent to Support! Our team will contact you shortly.");
      setShowSmsModal(false);
    } else {
      toast.error(res.error || "Failed to send request.");
    }
    setIsBuyingSms(false);
  };`;

content = content.replace(oldHandle, newHandle);

fs.writeFileSync('src/app/(customer)/[tenantSlug]/admin/settings/page.tsx', content);
console.log("Done");
