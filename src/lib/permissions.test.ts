import { describe, expect, it } from "vitest";
import { can } from "./permissions";
import type { Action } from "./permissions";
const actions: Action[] = [
  "book:view",
  "loan:create",
  "loan:view-own",
  "loan:view-all",
  "loan:review",
];
describe("Ma trận quyền", () => {
  it("khách chỉ được xem sách", () =>
    expect(actions.map((a) => can(undefined, a))).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]));
  it("sinh viên gửi và xem yêu cầu của mình nhưng không duyệt", () =>
    expect(actions.map((a) => can("student", a))).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]));
  it("quản trị viên xem tất cả và duyệt nhưng không tạo yêu cầu", () =>
    expect(actions.map((a) => can("admin", a))).toEqual([
      true,
      false,
      false,
      true,
      true,
    ]));
});
