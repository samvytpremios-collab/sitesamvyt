
# Alterar URL de Redirecionamento do InfinitePay

## Resumo

Vou alterar a URL de redirecionamento após o pagamento no InfinitePay de:
- **Antes:** `https://spectral-scribe-space.lovable.app/pagamento-concluido?order_nsu=...`
- **Depois:** `https://sitesamvyt.vercel.app/login`

## Alteração

### Arquivo: `supabase/functions/create-payment-link/index.ts`

Linha 12 - Atualizar SITE_URL:
```typescript
// Antes
const SITE_URL = 'https://spectral-scribe-space.lovable.app'

// Depois
const SITE_URL = 'https://sitesamvyt.vercel.app'
```

Linha 85 - Atualizar redirect_url:
```typescript
// Antes
redirect_url: `${SITE_URL}/pagamento-concluido?order_nsu=${body.orderId}`,

// Depois
redirect_url: `${SITE_URL}/login`,
```

## Resultado

Após o pagamento ser concluído no InfinitePay, o cliente será redirecionado automaticamente para:
```
https://sitesamvyt.vercel.app/login
```

## Detalhes Técnicos

A Edge Function `create-payment-link` envia o payload para a API do InfinitePay com a `redirect_url` configurada. Quando o cliente finaliza o pagamento (via PIX ou cartão), o InfinitePay redireciona automaticamente para essa URL.
