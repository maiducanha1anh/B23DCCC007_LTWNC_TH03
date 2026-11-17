import Link from "next/link";
import { loadBooksShift } from "@/lib/books";
export default async function Home() {
  const books = await loadBooksShift();
  return (
    <section className="hero">
      <span className="eyebrow">Tri thức mở · Kết nối tương lai</span>
      <h1>Thư viện khoa CNTT PTIT</h1>
      <p>
        {books.length} đầu sách ·{" "}
        {new Set(books.map((book) => book.category)).size} chuyên mục
      </p>
      <p>
        Khám phá tài liệu học tập, tìm cuốn sách bạn cần và đăng ký mượn trực
        tuyến.
      </p>
      <Link className="button" href="/books">
        Xem danh mục sách
      </Link>
    </section>
  );
}
