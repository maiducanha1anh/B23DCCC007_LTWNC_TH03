"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const active = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path + "/"))
      ? ("page" as const)
      : undefined;
  return (
    <header>
      <Link className="brand" href="/">
        <span className="brand-symbol" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v14c-4-1-7 0-9 2-2-2-5-3-9-2Z" />
          </svg>
        </span>
        <span>
          Thư viện<span className="brand-subtitle">KHOA CNTT · PTIT</span>
        </span>
      </Link>
      <nav aria-label="Điều hướng chính">
        <Link href="/" aria-current={active("/")}>
          Trang chủ
        </Link>
        <Link href="/books" aria-current={active("/books")}>
          Sách
        </Link>
        {session ? (
          <>
            <Link href="/loans" aria-current={active("/loans")}>
              Sách đã mượn
            </Link>
            {session.user.role === "admin" && (
              <Link href="/admin" aria-current={active("/admin")}>
                Quản trị
              </Link>
            )}
            <span className="session-name muted">
              Xin chào, {session.user.name} ({session.user.role})
            </span>
            <button
              className="button-quiet"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          status !== "loading" && (
            <Link className="nav-login" href="/login">
              Đăng nhập <span aria-hidden="true">↗</span>
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
