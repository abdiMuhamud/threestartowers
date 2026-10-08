"use server";

import { redirect } from "next/navigation";
import { adminConfigured, checkCredentials, endSession, startSession } from "@/lib/auth";

export async function login(_previous: string | null, form: FormData): Promise<string | null> {
  if (!adminConfigured()) return "Admin sign-in has not been set up yet.";

  const user = String(form.get("user") ?? "");
  const password = String(form.get("password") ?? "");
  if (!checkCredentials(user, password)) {
    // Slows down password guessing a little.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return "Wrong username or password.";
  }

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
