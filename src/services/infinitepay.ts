/**
 * Serviço de integração com InfinitePay
 * Usa Edge Function para chamar a API de checkout
 */

const EDGE_FUNCTION_URL = 'https://krlltvtdfwnaxrdmknhq.supabase.co/functions/v1/create-payment-link';

export interface CreatePaymentLinkParams {
  orderId: string;
  amount: number; // Valor em reais
  quantity: number;
  description: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreatePaymentLinkResult {
  success: boolean;
  url?: string;
  error?: string;
  details?: string;
}

/**
 * Cria um link de pagamento via Edge Function + API InfinitePay
 */
export async function createPaymentLink(params: CreatePaymentLinkParams): Promise<CreatePaymentLinkResult> {
  try {
    console.log('[InfinitePay] Criando link de pagamento...', params);

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    console.log('[InfinitePay] Resposta:', data);

    if (!response.ok || !data.url) {
      return {
        success: false,
        error: data.error || 'Erro ao gerar link de pagamento',
        details: data.details,
      };
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    console.error('[InfinitePay] Erro:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro de conexão',
    };
  }
}

/**
 * Converte valor em reais para centavos
 */
export function toCents(value: number): number {
  return Math.round(value * 100);
}

/**
 * Converte valor em centavos para reais
 */
export function toReais(cents: number): number {
  return cents / 100;
}
