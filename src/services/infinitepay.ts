/**
 * Serviço de integração com InfinitePay
 * Documentação: https://www.infinitepay.io/checkout
 */

const INFINITEPAY_API_URL = 'https://api.infinitepay.io/invoices/public/checkout';

export interface InfinitePayItem {
  quantity: number;
  price: number; // Valor em centavos
  description: string;
}

export interface InfinitePayCustomer {
  name: string;
  email: string;
  phone_number: string;
}

export interface CreateCheckoutParams {
  handle: string; // InfiniteTag sem o símbolo $
  items: InfinitePayItem[];
  order_nsu: string;
  customer: InfinitePayCustomer;
  redirect_url?: string;
  webhook_url?: string;
}

export interface CheckoutResponse {
  success: boolean;
  link?: string;
  error?: string;
}

export interface PaymentCheckParams {
  handle: string;
  order_nsu: string;
  transaction_nsu: string;
  slug: string;
}

export interface PaymentCheckResponse {
  success: boolean;
  paid: boolean;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: 'pix' | 'credit_card';
}

/**
 * Cria um link de pagamento no InfinitePay
 */
export async function createCheckoutLink(
  params: CreateCheckoutParams
): Promise<CheckoutResponse> {
  try {
    const response = await fetch(`${INFINITEPAY_API_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('InfinitePay API Error:', error);
      return {
        success: false,
        error: `Erro ao criar link de pagamento: ${response.status}`,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      link: data.link || data.checkout_url,
    };
  } catch (error) {
    console.error('Error creating checkout link:', error);
    return {
      success: false,
      error: 'Erro ao conectar com InfinitePay',
    };
  }
}

/**
 * Verifica o status de um pagamento
 */
export async function checkPaymentStatus(
  params: PaymentCheckParams
): Promise<PaymentCheckResponse> {
  try {
    const response = await fetch(`${INFINITEPAY_API_URL}/payment_check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
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
