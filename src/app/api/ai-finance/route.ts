import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getFinancialSummary } from '@/lib/ai/finance-analyzer';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { goal, customPrompt } = await req.json();
    console.log('>>> AI ROUTE RECEIVED:', { goal, hasPrompt: !!customPrompt, promptLength: customPrompt?.length });
    
    const financialData = await getFinancialSummary();

    const prompt = `
      Você é um AGENTE ESPECIALISTA EM FINANÇAS E INVESTIMENTOS de alto nível.
      Sua missão é fornecer análises precisas, baseadas em dados e conselhos estratégicos de alocação de capital.

      DADOS FINANCEIROS CONSOLIDADOS (${financialData.periodo}):
      - SALDO ACUMULADO (Meses Anteriores): R$ ${financialData.resumo_atual.saldo_anterior_acumulado}
      - TOTAL RECEBIDO NO MÊS: R$ ${financialData.resumo_atual.receitas_recebidas_no_mes}
      - A RECEBER (Futuros deste mês): R$ ${financialData.resumo_atual.receitas_a_receber}
      - DESPESAS PAGAS NO MÊS: R$ ${financialData.resumo_atual.despesas_realizadas_no_mes}
      - CONTAS A PAGAR (Boletos pendentes): R$ ${financialData.resumo_atual.contas_a_pagar_pendentes}
      - TOTAL DE CONTAS JÁ PAGAS: R$ ${financialData.resumo_atual.contas_ja_pagas_no_mes}
      
      FLUXO DE CAIXA ATUALIZADO:
      - SALDO DO MÊS VIGENTE (Realizado agora): R$ ${financialData.resumo_atual.saldo_do_mes_vigente}
      - PROJEÇÃO DE SALDO FINAL: R$ ${financialData.resumo_atual.projecao_saldo_final}

      ⚠️ ATENÇÃO: Use o "SALDO DO MÊS VIGENTE" (R$ ${financialData.resumo_atual.saldo_do_mes_vigente}) como sua base de capital disponível agora. Refira-se a ele como "Saldo do Mês Vigente".

      GASTOS POR CATEGORIA:
      ${JSON.stringify(financialData.gastos_por_categoria, null, 2)}

      LISTA DE CONTAS VENCENDO ESTE MÊS:
      ${JSON.stringify(financialData.contas_vencendo, null, 2)}

      META DO USUÁRIO: ${goal || 'Otimização de Investimentos'}

      ESTRUTURA DA RESPOSTA (OBRIGATÓRIA):
      ${customPrompt ? `
      1. 🔍 **Sua Pergunta**: Responda com profundidade técnica à pergunta: "${customPrompt}".
      2. 📊 **Diagnóstico Especialista**: Analise o SALDO DO MÊS VIGENTE (R$ ${financialData.resumo_atual.saldo_do_mes_vigente}) vs projeção final. Destaque o impacto das contas a pagar e receitas a receber.
      3. 📈 **Estratégia de Investimentos**: Baseado no SALDO DO MÊS VIGENTE, sugira onde alocar.
      4. 💡 **Ação Prática**: Uma decisão financeira imediata.
      ` : `
      1. 📊 **Diagnóstico Especialista**: Analise a saúde financeira atual usando o SALDO DO MÊS VIGENTE (R$ ${financialData.resumo_atual.saldo_do_mes_vigente}). Mencione especificamente os R$ ${financialData.resumo_atual.receitas_a_receber} que o usuário ainda tem a receber.
      2. 📉 **Gestão de Passivos**: Comente sobre as contas a pagar pendentes (R$ ${financialData.resumo_atual.contas_a_pagar_pendentes}) e como isso afeta o fluxo.
      3. 📈 **Estratégia de Investimentos**: Sugira uma alocação baseada no SALDO DO MÊS VIGENTE.
      4. 💡 **Ação Prática**: Uma decisão financeira imediata.
      `}

      REGRAS DE OURO:
      - Use terminologia de mercado financeiro adequada (SELIC, CDI, Liquidez, Diversificação).
      - Seja analítico, não apenas motivador.
      - Use Markdown com títulos em negrito.
      - Responda em Português do Brasil.
    `.trim();

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log('>>> EXECUTANDO ROTA AI-FINANCE COM GROQ <<<');
    const result = streamText({
      model: groq('llama-3.3-70b-versatile') as any,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI API Error Detail:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return new Response(JSON.stringify({ 
      error: 'Falha ao processar análise financeira',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
