/**
 * @fileoverview PDF export utility using jsPDF.
 */

import { jsPDF } from 'jspdf';
import type { ExpenseWithCategory } from '@/types';
import { formatCurrency, formatDate } from './format';

/**
 * Generates a PDF document with expense data.
 * @param expenses - Array of expenses to include
 * @param title - Report title
 * @returns jsPDF document instance
 */
export function generateExpensePDF(expenses: ExpenseWithCategory[], title: string): jsPDF {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 22);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Gerado em ${formatDate(new Date())} - ${expenses.length} despesa(s)`, 14, 30);

  // Total
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total: ${formatCurrency(total)}`, 14, 40);

  // Table header
  let y = 52;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(243, 244, 246);
  doc.rect(14, y - 5, 182, 8, 'F');
  doc.text('Data', 16, y);
  doc.text('Descrição', 46, y);
  doc.text('Categoria', 116, y);
  doc.text('Valor', 166, y);
  y += 8;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  for (const expense of expenses) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }

    doc.text(formatDate(expense.date), 16, y);
    doc.text(expense.description.substring(0, 35), 46, y);
    doc.text(expense.categories?.name ?? '-', 116, y);
    doc.text(formatCurrency(expense.amount), 166, y);
    y += 7;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Meus Gastos - Página ${i} de ${pageCount}`, 14, 290);
  }

  return doc;
}

/**
 * Downloads the PDF file.
 * @param expenses - Expenses to export
 * @param title - Report title
 */
export function downloadExpensePDF(expenses: ExpenseWithCategory[], title = 'Relatório de Gastos') {
  const doc = generateExpensePDF(expenses, title);
  doc.save(`meus-gastos-${new Date().toISOString().split('T')[0]}.pdf`);
}
