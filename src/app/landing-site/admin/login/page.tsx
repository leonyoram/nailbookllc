"use client";

import { useActionState } from "react";
import { login } from "@/app/landing-site/actions/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h1>
          <p className="text-slate-500">Đăng nhập để quản lý hệ thống Nail Book</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="admin@nailbook.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-rose-500 font-medium">{state.error}</p>
          )}

          <Button type="submit" disabled={isPending} className="w-full h-12 text-base rounded-xl font-bold">
            {isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
}
