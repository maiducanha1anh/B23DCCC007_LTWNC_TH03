import { expect, it } from "vitest";
import { formatDate, STATUS_LABEL, TERM_LABEL } from "./format";
it("đổi ngày ISO thành ngày/tháng/năm", () =>
  expect(formatDate("2026-12-02")).toBe("02/12/2026"));
it("hiển thị đủ nhãn thời hạn và trạng thái tiếng Việt", () => {
  expect(Object.values(TERM_LABEL)).toEqual(["7 ngày", "14 ngày", "30 ngày"]);
  expect(Object.values(STATUS_LABEL)).toEqual([
    "Chờ duyệt",
    "Đã duyệt",
    "Từ chối",
  ]);
});
