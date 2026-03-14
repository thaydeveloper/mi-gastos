/**
 * @fileoverview AI Financial Consultant page.
 * Uses plain fetch + ReadableStream to avoid SDK version conflicts.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Sparkles, Send, Home, Car, TrendingUp, ShieldCheck, Loader2, MessageSquare, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const GOALS = [
  { id: 'general', label: 'Gestão Geral', icon: TrendingUp, color: 'text-blue-500', prompt: 'Faça uma análise geral da minha saúde financeira e sugira próximos passos.' },
  { id: 'house', label: 'Comprar Casa', icon: Home, color: 'text-purple-500', prompt: 'Analise minhas finanças com foco no objetivo de comprar uma casa no futuro.' },
  { id: 'car', label: 'Comprar Carro', icon: Car, color: 'text-orange-500', prompt: 'Como posso me organizar para comprar um carro sem comprometer minha estabilidade?' },
  { id: 'emergency', label: 'Reserva de Emergência', icon: ShieldCheck, color: 'text-green-500', prompt: 'Como posso montar uma reserva de emergência sólida com base nos meus gastos atuais?' },
  { id: 'invest', label: 'Onde Investir?', icon: TrendingUp, color: 'text-indigo-500', prompt: 'Baseado no meu saldo e sobras, quais seriam as melhores opções de investimento agora?' },
  { id: 'debt', label: 'Quitar Dívidas', icon: ShieldCheck, color: 'text-red-500', prompt: 'Minhas contas estão pesadas. Como posso priorizar o pagamento de dívidas e economizar?' },
  { id: 'savings', label: 'Aumentar Poupança', icon: TrendingUp, color: 'text-teal-500', prompt: 'Quais categorias de gastos eu posso reduzir para aumentar minha taxa de poupança mensal?' },
  { id: 'travel', label: 'Planejar Viagem', icon: Car, color: 'text-cyan-500', prompt: 'Quero planejar uma viagem. Quanto tempo levaria para economizar R$ 5.000,00 com meu perfil atual?' },
];

export default function AIConsultantPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (overriddenPrompt?: string, overriddenGoal?: string) => {
    const goalToUse = overriddenGoal || selectedGoal;
    const promptToUse = overriddenPrompt || customPrompt;

    const goalLabel = GOALS.find(g => g.id === goalToUse)?.label || 'Gestão Geral';
    const payload = { 
      goal: goalLabel, 
      customPrompt: promptToUse.trim() || undefined 
    };
    console.log('Sending AI Payload:', payload);

    setIsLoading(true);
    setCompletion('');
    setError(null);
    setCustomPrompt(''); // Clear field after send

    try {
      const response = await fetch('/api/ai-finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
  }, [selectedGoal, customPrompt]);

  const onSelectGoal = (goalId: string) => {
    const goal = GOALS.find(g => g.id === goalId);
    if (!goal) return;
    
    setSelectedGoal(goalId);
    handleGenerate(goal.prompt, goalId);
  };

  const filteredGoals = GOALS.filter(g => 
    g.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Removed automatic fetch on mount to save requests
  // Initial fetch on mount
  // useEffect(() => {
  //   handleGenerate();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="text-indigo-600" />
          Agente Especialista em Investimentos
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Análise técnica de ativos e saúde financeira baseada em dados reais.
        </p>
      </div>

      {/* Goal Selection with Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar objetivo ou tipo de conselho..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:border-indigo-500 outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => onSelectGoal(goal.id)}
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
          {filteredGoals.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-400 text-sm italic">
              Nenhum objetivo encontrado para "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="relative">
        <div className="flex items-start gap-2">
          <div className="flex-1 relative">
            <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400" />
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Pergunte algo específico... Ex: 'Como economizar R$ 500 por mês?' ou 'Devo investir em renda fixa ou variável?'"
              rows={2}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:border-indigo-500 focus:outline-none resize-none text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => handleGenerate()}
          disabled={isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isLoading ? 'Analisando finanças...' : 'Gerar Análise Personalizada'}
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
