import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateBooks } from "@/data/books";
import { today, toLoanData, toLoanInput, validateLoan } from "./loan-validate";
import type { LoanInput } from "./loan-validate";
const books = generateBooks(24);
const valid: LoanInput = {
  bookId: "1",
  pickupDate: "2026-12-03",
  term: "14",
  quantity: "1",
  reason: "  Mượn phục vụ môn học  ",
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-17T12:00:00Z"));
});
afterEach(() => vi.useRealTimers());
describe("Kiểm tra dữ liệu mượn sách", () => {
  it("dữ liệu hợp lệ trả object rỗng", () =>
    expect(validateLoan(valid, books)).toEqual({}));
  it("form trống báo đủ năm lỗi", () =>
    expect(Object.keys(validateLoan(toLoanInput({}), books))).toEqual([
      "bookId",
      "pickupDate",
      "term",
      "quantity",
      "reason",
    ]));
  it("ngày trong quá khứ bị từ chối", () =>
    expect(
      validateLoan({ ...valid, pickupDate: "2026-11-16" }, books).pickupDate,
    ).toBe("Ngày lấy sách không được ở quá khứ"));
  it.each(["ngắn", "           "])(
    "lý do ngắn hoặc toàn khoảng trắng bị từ chối: %s",
    (reason) =>
      expect(validateLoan({ ...valid, reason }, books).reason).toBe(
        "Lý do tối thiểu 10 ký tự",
      ),
  );
  it("số quyển vượt số bản của sách", () =>
    expect(validateLoan({ ...valid, quantity: "2" }, books).quantity).toBe(
      "Vượt số bản của sách (1 bản)",
    ));
  it.each(["0", "-1", "1.5", "abc", ""])(
    "số quyển không phải số nguyên dương: %s",
    (quantity) =>
      expect(validateLoan({ ...valid, quantity }, books).quantity).toBe(
        "Số quyển phải từ 1 trở lên",
      ),
  );
  it("thời hạn 10 ngày không hợp lệ", () =>
    expect(validateLoan({ ...valid, term: "10" }, books).term).toBe(
      "Hãy chọn thời hạn",
    ));
  it.each(["2026-02-30", "17/11/2026", "2026-13-01"])(
    "ngày không tồn tại hoặc sai định dạng: %s",
    (pickupDate) =>
      expect(validateLoan({ ...valid, pickupDate }, books).pickupDate).toBe(
        "Hãy chọn ngày",
      ),
  );
  it("cho phép lấy sách hôm nay", () =>
    expect(validateLoan({ ...valid, pickupDate: today() }, books)).toEqual({}));
  it("ép kiểu số và cắt khoảng trắng lý do", () =>
    expect(toLoanData(valid)).toEqual({
      bookId: 1,
      pickupDate: "2026-12-03",
      term: 14,
      quantity: 1,
      reason: "Mượn phục vụ môn học",
    }));
  it("đọc FormData và thay trường thiếu bằng chuỗi rỗng", () => {
    const form = new FormData();
    form.set("bookId", "6");
    expect(toLoanInput(form)).toEqual({
      bookId: "6",
      pickupDate: "",
      term: "",
      quantity: "",
      reason: "",
    });
  });
  it("không chấp nhận giá trị object khác chuỗi", () =>
    expect(toLoanInput({ bookId: 1 }).bookId).toBe(""));
  it("ngày hôm nay theo múi giờ Việt Nam", () => {
    vi.setSystemTime(new Date("2026-11-17T18:00:00Z"));
    expect(today()).toBe("2026-11-18");
  });
});
