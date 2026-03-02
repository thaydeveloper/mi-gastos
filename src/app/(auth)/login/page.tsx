/**
 * @fileoverview Login page.
 */

import { LoginFormContainer } from '@/components/auth/containers/LoginFormContainer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Login - Meus Gastos',
};

export default function LoginPage() {
  return <LoginFormContainer />;
}
