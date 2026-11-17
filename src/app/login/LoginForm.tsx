"use client";
import { useActionState } from "react";
import { loginAction } from "./actions";
export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, action, pending] = useActionState(loginAction, "");
  return (
    <form action={action} className="panel">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <button disabled={pending}>
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
