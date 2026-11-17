import type { LoanStatus, Role } from "@/types";
import type { LoanData } from "./loan-validate";
import { db } from "./db";
import { can } from "./permissions";
export function parseStatus(value: unknown): LoanStatus | undefined {
  return value === "pending" || value === "approved" || value === "rejected"
    ? value
    : undefined;
}
export function listLoans(
  viewer: { email: string; role: Role },
  status: string | undefined,
  requestedPage: number,
) {
  const filter = parseStatus(status);
  const loans = db.loans.filter(
    (loan) =>
      (can(viewer.role, "loan:view-all") ||
        (can(viewer.role, "loan:view-own") &&
          loan.userEmail === viewer.email)) &&
      (!filter || loan.status === filter),
  );
  const total = loans.length;
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1),
  );
  const items = loans
    .slice((page - 1) * 10, page * 10)
    .map((loan) => ({
      ...loan,
      bookTitle:
        db.books.find((book) => book.id === loan.bookId)?.title ??
        "Không tìm thấy sách",
    }));
  return { items, total, page, totalPages };
}
export function submitLoan(email: string, data: LoanData) {
  const book = db.books.find((b) => b.id === data.bookId);
  const reserved = db.loans
    .filter(
      (loan) =>
        loan.bookId === data.bookId &&
        loan.pickupDate === data.pickupDate &&
        loan.status !== "rejected",
    )
    .reduce((sum, loan) => sum + loan.quantity, 0);
  if (!book || reserved + data.quantity > book.copies)
    return { ok: false as const, message: "Sách đã hết bản vào ngày này" };
  const loan = {
    ...data,
    id: db.nextLoanId++,
    userEmail: email,
    status: "pending" as const,
  };
  db.loans.unshift(loan);
  return { ok: true as const, loan };
}
export function cancelLoan(
  email: string,
  id: number,
): "not-found" | "forbidden" | "not-pending" | "ok" {
  const index = db.loans.findIndex((loan) => loan.id === id);
  if (index < 0) return "not-found";
  if (db.loans[index].userEmail !== email) return "forbidden";
  if (db.loans[index].status !== "pending") return "not-pending";
  db.loans.splice(index, 1);
  return "ok";
}
