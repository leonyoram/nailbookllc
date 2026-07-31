import { getTenantBySlug } from "@/actions/tenant";

export default async function StaffLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const resolvedParams = await params;
  const tenant = await getTenantBySlug(resolvedParams.tenantSlug);

  return (
    <div style={tenant?.themeColor ? { '--color-primary': tenant.themeColor } as React.CSSProperties : undefined}>
      {children}
    </div>
  );
}
