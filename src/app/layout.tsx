const BUILD_TAG = "rb-6129";
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = { title: { default: 'Thư viện khoa CNTT', template: '%s | Thư viện khoa' } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body data-build={BUILD_TAG}><header><Link href="/">Trang chủ</Link><Link href="/books">Sách</Link></header><main>{children}</main></body></html>;
}
