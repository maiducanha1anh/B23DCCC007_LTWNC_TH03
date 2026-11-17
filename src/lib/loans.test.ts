import { beforeEach, expect, it } from "vitest";
import { generateBooks, generateLoans } from "@/data/books";
import { db } from "./db";
import { cancelLoan, listLoans, parseStatus, submitLoan } from "./loans";
const student = { email: "sv01@ptit.edu.vn", role: "student" as const };
const admin = { email: "admin@ptit.edu.vn", role: "admin" as const };
const data = {
  bookId: 11,
  pickupDate: "2026-12-03",
  term: 14 as const,
  quantity: 1,
  reason: "Mượn phục vụ môn học",
};
beforeEach(() => {
  db.books.splice(0, db.books.length, ...generateBooks(24));
  db.loans.splice(0, db.loans.length, ...generateLoans(37));
  db.nextLoanId = 38;
});
it("sv01 có 27 yêu cầu chia ba trang 10/10/7", () => {
  expect(
    [1, 2, 3].map((page) => listLoans(student, undefined, page).items.length),
  ).toEqual([10, 10, 7]);
  expect(listLoans(student, "", 1).total).toBe(27);
  expect(
    listLoans(student, "", 1).items.every(
      (l) => l.userEmail === student.email && l.bookTitle,
    ),
  ).toBe(true);
});
it("sv02 chỉ thấy 10 yêu cầu của mình", () => {
  const result = listLoans({ ...student, email: "sv02@ptit.edu.vn" }, "", 1);
  expect(result.total).toBe(10);
  expect(result.items.every((l) => l.userEmail === "sv02@ptit.edu.vn")).toBe(
    true,
  );
});
it("admin thấy đủ 37 yêu cầu và 13 yêu cầu chờ duyệt", () => {
  expect(listLoans(admin, "", 1).total).toBe(37);
  expect(listLoans(admin, "pending", 1).total).toBe(13);
});
it("kẹp trang ngoài giới hạn và xử lý trang không phải số", () => {
  expect(listLoans(student, "", 999).page).toBe(3);
  expect(listLoans(student, "", -4).page).toBe(1);
  expect(listLoans(student, "", NaN).page).toBe(1);
});
it("lọc chờ duyệt của sv01 có 9 yêu cầu", () =>
  expect(listLoans(student, "pending", 1).total).toBe(9));
it("chỉ chấp nhận ba trạng thái hợp lệ", () => {
  expect(["pending", "approved", "rejected"].map(parseStatus)).toEqual([
    "pending",
    "approved",
    "rejected",
  ]);
  expect(parseStatus("wrong")).toBeUndefined();
  expect(listLoans(student, "wrong", 1).total).toBe(27);
});
it("sách id 6 ngày 02/12 đã hết bản", () =>
  expect(
    submitLoan(student.email, { ...data, bookId: 6, pickupDate: "2026-12-02" }),
  ).toEqual({ ok: false, message: "Sách đã hết bản vào ngày này" }));
it("yêu cầu bị từ chối không chiếm bản; tạo rồi hủy trả đúng mã", () => {
  const result = submitLoan(student.email, data);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error("Không tạo được yêu cầu");
  expect(result.loan.id).toBe(38);
  expect(db.loans[0]).toEqual(result.loan);
  expect(cancelLoan("sv02@ptit.edu.vn", result.loan.id)).toBe("forbidden");
  expect(cancelLoan(student.email, result.loan.id)).toBe("ok");
  expect(cancelLoan(student.email, result.loan.id)).toBe("not-found");
});
it("không hủy yêu cầu đã duyệt", () =>
  expect(cancelLoan(student.email, 2)).toBe("not-pending"));
it("yêu cầu pending giữ bản và hủy giải phóng bản", () => {
  const first = submitLoan(student.email, data);
  expect(submitLoan(student.email, data).ok).toBe(false);
  if (first.ok) cancelLoan(student.email, first.loan.id);
  expect(submitLoan(student.email, data).ok).toBe(true);
});
it("khác ngày lấy có tồn kho độc lập", () =>
  expect(
    submitLoan(student.email, { ...data, bookId: 6, pickupDate: "2026-12-04" })
      .ok,
  ).toBe(true));
