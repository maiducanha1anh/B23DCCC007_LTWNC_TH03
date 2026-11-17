export type Role = "student" | "admin";
export type Category =
  "Lập trình" | "Mạng máy tính" | "Cơ sở dữ liệu" | "Toán rời rạc";
export type Term = 7 | 14 | 30;
export type LoanStatus = "pending" | "approved" | "rejected";
export interface Book {
  id: number;
  title: string;
  author: string;
  category: Category;
  copies: number;
}
export interface Loan {
  id: number;
  bookId: number;
  userEmail: string;
  pickupDate: string;
  term: Term;
  quantity: number;
  reason: string;
  status: LoanStatus;
}
