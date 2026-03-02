/**
 * @fileoverview Container component for login form.
 * Handles authentication logic, validation, and state management.
 */

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/schemas/auth';
import { LoginFormView } from '../presentation/LoginFormView';
/** Container that manages login logic and delegates rendering to LoginFormView */
export function LoginFormContainer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : authError.message,
      );
      setLoading(false);
      return;
    }

    window.location.href = '/';
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('OAuth Error:', error);
      setLoading(false);
    }
  };

  return (
    <LoginFormView
      email={email}
      password={password}
      error={error}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoogleLogin={() => handleOAuthLogin('google')}
      onGithubLogin={() => handleOAuthLogin('github')}
    />
  );
}
