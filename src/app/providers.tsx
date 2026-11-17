"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Đọc lại phiên khi rời trang đăng nhập bằng redirect của Server Action.
  return (
    <SessionProvider key={pathname === "/login" ? "login" : "app"}>
      {children}
    </SessionProvider>
  );
}
