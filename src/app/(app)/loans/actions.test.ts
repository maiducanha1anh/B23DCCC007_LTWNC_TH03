import { beforeEach, expect, it, vi } from "vitest";
import { generateLoans } from "@/data/books";
import { db } from "@/lib/db";
import { createLoanAction, cancelLoanAction } from "./actions";
const { authMock, revalidateMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  revalidateMock: vi.fn(),
}));
vi.mock("@/auth", () => ({ auth: authMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidateMock }));
const previous = { errors: {}, values: {} };
function form() {
  const data = new FormData();
  Object.entries({
    bookId: "11",
    pickupDate: "2099-12-03",
    term: "14",
    quantity: "1",
    reason: "Mượn phục vụ môn học",
  }).forEach(([key, value]) => data.set(key, value));
  return data;
}
beforeEach(() => {
  vi.clearAllMocks();
  db.loans.splice(0, db.loans.length, ...generateLoans(37));
  db.nextLoanId = 38;
  authMock.mockResolvedValue({
    user: { email: "sv01@ptit.edu.vn", role: "student" },
  });
});
it("sinh viên gửi hợp lệ tạo yêu cầu và cập nhật trang", async () => {
  expect(await createLoanAction(previous, form())).toEqual({
    errors: {},
    values: {},
    ok: true,
    message: "Đã gửi yêu cầu, chờ duyệt",
  });
  expect(revalidateMock).toHaveBeenCalledWith("/loans");
  expect(db.loans[0].userEmail).toBe("sv01@ptit.edu.vn");
});
it("quản trị viên không được gọi trực tiếp action tạo hoặc hủy", async () => {
  authMock.mockResolvedValue({
    user: { email: "admin@ptit.edu.vn", role: "admin" },
  });
  await expect(createLoanAction(previous, form())).rejects.toThrow(
    "Không có quyền",
  );
  await expect(cancelLoanAction(1)).rejects.toThrow("Không có quyền");
  expect(db.loans).toHaveLength(37);
});
it("khách không được gọi action tạo hoặc hủy", async () => {
  authMock.mockResolvedValue(null);
  await expect(createLoanAction(previous, form())).rejects.toThrow(
    "Không có quyền",
  );
  await expect(cancelLoanAction(1)).rejects.toThrow("Không có quyền");
});
it("dữ liệu lỗi được trả lại nguyên vẹn và không ghi vào kho", async () => {
  const data = form();
  data.set("quantity", "2");
  const result = await createLoanAction(previous, data);
  expect(result.errors.quantity).toBe("Vượt số bản của sách (1 bản)");
  expect(result.values.quantity).toBe("2");
  expect(db.loans).toHaveLength(37);
});
it("hết bản trả thông báo và dữ liệu đã nhập", async () => {
  await createLoanAction(previous, form());
  const result = await createLoanAction(previous, form());
  expect(result.message).toBe("Sách đã hết bản vào ngày này");
  expect(result.values.bookId).toBe("11");
});
it("hủy bỏ qua yêu cầu người khác và xóa yêu cầu pending của mình", async () => {
  await cancelLoanAction(1);
  expect(db.loans).toHaveLength(37);
  await cancelLoanAction(4);
  expect(db.loans).toHaveLength(36);
  expect(revalidateMock).toHaveBeenCalledWith("/loans");
});
