/**
 * @fileoverview Container for the export page.
 * Manages date selection, data fetching, and export generation.
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { downloadExpensePDF } from '@/lib/utils/export-pdf';
import { downloadExpenseCSV } from '@/lib/utils/export-csv';
import { ExportOptionsView } from '../presentation/ExportOptionsView';
import type { ExpenseWithCategory } from '@/types';
import { startOfMonth, format } from 'date-fns';

/** Container managing export logic and data fetching */
export function ExportPageContainer() {
  const [dateFrom, setDateFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchExpenses() {
      if (!dateFrom || !dateTo) {
        setExpenses([]);
        return;
      }

      const { data } = await supabase
        .from('expenses')
        .select('*, categories(name, color, icon)')
        .gte('date', dateFrom)
        .lte('date', dateTo)
        .order('date', { ascending: false });

      setExpenses(data ?? []);
    }

    fetchExpenses();
  }, [dateFrom, dateTo, supabase]);

  const handleExportPDF = () => {
    setLoading(true);
    try {
      downloadExpensePDF(expenses, `Relatório de Gastos (${dateFrom} a ${dateTo})`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    setLoading(true);
    try {
      downloadExpenseCSV(expenses);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exportar</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Exporte seus dados em PDF ou CSV
        </p>
      </div>

      <ExportOptionsView
        dateFrom={dateFrom}
        dateTo={dateTo}
        loading={loading}
        expenseCount={expenses.length}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />
    </div>
  );
}
