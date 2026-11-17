import Link from "next/link";
import { loadBooksShift } from "@/lib/books";
import { CATEGORIES } from "@/data/books";
import BookCover from "@/components/BookCover";
export default async function Home() {
  const books = await loadBooksShift();
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <span className="status-dot" />
            Không gian tri thức của bạn
          </span>
          <h1>Thư viện khoa CNTT PTIT</h1>
          <p className="hero-subtitle">
            Mở trang sách.
            <br />
            <em>Mở rộng tương lai.</em>
          </p>
          <p className="hero-count">
            {books.length} đầu sách ·{" "}
            {new Set(books.map((book) => book.category)).size} chuyên mục
          </p>
          <p className="hero-description">
            Khám phá tài liệu học tập, tìm cuốn sách bạn cần và đăng ký mượn
            trực tuyến.
          </p>
          <Link className="button" href="/books">
            Xem danh mục sách <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="hero-shelf" aria-hidden="true">
          <span className="shelf-orbit" />
          <div className="shelf-book shelf-back">
            <BookCover book={books[1]} />
          </div>
          <div className="shelf-book shelf-front">
            <BookCover book={books[5]} />
          </div>
          <span className="shelf-caption">ĐỌC HÔM NAY, KIẾN TẠO NGÀY MAI.</span>
          <span className="shelf-note">
            Dành cho những
            <br />
            bộ óc tò mò.
          </span>
        </div>
      </section>
      <section className="category-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tìm cảm hứng học tập</span>
            <h2>Khám phá theo chuyên mục</h2>
          </div>
          <span className="muted">Từ nền tảng đến chuyên sâu</span>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((category, index) => (
            <Link
              className={`category-card category-${index}`}
              key={category}
              href={`/books?category=${encodeURIComponent(category)}`}
            >
              <span className="category-number">
                0{index + 1} <span aria-hidden="true">↗</span>
              </span>
              <h3>{category}</h3>
              <p>
                {books.filter((book) => book.category === category).length} đầu
                sách
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="library-note">
        <span className="note-mark" aria-hidden="true">
          “
        </span>
        <p>
          Tri thức luôn ở đây.
          <br />
          <strong>Chỉ chờ bạn khám phá.</strong>
        </p>
        <span className="muted">
          Tra cứu tự do · Đăng ký trực tuyến
          <br />
          Nhận sách tại thư viện khoa
        </span>
      </section>
    </>
  );
}
