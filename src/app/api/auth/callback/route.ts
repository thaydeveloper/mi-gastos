/**
 * @fileoverview OAuth callback route handler.
 * Exchanges auth code for session after OAuth provider redirect.
 * Collects session cookies and applies them to the redirect response
 * so the browser carries the auth tokens on the next request.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }> =
      [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookies) {
            cookies.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            cookiesToSet.push(
              ...cookies.map(({ name, value, options }) => ({
                name,
                value,
                options: options as Record<string, unknown>,
              })),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';

      let redirectUrl: string;
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${origin}${next}`;
      }

      const response = NextResponse.redirect(redirectUrl);

      // Apply session cookies to the redirect response so the browser
      // sends them on the next request (middleware will find the session)
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
