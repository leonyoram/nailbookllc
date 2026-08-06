export default async function TenantAdminPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params;
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Quản lý Tiệm Nail: {storeSlug}</h1>
      <p className="mt-2 text-gray-500">Chỉ dành cho Tenant Admin và Staff.</p>
    </div>
  );
}
