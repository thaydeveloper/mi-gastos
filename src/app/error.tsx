/**
 * @fileoverview Global error boundary page.
 */

'use client';

import { Button } from '@/components/ui/Button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Erro</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Algo deu errado. Tente novamente.
        </p>
        <Button onClick={reset} className="mt-6">
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
