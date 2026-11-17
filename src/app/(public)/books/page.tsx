import Link from "next/link";
import { CATEGORIES } from "@/data/books";
import { loadBooksShift } from "@/lib/books";
import BookCover from "@/components/BookCover";
export const metadata = { title: "Danh mục sách" };
export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category = "", q = "" } = await searchParams;
  const books = await loadBooksShift({ category, q });
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">Bộ sưu tập tri thức / 01</span>
        <h1>Danh mục sách</h1>
        <p>Tìm một cuốn sách hay cho hành trình học tập của bạn.</p>
      </div>
      <form className="filter" action="/books" method="GET">
        <div>
          <label htmlFor="q">Tìm sách</label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Nhập tên sách…"
          />
        </div>
        <div>
          <label htmlFor="category">Chuyên mục</label>
          <select id="category" name="category" defaultValue={category}>
            <option value="">Tất cả</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button>Lọc</button>
      </form>
      <div className="results-summary">
        <p>
          Tìm thấy <strong>{books.length}</strong> sách
        </p>
        <p className="muted">
          Render lúc:{" "}
          {new Date().toLocaleTimeString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          })}
        </p>
      </div>
      {books.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Số bản</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td><div className="book-cell">
                    <BookCover book={book} small />
                    <div>
                      <Link href={`/books/${book.id}`}>{book.title}</Link>
                      <span className="book-category">{book.category}</span>
                    </div>
                  </div></td>
                  <td>{book.author}</td>
                  <td>
                    <span className="copy-count">
                      <span className="status-dot" />
                      Số bản: {book.copies}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Không tìm thấy sách nào</p>
      )}
    </>
  );
}
