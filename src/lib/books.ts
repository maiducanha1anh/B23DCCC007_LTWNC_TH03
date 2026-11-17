import { db } from './db';
export async function loadBooksShift(filters: { category?: string; q?: string } = {}) {
  await new Promise(resolve => setTimeout(resolve, 800));
  return db.books.filter(book => (!filters.category || book.category === filters.category) && (!filters.q || book.title.toLocaleLowerCase('vi').includes(filters.q.toLocaleLowerCase('vi'))));
}
export async function loadBook(id: number) { return db.books.find(book => book.id === id); }
