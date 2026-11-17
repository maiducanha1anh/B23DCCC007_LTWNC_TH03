import Link from "next/link";
export default function NotFound() {
  return (
    <>
      <h1>Không tìm thấy sách</h1>
      <Link href="/books">Về danh mục sách</Link>
    </>
  );
}
