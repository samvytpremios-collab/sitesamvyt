import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Configuração
const INFINITEPAY_HANDLE = 'samvyt10'
const INFINITEPAY_API_URL = 'https://api.infinitepay.io/invoices/public/checkout/links'
const SUPABASE_PROJECT_URL = 'https://krlltvtdfwnaxrdmknhq.supabase.co'
const SITE_URL = 'https://spectral-scribe-space.lovable.app'

interface PaymentRequest {
  orderId: string
  amount: number // em reais
  quantity: number
  description: string
  customer: {
    name: string
    email: string
    phone: string
  }
}

interface InfinitePayPayload {
  handle: string
  redirect_url: string
  webhook_url: string
  order_nsu: string
  customer: {
    name: string
    email: string
    phone_number: string
  }
  items: Array<{
    quantity: number
    price: number // em centavos
    description: string
  }>
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[create-payment-link] Iniciando...')
    
    // Validar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: PaymentRequest = await req.json()
    console.log('[create-payment-link] Request:', JSON.stringify(body, null, 2))

    // Validar dados obrigatórios
    if (!body.orderId || !body.amount || !body.customer) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: orderId, amount, customer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Formatar telefone (remover caracteres especiais e adicionar +55 se necessário)
    let phone = body.customer.phone.replace(/\D/g, '')
    if (!phone.startsWith('55')) {
      phone = '55' + phone
    }
    phone = '+' + phone

    // Converter valor para centavos
    const priceInCents = Math.round(body.amount * 100)

    // Montar payload para InfinitePay
    const payload: InfinitePayPayload = {
      handle: INFINITEPAY_HANDLE,
      redirect_url: `${SITE_URL}/pagamento-concluido?order_nsu=${body.orderId}`,
      webhook_url: `${SUPABASE_PROJECT_URL}/functions/v1/infinitepay-webhook`,
      order_nsu: body.orderId,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone_number: phone,
      },
      items: [
        {
          quantity: body.quantity,
          price: priceInCents,
          description: body.description,
        },
      ],
    }

    console.log('[create-payment-link] InfinitePay payload:', JSON.stringify(payload, null, 2))

    // Chamar API do InfinitePay
    const response = await fetch(INFINITEPAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    console.log('[create-payment-link] InfinitePay response status:', response.status)
    console.log('[create-payment-link] InfinitePay response:', responseText)

    if (!response.ok) {
      console.error('[create-payment-link] InfinitePay error:', responseText)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create payment link', 
          details: responseText,
          status: response.status 
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse resposta
    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      console.error('[create-payment-link] Failed to parse response:', responseText)
      return new Response(
        JSON.stringify({ error: 'Invalid response from InfinitePay' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[create-payment-link] Success! URL:', data.url)

    // Retornar URL do checkout
    return new Response(
      JSON.stringify({ url: data.url, success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[create-payment-link] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
