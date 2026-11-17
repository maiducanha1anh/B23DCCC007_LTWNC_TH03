import { generateBooks, generateLoans } from "../data/books";
import type { Book, Loan } from "../types";
interface Db {
  books: Book[];
  loans: Loan[];
  nextLoanId: number;
}
const g = globalThis as unknown as { __libDb?: Db };
export const db: Db = (g.__libDb ??= {
  books: generateBooks(24),
  loans: generateLoans(37),
  nextLoanId: 38,
});
