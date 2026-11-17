import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { listLoans, parseStatus } from "@/lib/loans";
import { loadBooksShift } from "@/lib/books";
import { formatDate, STATUS_LABEL, TERM_LABEL } from "@/lib/format";
import LoanForm from "@/components/LoanForm";
import { cancelLoanAction, createLoanAction } from "./actions";
export const metadata = { title: "Sách đã mượn", robots: { index: false } };
export default async function LoansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; book?: string }>;
}) {
  const session = await auth();
  if (!session?.user.email) redirect("/login?callbackUrl=%2Floans");
  if (
    !can(session.user.role, "loan:view-own") &&
    !can(session.user.role, "loan:view-all")
  )
    redirect("/forbidden");
  const query = await searchParams;
  const status = parseStatus(query.status);
  const result = listLoans(
    { email: session.user.email, role: session.user.role },
    status,
    Number(query.page ?? 1),
  );
  const href = (page: number) => `/loans?status=${status ?? ""}&page=${page}`;
  return (
    <>
      <span className="eyebrow">Theo dõi yêu cầu</span>
      <h1>Sách đã mượn</h1>
      <form className="filter" method="GET" action="/loans">
        <div>
          <label htmlFor="status">Trạng thái</label>
          <select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">Tất cả</option>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button>Lọc</button>
      </form>
      <p className="muted">{result.total} yêu cầu mượn sách</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Ngày lấy</th>
              <th>Thời hạn</th>
              <th>Số quyển</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((loan) => (
              <tr key={loan.id}>
                <td>
                  <Link href={`/books/${loan.bookId}`}>{loan.bookTitle}</Link>
                </td>
                <td>{formatDate(loan.pickupDate)}</td>
                <td>{TERM_LABEL[loan.term]}</td>
                <td>{loan.quantity} quyển</td>
                <td>
                  <span className={`badge ${loan.status}`}>
                    {STATUS_LABEL[loan.status]}
                  </span>
                </td>
                <td>
                  {can(session.user.role, "loan:create") &&
                    loan.userEmail === session.user.email &&
                    loan.status === "pending" && (
                      <form action={cancelLoanAction.bind(null, loan.id)}>
                        <button>Hủy</button>
                      </form>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!result.total && <p>Chưa có yêu cầu mượn sách.</p>}
      <nav className="pagination" aria-label="Phân trang">
        {result.page > 1 ? (
          <Link href={href(result.page - 1)}>Trước</Link>
        ) : (
          <span>Trước</span>
        )}
        <span>
          Trang {result.page}/{result.totalPages}
        </span>
        {result.page < result.totalPages ? (
          <Link href={href(result.page + 1)}>Sau</Link>
        ) : (
          <span>Sau</span>
        )}
      </nav>
      {can(session.user.role, "loan:create") && (
        <LoanForm
          books={await loadBooksShift()}
          defaultBookId={Number(query.book) || undefined}
          action={createLoanAction}
        />
      )}
    </>
  );
}
