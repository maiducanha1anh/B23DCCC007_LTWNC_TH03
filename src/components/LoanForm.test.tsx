import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { generateBooks } from "@/data/books";
import type { LoanFormState } from "@/lib/loan-validate";
import LoanForm from "./LoanForm";
const books = generateBooks(24);
const empty: LoanFormState = { errors: {}, values: {} };
it("lỗi hiện bên dưới đúng ô và liên kết bằng aria-describedby", async () => {
  const user = userEvent.setup();
  const action = vi
    .fn()
    .mockResolvedValue({
      ...empty,
      errors: {
        bookId: "Hãy chọn sách",
        pickupDate: "Hãy chọn ngày",
        term: "Hãy chọn thời hạn",
        quantity: "Số quyển phải từ 1 trở lên",
        reason: "Lý do tối thiểu 10 ký tự",
      },
    });
  render(<LoanForm books={books} action={action} />);
  await user.click(screen.getByRole("button", { name: "Gửi yêu cầu" }));
  expect(await screen.findAllByRole("alert")).toHaveLength(5);
  expect(screen.getByLabelText("Sách")).toHaveAccessibleDescription(
    "Hãy chọn sách",
  );
  expect(screen.getByLabelText("Lý do mượn")).toHaveAccessibleDescription(
    "Lý do tối thiểu 10 ký tự",
  );
});
it("điền hợp lệ gọi action một lần với đúng FormData và xóa form khi thành công", async () => {
  const user = userEvent.setup();
  const action = vi
    .fn()
    .mockResolvedValue({
      ...empty,
      ok: true,
      message: "Đã gửi yêu cầu, chờ duyệt",
    });
  render(<LoanForm books={books} action={action} />);
  await user.selectOptions(screen.getByLabelText("Sách"), "3");
  await user.type(screen.getByLabelText("Ngày lấy sách"), "2026-12-03");
  await user.selectOptions(screen.getByLabelText("Thời hạn mượn"), "14");
  await user.clear(screen.getByLabelText("Số quyển"));
  await user.type(screen.getByLabelText("Số quyển"), "2");
  await user.type(screen.getByLabelText("Lý do mượn"), "Mượn phục vụ môn học");
  await user.click(screen.getByRole("button", { name: "Gửi yêu cầu" }));
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Đã gửi yêu cầu, chờ duyệt",
  );
  expect(action).toHaveBeenCalledTimes(1);
  const form = action.mock.calls[0][1] as FormData;
  expect([form.get("bookId"), form.get("term"), form.get("quantity")]).toEqual([
    "3",
    "14",
    "2",
  ]);
  expect(screen.getByLabelText("Lý do mượn")).toHaveValue("");
  expect(screen.getByLabelText("Sách")).toHaveValue("");
});
it("hết bản hiển thị thông báo và giữ nguyên dữ liệu đã nhập", async () => {
  const user = userEvent.setup();
  const values = {
    bookId: "6",
    pickupDate: "2026-12-02",
    term: "14",
    quantity: "1",
    reason: "Mượn phục vụ môn học",
  };
  const action = vi
    .fn()
    .mockResolvedValue({
      errors: {},
      values,
      message: "Sách đã hết bản vào ngày này",
    });
  render(<LoanForm books={books} action={action} />);
  await user.type(screen.getByLabelText("Lý do mượn"), values.reason);
  await user.click(screen.getByRole("button", { name: "Gửi yêu cầu" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Sách đã hết bản vào ngày này",
  );
  expect(screen.getByLabelText("Lý do mượn")).toHaveValue(values.reason);
  expect(screen.getByLabelText("Sách")).toHaveValue("6");
  expect(screen.getByLabelText("Thời hạn mượn")).toHaveValue("14");
});
it("defaultBookId chọn sẵn sách", () => {
  render(
    <LoanForm
      books={books}
      defaultBookId={6}
      action={vi.fn().mockResolvedValue(empty)}
    />,
  );
  expect(screen.getByLabelText("Sách")).toHaveValue("6");
});
it("khóa nút gửi khi action đang chạy", async () => {
  const user = userEvent.setup();
  let finish!: (value: LoanFormState) => void;
  const action = vi.fn(
    () =>
      new Promise<LoanFormState>((resolve) => {
        finish = resolve;
      }),
  );
  render(<LoanForm books={books} action={action} />);
  await user.click(screen.getByRole("button", { name: "Gửi yêu cầu" }));
  expect(screen.getByRole("button", { name: "Đang gửi…" })).toBeDisabled();
  finish(empty);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Gửi yêu cầu" })).toBeEnabled(),
  );
});
