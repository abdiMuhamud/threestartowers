"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="form">
      <label>
        Username
        <input name="user" autoComplete="username" required autoFocus />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn--brown" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
