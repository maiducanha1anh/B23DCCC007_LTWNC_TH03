"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { db } from "@/lib/db";
export async function reviewLoan(
  id: number,
  status: "approved" | "rejected",
): Promise<void> {
  const session = await auth();
  if (!session || !can(session.user.role, "loan:review"))
    throw new Error("Không có quyền");
  if (status !== "approved" && status !== "rejected") return;
  const loan = db.loans.find((item) => item.id === id);
  if (loan?.status === "pending") loan.status = status;
  revalidatePath("/admin");
  revalidatePath("/loans");
}
