import type { Role } from '@/types';
export type Action = 'book:view' | 'loan:create' | 'loan:view-own' | 'loan:view-all' | 'loan:review';
export function can(role: Role | undefined, action: Action): boolean {
  if (action === 'book:view') return true;
  if (role === 'student') return action === 'loan:create' || action === 'loan:view-own';
  if (role === 'admin') return action === 'loan:view-all' || action === 'loan:review';
  return false;
}
