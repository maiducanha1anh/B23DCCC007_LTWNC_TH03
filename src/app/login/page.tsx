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
    <>
      <span className="eyebrow">Chào mừng trở lại</span>
      <h1>Đăng nhập</h1>
      <p className="muted">
        Sử dụng tài khoản thư viện để quản lý yêu cầu mượn sách.
      </p>
      <LoginForm callbackUrl={callbackUrl} />
    </>
  );
}
