import { supabase } from '@/integrations/supabase/client';
import { createCheckoutLink, toCents, type InfinitePayItem } from './infinitepay';

// Configuração - deve ser movida para variáveis de ambiente
const INFINITEPAY_HANDLE = import.meta.env.VITE_INFINITEPAY_HANDLE || 'samvyt10';
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

// Log para debug
if (!import.meta.env.VITE_INFINITEPAY_HANDLE) {
  console.warn('VITE_INFINITEPAY_HANDLE não configurada, usando fallback: samvyt10');
}

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
  try {
    // Buscar todas as cotas disponíveis
    const { data: availableQuotas, error } = await supabase
      .from('quotas')
      .select('id, number')
      .eq('raffle_id', raffleId)
      .eq('status', 'available')
      .limit(quantity * 3); // Buscar mais para garantir aleatoriedade

    if (error) throw error;
    if (!availableQuotas || availableQuotas.length < quantity) {
      throw new Error('Cotas insuficientes disponíveis');
    }

    // Embaralhar e selecionar quantidade desejada
    const shuffled = availableQuotas
      .sort(() => Math.random() - 0.5)
      .slice(0, quantity);

    return shuffled.map(q => q.id);
  } catch (error) {
    console.error('Error selecting random quotas:', error);
    throw error;
  }
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
 * Processa checkout completo
 */
export async function processCheckout(data: CheckoutData): Promise<CheckoutResult> {
  try {
    console.log('[Checkout] Iniciando processamento...', { raffleId: data.raffleId, quantity: data.quantity });
    
    // 1. Buscar configuração da rifa
    const { data: raffle, error: raffleError } = await supabase
      .from('raffle_configs')
      .select('*')
      .eq('id', data.raffleId)
      .single();

    if (raffleError || !raffle) {
      console.error('[Checkout] Erro ao buscar rifa:', raffleError);
      return { success: false, error: 'Rifa não encontrada' };
    }

    console.log('[Checkout] Rifa encontrada:', raffle.name);
    
    // 2. Criar ou buscar usuário
    console.log('[Checkout] Criando/buscando usuário...');
    const userId = await getOrCreateUser(data.customerData);
    console.log('[Checkout] Usuário:', userId);

    // 3. Selecionar cotas aleatórias
    console.log('[Checkout] Selecionando cotas aleatórias...');
    const quotaIds = await selectRandomQuotas(data.raffleId, data.quantity);
    console.log('[Checkout] Cotas selecionadas:', quotaIds.length);

    // 4. Criar transação
    const totalAmount = raffle.price_per_quota * data.quantity;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    console.log('[Checkout] Criando transação...', { totalAmount, quantity: data.quantity });
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

    // 5. Reservar cotas
    await reserveQuotas(quotaIds, transaction.id);

    // 6. Criar associação transaction_quotas
    const quotaAssociations = quotaIds.map(quotaId => ({
      transaction_id: transaction.id,
      quota_id: quotaId,
    }));

    await supabase.from('transaction_quotas').insert(quotaAssociations);

    // 7. Criar link de pagamento no InfinitePay
    console.log('[Checkout] Criando link de pagamento InfinitePay...');
    const items: InfinitePayItem[] = [
      {
        quantity: data.quantity,
        price: toCents(raffle.price_per_quota),
        description: `${data.quantity}x Cotas - ${raffle.name}`,
      },
    ];

    console.log('[Checkout] InfinitePay Handle:', INFINITEPAY_HANDLE);
    const checkoutResponse = await createCheckoutLink({
      handle: INFINITEPAY_HANDLE,
      items,
      order_nsu: transaction.id,
      customer: {
        name: data.customerData.name,
        email: data.customerData.email,
        phone_number: data.customerData.phone,
      },
      redirect_url: `${SITE_URL}/minhas-cotas?transaction=${transaction.id}`,
      webhook_url: `${SITE_URL}/api/webhook/infinitepay`,
    });

    console.log('[Checkout] Resposta InfinitePay:', checkoutResponse);
    
    if (!checkoutResponse.success || !checkoutResponse.link) {
      console.error('[Checkout] Erro ao criar link InfinitePay:', checkoutResponse.error);
      return {
        success: false,
        error: checkoutResponse.error || 'Erro ao gerar link de pagamento',
      };
    }

    // 8. Atualizar transação com link de pagamento
    await supabase
      .from('transactions')
      .update({ external_payment_id: checkoutResponse.link })
      .eq('id', transaction.id);

    console.log('[Checkout] Checkout concluído com sucesso!');
    return {
      success: true,
      transactionId: transaction.id,
      paymentLink: checkoutResponse.link,
    };
  } catch (error) {
    console.error('[Checkout] ERRO FATAL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao processar checkout',
    };
  }
}
