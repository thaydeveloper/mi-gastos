/**
 * @fileoverview Compact card for Dashboard to lead users to AI Advisor.
 */

import Link from 'next/link';
import { Bot, Sparkles, ChevronRight } from 'lucide-react';

export function AIAdvisorCard() {
  return (
    <Link href="/ai-consultant" className="block group">
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] hover:shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Bot size={80} />
        </div>
        
        <div className="relative flex flex-col h-full justify-between">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles size={20} className="text-indigo-100" />
            </div>
            <span className="font-bold tracking-wide uppercase text-xs opacity-90">Consultor Inteligente</span>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Como investir este mês?</h3>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-[80%]">
              Analisei suas finanças e tenho dicas exclusivas sobre sua meta e reserva de emergência.
            </p>
          </div>

          <div className="mt-6 flex items-center text-sm font-semibold gap-1 text-white">
            Ver meus conselhos
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
