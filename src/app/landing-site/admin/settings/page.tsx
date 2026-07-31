import { prisma } from "@/lib/prisma";
import { updateSystemSettings } from "@/app/landing-site/actions/settings";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const settings = await prisma.systemSettings.findUnique({ where: { id: "global" } });
  
  const phoneSetting = settings?.contactPhone || "+18325988899";
  const emailSetting = settings?.contactEmail || "hello@nailbook.com";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Cài đặt Hệ thống</h1>
        <p className="text-slate-500">Cập nhật thông tin liên hệ và các cấu hình chung của website.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Thông Tin Liên Hệ</h2>
        <form action={updateSystemSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại Hotline</label>
              <input 
                type="text" 
                name="phone"
                defaultValue={phoneSetting}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+1 (832) 598-8899"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Liên Hệ</label>
              <input 
                type="email" 
                name="email"
                defaultValue={emailSetting}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="hello@nailbook.com"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
             <Button type="submit" className="h-12 px-8 text-base rounded-xl font-bold">
               Lưu Thay Đổi
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
