import Link from "next/link";
import { CATEGORIES } from "@/data/books";
import { loadBooksShift } from "@/lib/books";
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
      <span className="eyebrow">Khám phá thư viện</span>
      <h1>Danh mục sách</h1>
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
      <p>Tìm thấy {books.length} sách</p>
      <p className="muted">
        Render lúc:{" "}
        {new Date().toLocaleTimeString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        })}
      </p>
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
                  <td>
                    <Link href={`/books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                  <td>Số bản: {book.copies}</td>
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
