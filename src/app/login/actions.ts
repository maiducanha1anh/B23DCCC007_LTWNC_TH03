'use server';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
export async function loginAction(_previous: string, data: FormData): Promise<string> {
  const callback = String(data.get('callbackUrl') || '/loans');
  const redirectTo = callback.startsWith('/') && !callback.startsWith('//') && !callback.includes('\\') ? callback : '/loans';
  try { await signIn('credentials', { email: data.get('email'), password: data.get('password'), redirectTo }); }
  catch (error) { if (error instanceof AuthError) return 'Email hoặc mật khẩu không đúng'; throw error; }
  return '';
}
