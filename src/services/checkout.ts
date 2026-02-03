import { supabase } from '@/integrations/supabase/client';
import { createPaymentLink } from './infinitepay';

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
 * Busca IDs das cotas pelos números selecionados pelo usuário
 */
async function getQuotaIdsByNumbers(raffleId: string, numbers: string[]): Promise<string[]> {
  const { data, error } = await supabase
    .from('quotas')
    .select('id, number')
    .eq('raffle_id', raffleId)
    .eq('status', 'available')
    .in('number', numbers);

  if (error) throw error;
  if (!data || data.length !== numbers.length) {
    throw new Error('Algumas cotas selecionadas não estão mais disponíveis');
  }
  
  return data.map(q => q.id);
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
      console.error('[Checkout] Erro ao buscar rifa:', raffleError);
      return { success: false, error: 'Rifa não encontrada' };
    }
    console.log('[Checkout] Rifa encontrada:', raffle.name);

    // 2. Criar ou buscar usuário
    let userId: string;
    try {
      userId = await getOrCreateUser(data.customerData);
      console.log('[Checkout] Usuário:', userId);
    } catch (userError) {
      console.error('[Checkout] Erro ao criar/buscar usuário:', userError);
      return { success: false, error: 'Erro ao processar dados do cliente' };
    }

    // 3. Usar cotas selecionadas pelo usuário ou selecionar aleatoriamente
    let quotaIds: string[];
    try {
      if (data.selectedNumbers && data.selectedNumbers.length === data.quantity) {
        console.log('[Checkout] Usando números selecionados pelo usuário:', data.selectedNumbers);
        quotaIds = await getQuotaIdsByNumbers(data.raffleId, data.selectedNumbers);
      } else {
        console.log('[Checkout] Selecionando cotas aleatórias...');
        quotaIds = await selectRandomQuotas(data.raffleId, data.quantity);
      }
      console.log('[Checkout] Cotas obtidas:', quotaIds.length);
    } catch (quotaError) {
      console.error('[Checkout] Erro ao obter cotas:', quotaError);
      const errorMessage = quotaError instanceof Error ? quotaError.message : 'Cotas insuficientes disponíveis';
      return { success: false, error: errorMessage };
    }

    // 4. Calcular valor total
    const totalAmount = raffle.price_per_quota * data.quantity;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // 5. Criar transação
    console.log('[Checkout] Criando transação...', { userId, amount: totalAmount, quantity: data.quantity });
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
      console.error('[Checkout] Erro ao criar transação:', {
        code: transactionError?.code,
        message: transactionError?.message,
        details: transactionError?.details,
        hint: transactionError?.hint,
      });
      return { success: false, error: `Erro ao criar transação: ${transactionError?.message || 'Erro desconhecido'}` };
    }
    console.log('[Checkout] Transação criada:', transaction.id);

    // 6. Reservar cotas
    try {
      await reserveQuotas(quotaIds, transaction.id);
      console.log('[Checkout] Cotas reservadas');
    } catch (reserveError) {
      console.error('[Checkout] Erro ao reservar cotas:', reserveError);
      // Continuar mesmo assim, pois a transação foi criada
    }

    // 7. Criar associação transaction_quotas
    const quotaAssociations = quotaIds.map(quotaId => ({
      transaction_id: transaction.id,
      quota_id: quotaId,
    }));

    const { error: assocError } = await supabase.from('transaction_quotas').insert(quotaAssociations);
    if (assocError) {
      console.error('[Checkout] Erro ao criar associações:', assocError);
    }

    // 8. Gerar link de pagamento via Edge Function + InfinitePay API
    const description = `${data.quantity}x Cotas - ${raffle.name}`;
    console.log('[Checkout] Gerando link de pagamento...');
    
    const paymentResult = await createPaymentLink({
      orderId: transaction.id,
      amount: totalAmount,
      quantity: data.quantity,
      description,
      customer: {
        name: data.customerData.name,
        email: data.customerData.email,
        phone: data.customerData.phone,
      },
    });

    if (!paymentResult.success || !paymentResult.url) {
      console.error('[Checkout] Erro ao gerar link:', paymentResult.error);
      return { 
        success: false, 
        error: paymentResult.error || 'Erro ao gerar link de pagamento',
        transactionId: transaction.id,
      };
    }

    console.log('[Checkout] Link gerado:', paymentResult.url);

    // 9. Salvar link na transação
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ external_payment_id: paymentResult.url })
      .eq('id', transaction.id);
    
    if (updateError) {
      console.error('[Checkout] Erro ao salvar link:', updateError);
    }

    console.log('[Checkout] Sucesso!');
    
    return {
      success: true,
      transactionId: transaction.id,
      paymentLink: paymentResult.url,
    };
  } catch (error) {
    console.error('[Checkout] Erro geral:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao processar checkout',
    };
  }
}
