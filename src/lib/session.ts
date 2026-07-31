import { cookies } from "next/headers";

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "true", { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 // 1 day
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
