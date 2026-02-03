import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('[Release Expired] Iniciando liberação de cotas expiradas...')

    // 1. Buscar transações pending que expiraram
    const { data: expiredTransactions, error: fetchError } = await supabaseClient
      .from('transactions')
      .select('id')
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString())

    if (fetchError) {
      console.error('[Release Expired] Erro ao buscar transações:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch expired transactions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!expiredTransactions || expiredTransactions.length === 0) {
      console.log('[Release Expired] Nenhuma transação expirada encontrada')
      return new Response(
        JSON.stringify({ success: true, message: 'No expired transactions', released: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[Release Expired] Encontradas ${expiredTransactions.length} transações expiradas`)

    const transactionIds = expiredTransactions.map(t => t.id)

    // 2. Buscar cotas associadas às transações expiradas
    const { data: quotaAssociations, error: quotaFetchError } = await supabaseClient
      .from('transaction_quotas')
      .select('quota_id')
      .in('transaction_id', transactionIds)

    if (quotaFetchError) {
      console.error('[Release Expired] Erro ao buscar cotas:', quotaFetchError)
    }

    const quotaIds = quotaAssociations?.map(qa => qa.quota_id) || []

    // 3. Liberar cotas (voltar para available)
    if (quotaIds.length > 0) {
      const { error: quotaUpdateError } = await supabaseClient
        .from('quotas')
        .update({
          status: 'available',
          user_id: null,
          transaction_id: null,
          updated_at: new Date().toISOString(),
        })
        .in('id', quotaIds)

      if (quotaUpdateError) {
        console.error('[Release Expired] Erro ao liberar cotas:', quotaUpdateError)
      } else {
        console.log(`[Release Expired] ${quotaIds.length} cotas liberadas`)
      }
    }

    // 4. Marcar transações como expiradas
    const { error: transactionUpdateError } = await supabaseClient
      .from('transactions')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString(),
      })
      .in('id', transactionIds)

    if (transactionUpdateError) {
      console.error('[Release Expired] Erro ao marcar transações como expiradas:', transactionUpdateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update transactions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[Release Expired] ${transactionIds.length} transações marcadas como expiradas`)
    console.log('[Release Expired] Processo concluído com sucesso!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        released: quotaIds.length,
        expiredTransactions: transactionIds.length 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[Release Expired] Erro geral:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
