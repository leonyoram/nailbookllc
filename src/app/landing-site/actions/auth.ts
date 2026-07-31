"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@nailbook.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "nailbookadmin";

  if (email === adminEmail && password === adminPassword) {
    await createSession();
    redirect("/admin/messages");
  } else {
    return { error: "Sai email hoặc mật khẩu!" };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
