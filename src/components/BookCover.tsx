import type { Book } from "@/types";
import { CATEGORIES } from "@/data/books";

export default function BookCover({
  book,
  small = false,
}: {
  book: Book;
  small?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`book-cover cover-${CATEGORIES.indexOf(book.category)}${small ? " cover-small" : ""}`}
    >
      <span className="cover-imprint">PTIT / KNOWLEDGE SERIES</span>
      <span className="cover-title">{book.title}</span>
      <span className="cover-art">
        <i />
        <i />
        <i />
      </span>
      <span className="cover-author">{book.author}</span>
      <span className="cover-number">{String(book.id).padStart(2, "0")}</span>
    </div>
  );
}
