export default async function TenantBookingPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với tiệm Nail
        </h1>
        <p className="text-xl text-gray-600">
          Slug cửa hàng: <span className="font-semibold text-blue-600">{storeSlug}</span>
        </p>
        <p className="mt-4 text-gray-500">Giao diện đặt lịch hẹn sẽ được hiển thị ở đây.</p>
      </div>
    </div>
  );
}
