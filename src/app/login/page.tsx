import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./LoginForm";
export const metadata = { title: "Đăng nhập" };
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  if (await auth()) redirect("/");
  const { callbackUrl = "/loans" } = await searchParams;
  return (
    <div className="login-layout">
      <aside className="login-intro">
        <span className="eyebrow">Thư viện khoa CNTT PTIT</span>
        <h2>
          Chào bạn,
          <br />
          <em>người yêu tri thức.</em>
        </h2>
        <p>
          Cuốn sách tiếp theo đang chờ bạn.
          <br />
          Đăng nhập để bắt đầu hành trình khám phá.
        </p>
        <div className="login-art" aria-hidden="true">
          <span>LEARN</span>
          <span>EXPLORE</span>
          <span>GROW</span>
        </div>
      </aside>
      <div className="login-content">
        <span className="eyebrow">Chào mừng trở lại</span>
        <h1>Đăng nhập</h1>
        <p className="muted">
          Sử dụng tài khoản thư viện để quản lý yêu cầu mượn sách.
        </p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
