import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadBook, loadBooksShift } from "@/lib/books";
import BookCover from "@/components/BookCover";
export const revalidate = 60;
export const dynamic = "force-static";
type Props = { params: Promise<{ id: string }> };
export async function generateStaticParams() {
  return (await loadBooksShift())
    .slice(0, 12)
    .map((book) => ({ id: String(book.id) }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await loadBook(Number((await params).id));
  if (!book) notFound();
  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
  };
}
export default async function BookPage({ params }: Props) {
  const book = await loadBook(Number((await params).id));
  if (!book) notFound();
  return (
    <>
      <Link href="/books">← Danh mục sách</Link>
      <article className="book-detail">
        <div className="detail-art">
          <BookCover book={book} />
        </div>
        <div className="detail-content">
          <span className="eyebrow">Chi tiết sách / {book.id}</span>
          <h1>{book.title}</h1>
          <p>Tác giả: {book.author}</p>
          <p>Chuyên mục: {book.category}</p>
          <p>Số bản: {book.copies}</p>
          <p className="muted">
            Cập nhật lúc:{" "}
            {new Date().toLocaleTimeString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            })}
          </p>
          <Link className="button" href={`/loans?book=${book.id}`}>
            Mượn sách này
          </Link>
        </div>
      </article>
    </>
  );
}
