/**
 * @fileoverview AI Financial Consultant page.
 */

'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Sparkles, Send, Home, Car, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const GOALS = [
  { id: 'general', label: 'Gestão Geral', icon: TrendingUp, color: 'text-blue-500' },
  { id: 'house', label: 'Comprar Casa', icon: Home, color: 'text-purple-500' },
  { id: 'car', label: 'Comprar Carro', icon: Car, color: 'text-orange-500' },
  { id: 'emergency', label: 'Reserva de Emergência', icon: ShieldCheck, color: 'text-green-500' },
];

export default function AIConsultantPage() {
  const [selectedGoal, setSelectedGoal] = useState('general');
  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/ai/finance',
  });

  const handleGenerate = () => {
    const goalLabel = GOALS.find(g => g.id === selectedGoal)?.label;
    complete('', { body: { goal: goalLabel } });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="text-indigo-600" />
          Consultor AI Financeiro
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Análise inteligente baseada nos seus ganhos e despesas reais.
        </p>
      </div>

      {/* Goal Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal.id)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 text-center",
              selectedGoal === goal.id 
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30" 
                : "border-gray-100 dark:border-gray-800 hover:border-indigo-300"
            )}
          >
            <goal.icon className={cn("w-6 h-6", goal.color)} />
            <span className="text-xs font-medium dark:text-gray-200">{goal.label}</span>
          </button>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isLoading ? 'Analisando finanças...' : 'Gerar Nova Análise'}
        </button>
      </div>

      {/* Result Area */}
      {(completion || isLoading || error) && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Bot size={18} className="text-indigo-500" />
              Conselhos do Consultor
            </span>
            {isLoading && <span className="text-xs text-indigo-500 animate-pulse">Inteligência trabalhando...</span>}
          </div>
          <div className="p-6 prose dark:prose-invert max-w-none prose-indigo">
            {error && (
              <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded-lg text-sm">
                Ocorreu um erro ao gerar a análise. Verifique sua chave de API ou tente novamente.
              </div>
            )}
            {!error && (
              <ReactMarkdown>
                {completion || 'Aguardando seus dados para começar...'}
              </ReactMarkdown>
            )}
            {!completion && !isLoading && !error && (
              <div className="text-gray-400 text-center py-10 italic">
                Clique no botão acima para iniciar a consultoria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
        Aviso: As sugestões da IA são baseadas em padrões gerais e não substituem o aconselhamento financeiro profissional.
      </p>
    </div>
  );
}
