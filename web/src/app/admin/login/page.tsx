import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { adminConfigured, isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="admin-login">
      <Logo className="admin-login__mark" />
      <h1>Admin</h1>
      <p>Three Star Towers</p>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="admin-note">
          Sign-in is not set up yet. Add <code>ADMIN_USER</code> and <code>ADMIN_PASSWORD</code> to the project&rsquo;s
          environment variables in Vercel, then redeploy.
        </p>
      )}
    </div>
  );
}
