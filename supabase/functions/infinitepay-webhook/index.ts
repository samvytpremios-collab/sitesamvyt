import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  invoice_slug: string
  amount: number
  paid_amount: number
  installments: number
  capture_method: 'pix' | 'credit_card'
  transaction_nsu: string
  order_nsu: string
  receipt_url: string
  items: Array<{
    quantity: number
    price: number
    description: string
  }>
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

    // Parse webhook payload
    const payload: WebhookPayload = await req.json()
    
    console.log('Received webhook:', payload)

    const transactionId = payload.order_nsu

    // 1. Buscar transação
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (transactionError || !transaction) {
      console.error('Transaction not found:', transactionId, 'Error:', transactionError)
      return new Response(
        JSON.stringify({ error: 'Transaction not found', details: transactionError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Found transaction:', transaction.id, 'user_id:', transaction.user_id)

    // 2. Atualizar transação como paga
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: 'paid',
        external_payment_id: payload.invoice_slug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update transaction' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Buscar cotas associadas à transação
    const { data: quotaAssociations, error: quotaError } = await supabaseClient
      .from('transaction_quotas')
      .select('quota_id')
      .eq('transaction_id', transactionId)

    if (quotaError || !quotaAssociations) {
      console.error('Error fetching quota associations:', quotaError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch quotas' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const quotaIds = quotaAssociations.map(qa => qa.quota_id)

    // 4. Atualizar cotas como vendidas
    const { error: quotasUpdateError } = await supabaseClient
      .from('quotas')
      .update({
        status: 'sold',
        user_id: transaction.user_id,
        purchase_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .in('id', quotaIds)

    if (quotasUpdateError) {
      console.error('Error updating quotas:', quotasUpdateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update quotas' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully processed payment for transaction ${transactionId}`)

    // Retornar sucesso
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
