import { supabase } from '@/integrations/supabase/client';
import { generatePaymentLink } from './infinitepay';

// Configuração
const INFINITEPAY_HANDLE = import.meta.env.VITE_INFINITEPAY_HANDLE || 'samvyt10';

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutData {
  raffleId: string;
  quantity: number;
  customerData: CustomerData;
  selectedNumbers?: string[];
}

export interface CheckoutResult {
  success: boolean;
  transactionId?: string;
  paymentLink?: string;
  error?: string;
}

/**
 * Seleciona cotas aleatórias disponíveis
 */
async function selectRandomQuotas(raffleId: string, quantity: number): Promise<string[]> {
  const { data: availableQuotas, error } = await supabase
    .from('quotas')
    .select('id, number')
    .eq('raffle_id', raffleId)
    .eq('status', 'available')
    .limit(quantity * 3);

  if (error) throw error;
  if (!availableQuotas || availableQuotas.length < quantity) {
    throw new Error('Cotas insuficientes disponíveis');
  }

  // Embaralhar e selecionar quantidade desejada
  const shuffled = availableQuotas
    .sort(() => Math.random() - 0.5)
    .slice(0, quantity);

  return shuffled.map(q => q.id);
}

/**
 * Reserva cotas temporariamente
 */
async function reserveQuotas(quotaIds: string[], transactionId: string): Promise<void> {
  const { error } = await supabase
    .from('quotas')
    .update({
      status: 'reserved',
      transaction_id: transactionId,
      updated_at: new Date().toISOString(),
    })
    .in('id', quotaIds);

  if (error) throw error;
}

/**
 * Cria ou busca usuário
 */
async function getOrCreateUser(customerData: CustomerData): Promise<string> {
  // Verificar se usuário já existe
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', customerData.email)
    .single();

  if (existingUser) {
    return existingUser.id;
  }

  // Criar novo usuário
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
    })
    .select('id')
    .single();

  if (error) throw error;
  return newUser.id;
}

/**
 * Processa checkout e gera link de pagamento
 */
export async function processCheckout(data: CheckoutData): Promise<CheckoutResult> {
  try {
    console.log('[Checkout] Iniciando...', { raffleId: data.raffleId, quantity: data.quantity });
    
    // 1. Buscar configuração da rifa
    const { data: raffle, error: raffleError } = await supabase
      .from('raffle_configs')
      .select('*')
      .eq('id', data.raffleId)
      .single();

    if (raffleError || !raffle) {
      return { success: false, error: 'Rifa não encontrada' };
    }

    // 2. Criar ou buscar usuário
    const userId = await getOrCreateUser(data.customerData);

    // 3. Selecionar cotas aleatórias
    const quotaIds = await selectRandomQuotas(data.raffleId, data.quantity);

    // 4. Calcular valor total
    const totalAmount = raffle.price_per_quota * data.quantity;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // 5. Criar transação
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        raffle_id: data.raffleId,
        amount: totalAmount,
        quantity: data.quantity,
        status: 'pending',
        payment_method: 'pix',
        expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .single();

    if (transactionError || !transaction) {
      console.error('[Checkout] Erro ao criar transação:', transactionError);
      return { success: false, error: 'Erro ao criar transação' };
    }

    // 6. Reservar cotas
    await reserveQuotas(quotaIds, transaction.id);

    // 7. Criar associação transaction_quotas
    const quotaAssociations = quotaIds.map(quotaId => ({
      transaction_id: transaction.id,
      quota_id: quotaId,
    }));

    await supabase.from('transaction_quotas').insert(quotaAssociations);

    // 8. Gerar link de pagamento InfinitePay (redirecionamento direto)
    const description = `${data.quantity}x Cotas - ${raffle.name}`;
    const paymentLink = generatePaymentLink({
      handle: INFINITEPAY_HANDLE,
      amount: totalAmount,
      description,
      orderId: transaction.id,
    });

    // 9. Salvar link na transação
    await supabase
      .from('transactions')
      .update({ external_payment_id: paymentLink })
      .eq('id', transaction.id);

    console.log('[Checkout] Sucesso! Link:', paymentLink);
    
    return {
      success: true,
      transactionId: transaction.id,
      paymentLink,
    };
  } catch (error) {
    console.error('[Checkout] Erro:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao processar checkout',
    };
  }
}
