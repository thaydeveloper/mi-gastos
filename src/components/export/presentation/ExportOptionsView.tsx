/**
 * @fileoverview Presentation component for export options.
 */

'use client';

import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, FileSpreadsheet } from 'lucide-react';

/** Props for ExportOptionsView */
interface ExportOptionsViewProps {
  dateFrom: string;
  dateTo: string;
  loading: boolean;
  expenseCount: number;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

/** Renders export configuration and action buttons */
export function ExportOptionsView({
  dateFrom,
  dateTo,
  loading,
  expenseCount,
  onDateFromChange,
  onDateToChange,
  onExportPDF,
  onExportCSV,
}: ExportOptionsViewProps) {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Exportar Relatório</CardTitle>
      </CardHeader>

      <div className="space-y-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecione o período e o formato para exportar seus dados de despesas.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <DatePicker
            id="export-from"
            label="Data Início"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
          <DatePicker
            id="export-to"
            label="Data Fim"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {expenseCount > 0
            ? `${expenseCount} despesa(s) encontrada(s) no período selecionado.`
            : 'Selecione um período para ver as despesas disponíveis.'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={onExportPDF}
            disabled={loading || expenseCount === 0}
            className="flex-1"
          >
            <FileText size={16} />
            {loading ? 'Gerando...' : 'Exportar PDF'}
          </Button>
          <Button
            onClick={onExportCSV}
            disabled={loading || expenseCount === 0}
            variant="secondary"
            className="flex-1"
          >
            <FileSpreadsheet size={16} />
            {loading ? 'Gerando...' : 'Exportar CSV'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
