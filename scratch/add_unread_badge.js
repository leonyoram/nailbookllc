const fs = require('fs');

let content = fs.readFileSync('src/app/(super-admin)/super-admin/page.tsx', 'utf8');

// 1. Replace useEffect
const oldUseEffect = `  useEffect(() => {
    if (activeTab === "support") {
      const fetchTickets = async () => {
        const ticketsWithMsgs = await Promise.all(tenants.map(async (t) => {
          const msgs = await getSupportMessages(t.id);
          return { ...t, supportMessages: msgs.data || [] };
        }));
        setSupportTickets(ticketsWithMsgs.filter(t => t.supportMessages.length > 0));
      };
      fetchTickets();
    }
  }, [activeTab, tenants]);`;

const newUseEffect = `  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsWithMsgs = await Promise.all(tenants.map(async (t) => {
        const msgs = await getSupportMessages(t.id);
        return { ...t, supportMessages: msgs.data || [] };
      }));
      setSupportTickets(ticketsWithMsgs.filter(t => t.supportMessages.length > 0));
    };
    if (tenants.length > 0) {
      fetchTickets();
    }
  }, [tenants]);

  const unreadCount = supportTickets.reduce((acc, t) => {
    return acc + t.supportMessages.filter((m: any) => m.sender === "ADMIN" && m.read === false).length;
  }, 0);`;

content = content.replace(oldUseEffect, newUseEffect);

// 2. Replace Support button
const oldBtn = `<button 
            onClick={() => setActiveTab("support")}
            className={\`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 \${activeTab === 'support' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}\`}
          >
            <MessageSquare size={16} /> Support
          </button>`;

const newBtn = `<button 
            onClick={() => setActiveTab("support")}
            className={\`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative \${activeTab === 'support' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}\`}
          >
            <MessageSquare size={16} /> Support
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                {unreadCount}
              </span>
            )}
          </button>`;

content = content.replace(oldBtn, newBtn);

fs.writeFileSync('src/app/(super-admin)/super-admin/page.tsx', content);
console.log("Done");
