/**
 * @fileoverview AI Financial Consultant page.
 * Uses plain fetch + ReadableStream to avoid SDK version conflicts.
 */

'use client';

import { useState, useCallback } from 'react';
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
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    const goalLabel = GOALS.find(g => g.id === selectedGoal)?.label;

    setIsLoading(true);
    setCompletion('');
    setError(null);

    try {
      const response = await fetch('/api/ai-finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalLabel }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Erro ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Stream não disponível');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setCompletion(fullText);
      }
    } catch (err: any) {
      console.error('Erro na IA:', err);
      setError(err.message || 'Erro desconhecido ao gerar análise.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGoal]);

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
          <div className="p-6 text-gray-800 dark:text-gray-100 min-h-[150px]">
            {error && (
              <div className="text-red-500 p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-lg text-sm mb-4">
                Ocorreu um erro: {error}
              </div>
            )}

            {completion ? (
              <div className="ai-response">
                <ReactMarkdown
                  components={{
                    h3: ({...props}) => <h3 className="text-lg font-bold mt-6 mb-3 text-indigo-600 dark:text-indigo-400" {...props} />,
                    h2: ({...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-indigo-600 dark:text-indigo-400" {...props} />,
                    p: ({...props}) => <p className="leading-relaxed mb-4 text-gray-700 dark:text-gray-300" {...props} />,
                    strong: ({...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                    ul: ({...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                    ol: ({...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                    li: ({...props}) => <li className="text-gray-700 dark:text-gray-300" {...props} />,
                  }}
                >
                  {completion}
                </ReactMarkdown>
              </div>
            ) : isLoading ? (
              <div className="text-gray-400 text-center py-10 italic flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
                <span>O Consultor IA está analisando seus dados...</span>
              </div>
            ) : null}
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
