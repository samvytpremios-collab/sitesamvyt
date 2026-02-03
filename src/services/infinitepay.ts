/**
 * Serviço de integração com InfinitePay
 * Usa link de redirecionamento direto para checkout
 * Formato: https://pay.infinitepay.io/@{handle}?amount={amount}&description={description}
 */

export interface InfinitePayCheckoutParams {
  handle: string;
  amount: number; // Valor em reais
  description: string;
  orderId?: string;
}

/**
 * Gera o link de pagamento do InfinitePay
 * O usuário será redirecionado para a página de pagamento
 */
export function generatePaymentLink(params: InfinitePayCheckoutParams): string {
  const { handle, amount, description, orderId } = params;
  
  // Formatar o valor (InfinitePay espera em reais, sem casas decimais extras)
  const formattedAmount = amount.toFixed(2);
  
  // Codificar a descrição para URL
  const encodedDescription = encodeURIComponent(description);
  
  // Construir URL base
  let url = `https://pay.infinitepay.io/@${handle}?amount=${formattedAmount}&description=${encodedDescription}`;
  
  // Adicionar order_id se fornecido (para rastreamento)
  if (orderId) {
    url += `&order_id=${encodeURIComponent(orderId)}`;
  }
  
  return url;
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
