
# Correção do Checkout InfinitePay

## Diagnóstico do Problema

O erro "não encontramos o seu link de pagamento" ocorre porque o formato de URL atual está incorreto:

**Formato Atual (Errado):**
```
https://pay.infinitepay.io/@samvyt10?amount=10.00&description=...
```

**Formato Correto:**
O InfinitePay requer uma chamada **POST** à API para gerar um link válido:
```
POST https://api.infinitepay.io/invoices/public/checkout/links
```

A resposta retorna:
```json
{
  "url": "https://checkout.infinitepay.com.br/samvyt10?lenc=codigo_unico"
}
```

---

## Solução Proposta

### Arquitetura

```text
+----------------+       +----------------------+       +------------------+
|    Frontend    | ----> | Edge Function        | ----> | InfinitePay API  |
| CheckoutModal  |       | create-payment-link  |       | /checkout/links  |
+----------------+       +----------------------+       +------------------+
        |                         |                              |
        |   1. Dados do pedido    |    2. POST com items        |
        | ----------------------> | ---------------------------> |
        |                         |                              |
        |   4. Retorna link       |    3. Retorna URL válida    |
        | <---------------------- | <--------------------------- |
        |                         |                              |
        |   5. Redireciona para   |                              |
        |      checkout.infinitepay.com.br                      |
        +--------------------------------------------------------+
```

### Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/create-payment-link/index.ts` | **Criar** - Edge function que chama a API InfinitePay |
| `src/services/infinitepay.ts` | **Modificar** - Chamar edge function ao invés de gerar URL local |
| `src/services/checkout.ts` | **Modificar** - Ajustar integração |

---

## Detalhes Técnicos

### 1. Nova Edge Function: `create-payment-link`

Esta função será responsável por chamar a API do InfinitePay:

**Endpoint:** `POST /invoices/public/checkout/links`

**Payload:**
```json
{
  "handle": "samvyt10",
  "redirect_url": "https://samvyt-premios.lovable.app/pagamento-concluido",
  "webhook_url": "https://krlltvtdfwnaxrdmknhq.supabase.co/functions/v1/infinitepay-webhook",
  "order_nsu": "uuid-da-transacao",
  "customer": {
    "name": "Nome Cliente",
    "email": "email@cliente.com",
    "phone_number": "+5511999887766"
  },
  "items": [
    {
      "quantity": 10,
      "price": 100,
      "description": "10x Cotas - Rifa iPhone 17"
    }
  ]
}
```

**Resposta esperada:**
```json
{
  "url": "https://checkout.infinitepay.com.br/samvyt10?lenc=abc123"
}
```

### 2. Atualizar `infinitepay.ts`

Substituir a função `generatePaymentLink` para chamar a edge function:

```typescript
export async function createPaymentLink(params: {
  orderId: string;
  amount: number;
  quantity: number;
  description: string;
  customer: { name: string; email: string; phone: string };
}): Promise<{ url: string }> {
  const response = await fetch(
    'https://krlltvtdfwnaxrdmknhq.supabase.co/functions/v1/create-payment-link',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }
  );
  return response.json();
}
```

### 3. Atualizar `checkout.ts`

Substituir a chamada de `generatePaymentLink` por `createPaymentLink`.

---

## Fluxo Completo Após Correção

1. **Cliente seleciona cotas** no site
2. **Preenche dados** (nome, email, telefone)
3. **Sistema cria transação** no Supabase
4. **Reserva cotas** temporariamente (status: `reserved`)
5. **Edge function chama API InfinitePay** e recebe URL válida
6. **Cliente é redirecionado** para `checkout.infinitepay.com.br`
7. **Cliente paga via PIX ou Cartão**
8. **InfinitePay envia webhook** para a edge function
9. **Webhook atualiza transação** para `paid`
10. **Webhook atualiza cotas** para `sold` e associa ao `user_id`
11. **Cotas aparecem no painel** do usuário

---

## Sobre a Questão do Usuário

Sim, é totalmente possível:

- **Gerar link para N cotas** de R$1,00 cada
- **Criar usuário no banco** com as informações após pagamento
- **Associar cotas ao usuário** após confirmação
- **Bloquear cotas vendidas** para não serem vendidas novamente

O webhook já implementado (`infinitepay-webhook`) faz exatamente isso quando recebe a notificação de pagamento.

---

## Benefícios da Correção

- Link de pagamento válido e funcional
- Webhook automático para confirmar pagamentos
- Cotas automaticamente marcadas como vendidas
- Usuário criado e associado às cotas
- Dados do cliente pré-preenchidos no checkout InfinitePay
