import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { reviewLoan } from './actions';
export const metadata = { title: 'Quản trị', robots: { index: false } };
export default async function AdminPage() {
  const session = await auth();
  if (!session || !can(session.user.role, 'loan:review')) redirect('/forbidden');
  const pending = db.loans.filter(loan => loan.status === 'pending');
  return <><span className="eyebrow">Bàn thủ thư</span><h1>Duyệt yêu cầu mượn</h1><p>Chờ duyệt: {pending.length} | Đã duyệt: {db.loans.filter(l => l.status === 'approved').length} | Từ chối: {db.loans.filter(l => l.status === 'rejected').length}</p><div className="table-wrap"><table><thead><tr><th>Tên sách</th><th>Ngày lấy</th><th>Thời hạn</th><th>Email người mượn</th><th>Thao tác</th></tr></thead><tbody>{pending.map(loan => <tr key={loan.id}><td>{db.books.find(b => b.id === loan.bookId)?.title}</td><td>{formatDate(loan.pickupDate)}</td><td>{TERM_LABEL[loan.term]}</td><td>{loan.userEmail}</td><td><div className="actions"><form action={reviewLoan.bind(null, loan.id, 'approved')}><button>Duyệt</button></form><form action={reviewLoan.bind(null, loan.id, 'rejected')}><button>Từ chối</button></form></div></td></tr>)}</tbody></table></div>{!pending.length && <p>Không có yêu cầu đang chờ duyệt.</p>}</>;
}
