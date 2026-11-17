"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { db } from "@/lib/db";
import { cancelLoan, submitLoan } from "@/lib/loans";
import { toLoanData, toLoanInput, validateLoan } from "@/lib/loan-validate";
import type { LoanFormState } from "@/lib/loan-validate";
export async function createLoanAction(
  _previous: LoanFormState,
  formData: FormData,
): Promise<LoanFormState> {
  const session = await auth();
  if (!session?.user.email || !can(session.user.role, "loan:create"))
    throw new Error("Không có quyền");
  const values = toLoanInput(formData);
  const errors = validateLoan(values, db.books);
  if (Object.keys(errors).length) return { errors, values };
  const result = submitLoan(session.user.email, toLoanData(values));
  if (!result.ok) return { errors: {}, values, message: result.message };
  revalidatePath("/loans");
  revalidatePath("/admin");
  return {
    errors: {},
    values: {},
    message: "Đã gửi yêu cầu, chờ duyệt",
    ok: true,
  };
}
export async function cancelLoanAction(id: number): Promise<void> {
  const session = await auth();
  if (!session?.user.email || !can(session.user.role, "loan:create"))
    throw new Error("Không có quyền");
  cancelLoan(session.user.email, id);
  revalidatePath("/loans");
  revalidatePath("/admin");
}
