/**
 * @fileoverview Presentation component for income vs expenses bar chart.
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import type { MonthlyBalance } from '@/types';

/** Props for SpendingOverTimeChart */
interface SpendingOverTimeChartProps {
  data: MonthlyBalance[];
}

/** Renders a grouped bar chart of income vs expenses over the last months */
export function SpendingOverTimeChart({ data }: SpendingOverTimeChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ganhos vs Despesas</CardTitle>
        </CardHeader>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Sem dados para exibir
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ganhos vs Despesas</CardTitle>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#374151' }}
              tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value as number),
                name === 'income' ? 'Ganhos' : 'Despesas',
              ]}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #374151',
                backgroundColor: '#1f2937',
                color: '#f9fafb',
                fontSize: '14px',
              }}
            />
            <Legend
              formatter={(value) => (value === 'income' ? 'Ganhos' : 'Despesas')}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="income" />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
