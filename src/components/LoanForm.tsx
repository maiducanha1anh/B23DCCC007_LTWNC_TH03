'use client';
import { useActionState } from 'react';
import type { Book } from '@/types';
import type { LoanFormState, LoanInput } from '@/lib/loan-validate';
import { TERM_LABEL } from '@/lib/format';
import { TERMS } from '@/data/books';
interface Props { books: Book[]; defaultBookId?: number; action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState> }
export default function LoanForm({ books, defaultBookId, action }: Props) {
  const [state, formAction, pending] = useActionState(action, { errors: {}, values: { bookId: defaultBookId ? String(defaultBookId) : '', quantity: '1' } });
  const error = (field: keyof LoanInput) => state.errors[field] ? <p id={`${field}-error`} role="alert">{state.errors[field]}</p> : null;
  const accessibility = (field: keyof LoanInput) => ({ 'aria-invalid': !!state.errors[field], 'aria-describedby': state.errors[field] ? `${field}-error` : undefined });
  return <form key={JSON.stringify(state)} action={formAction} noValidate className="panel" aria-label="Đăng ký mượn sách"><h2>Đăng ký mượn sách</h2><div className="field"><label htmlFor="bookId">Sách</label><select id="bookId" name="bookId" defaultValue={state.values.bookId ?? ''} {...accessibility('bookId')}><option value="">-- Chọn sách --</option>{books.map(book => <option key={book.id} value={book.id}>{book.title} ({book.copies} bản)</option>)}</select>{error('bookId')}</div><div className="grid"><div className="field"><label htmlFor="pickupDate">Ngày lấy sách</label><input id="pickupDate" name="pickupDate" type="date" defaultValue={state.values.pickupDate ?? ''} {...accessibility('pickupDate')} />{error('pickupDate')}</div><div className="field"><label htmlFor="term">Thời hạn mượn</label><select id="term" name="term" defaultValue={state.values.term ?? ''} {...accessibility('term')}><option value="">-- Chọn thời hạn --</option>{TERMS.map(term => <option value={term} key={term}>{TERM_LABEL[term]}</option>)}</select>{error('term')}</div></div><div className="field"><label htmlFor="quantity">Số quyển</label><input id="quantity" name="quantity" type="number" defaultValue={state.values.quantity ?? '1'} {...accessibility('quantity')} />{error('quantity')}</div><div className="field"><label htmlFor="reason">Lý do mượn</label><textarea id="reason" name="reason" defaultValue={state.values.reason ?? ''} {...accessibility('reason')} />{error('reason')}</div><button disabled={pending}>{pending ? 'Đang gửi…' : 'Gửi yêu cầu'}</button>{state.message && <p role={state.ok ? 'status' : 'alert'} className={state.ok ? 'success' : 'error'}>{state.message}</p>}</form>;
}
