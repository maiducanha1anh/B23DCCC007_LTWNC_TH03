const BUILD_TAG = "rb-6129";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Providers from "./providers";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Thư viện khoa CNTT", template: "%s | Thư viện khoa" },
  description: "Tra cứu và đăng ký mượn sách tại thư viện khoa CNTT PTIT.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body data-build={BUILD_TAG}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
        <footer>
          <div>
            <strong>
              PTIT<span> / </span>Thư viện khoa CNTT
            </strong>
            <p>Một cuốn sách. Một góc nhìn mới.</p>
          </div>
          <p>
            Học viện Công nghệ Bưu chính Viễn thông
            <br />
            Không gian tri thức dành cho sinh viên.
          </p>
        </footer>
      </body>
    </html>
  );
}
