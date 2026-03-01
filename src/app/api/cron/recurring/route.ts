/**
 * @fileoverview Cron job route for processing recurring expenses and sending reminders.
 * Triggered daily by Vercel Cron.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * Calculates the next recurring date.
 * @param current - Current date string
 * @param interval - Recurring interval
 * @returns New date string
 */
function advanceDate(current: string, interval: string): string {
  const date = new Date(current);
  switch (interval) {
    case 'daily':
      return format(addDays(date, 1), 'yyyy-MM-dd');
    case 'weekly':
      return format(addWeeks(date, 1), 'yyyy-MM-dd');
    case 'monthly':
      return format(addMonths(date, 1), 'yyyy-MM-dd');
    case 'yearly':
      return format(addYears(date, 1), 'yyyy-MM-dd');
    default:
      return current;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const today = format(new Date(), 'yyyy-MM-dd');

  // Find recurring expenses due today or overdue
  const { data: expenses } = await supabaseAdmin
    .from('expenses')
    .select('id, user_id, description, amount, recurring_interval, recurring_next_date')
    .eq('is_recurring', true)
    .lte('recurring_next_date', today);

  if (!expenses?.length) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;

  for (const expense of expenses) {
    // Send push notification
    try {
      await fetch(new URL('/api/push/send', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({
          userId: expense.user_id,
          title: 'Lembrete de Despesa',
          body: `${expense.description} - R$ ${expense.amount.toFixed(2)} vence hoje`,
          url: '/expenses',
        }),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    // Advance the recurring date
    if (expense.recurring_interval && expense.recurring_next_date) {
      const nextDate = advanceDate(expense.recurring_next_date, expense.recurring_interval);
      await supabaseAdmin
        .from('expenses')
        .update({ recurring_next_date: nextDate })
        .eq('id', expense.id);
    }

    processed++;
  }

  return NextResponse.json({ processed });
}
