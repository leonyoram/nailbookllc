const fs = require('fs');

let content = fs.readFileSync('src/actions/tenant.ts', 'utf8');

const newAction = `
export async function topUpSmsLimit(tenantId: string, amount: number) {
  try {
    const current = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { smsLimit: true, slug: true }
    });

    if (!current) return { success: false, error: "Tenant not found" };

    let currentLimit = current.smsLimit || 0;
    if (currentLimit === -1) {
      return { success: false, error: "Your plan already has Unlimited SMS." };
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        smsLimit: currentLimit + amount
      }
    });

    revalidatePath(\`/\${current.slug}/admin/settings\`);
    return { success: true, data: { newLimit: updated.smsLimit } };
  } catch (error: any) {
    console.error("Failed to top-up SMS limit:", error);
    return { success: false, error: "System error while adding SMS credits" };
  }
}
`;

fs.appendFileSync('src/actions/tenant.ts', newAction);
console.log("Done");
