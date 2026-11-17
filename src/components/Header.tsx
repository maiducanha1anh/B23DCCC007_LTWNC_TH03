"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
export default function Header() {
  const { data: session, status } = useSession();
  return (
    <header>
      <Link className="brand" href="/">
        PTIT / THƯ VIỆN
      </Link>
      <nav aria-label="Điều hướng chính">
        <Link href="/">Trang chủ</Link>
        <Link href="/books">Sách</Link>
        {session ? (
          <>
            <Link href="/loans">Sách đã mượn</Link>
            {session.user.role === "admin" && (
              <Link href="/admin">Quản trị</Link>
            )}
            <span className="muted">
              Xin chào, {session.user.name} ({session.user.role})
            </span>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              Đăng xuất
            </button>
          </>
        ) : (
          status !== "loading" && <Link href="/login">Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
}
