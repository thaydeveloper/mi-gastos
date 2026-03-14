import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getFinancialSummary } from '@/lib/ai/finance-analyzer';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();
    const financialData = await getFinancialSummary();

    const prompt = `
      Você é um consultor financeiro pessoal experiente e amigável para o app "Meus Gastos".
      Analise os seguintes dados financeiros do usuário e forneça dicas práticas.

      DADOS FINANCEIROS (${financialData.periodo}):
      - Receita este mês: R$ ${financialData.resumo_atual.total_receitas}
      - Despesas este mês: R$ ${financialData.resumo_atual.total_despesas}
      - Saldo atual: R$ ${financialData.resumo_atual.saldo}
      
      COMPARAÇÃO:
      - Receita mês passado: R$ ${financialData.resumo_mes_anterior.total_receitas}
      - Despesas mês passado: R$ ${financialData.resumo_mes_anterior.total_despesas}

      GASTOS POR CATEGORIA:
      ${JSON.stringify(financialData.gastos_por_categoria, null, 2)}

      META DO USUÁRIO: ${goal || 'Gestão geral e saúde financeira'}

      INSTRUÇÕES:
      1. Seja direto e motive o usuário.
      2. Divida sua resposta em 3 seções curtas:
         - 🏦 **Análise Geral**: Como está o saldo e a comparação com o mês passado.
         - 🎯 **Dica para sua Meta**: Conselhos específicos para "${goal || 'Gestão geral'}". Se envolver compra de casa/carro, mencione reserva de emergência e financiamento vs economia.
         - 💡 **Ação Prática**: Uma única ação que o usuário pode tomar hoje.
      3. Use Markdown para formatar.
      4. Responda em Português do Brasil.
    `.trim();

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log('>>> EXECUTANDO ROTA AI-FINANCE COM GROQ <<<');
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
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
