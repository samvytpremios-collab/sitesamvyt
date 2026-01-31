# Documentação API InfinitePay - Checkout Integrado

## Endpoints Principais

### 1. Criar Link de Pagamento
**POST** `https://api.infinitepay.io/invoices/public/checkout/links`

### 2. Verificar Status do Pagamento
**POST** `https://api.infinitepay.io/invoices/public/checkout/payment_check`

## Estrutura do Payload

```json
{
  "handle": "sua-infinitetag-sem-$",
  "items": [
    {
      "quantity": 1,
      "price": 1000,
      "description": "Descrição do produto"
    }
  ],
  "order_nsu": "identificador-unico-pedido",
  "redirect_url": "https://seusite.com/pagamento-concluido",
  "webhook_url": "https://seusite.com/webhook-infinitepay",
  "customer": {
    "name": "Nome do Cliente",
    "email": "email@cliente.com",
    "phone_number": "+5511999887766"
  }
}
```

## Importante

- **Preços em centavos**: R$ 10,00 = 1000
- **Handle**: InfiniteTag sem o símbolo $
- **Order NSU**: Identificador único do pedido no seu sistema

## Webhook

Quando o pagamento for aprovado, a InfinitePay envia:

```json
{
  "invoice_slug": "abc123",
  "amount": 1000,
  "paid_amount": 1010,
  "installments": 1,
  "capture_method": "pix",
  "transaction_nsu": "UUID",
  "order_nsu": "UUID-do-pedido",
  "receipt_url": "https://comprovante.com/123",
  "items": [...]
}
```

**Resposta esperada:**
- ✅ Sucesso: Status 200 OK
- ❌ Erro: Status 400 Bad Request (InfinitePay tentará reenviar)

## Redirect URL

Após pagamento, cliente é redirecionado com parâmetros:
- `receipt_url`: Link do comprovante
- `order_nsu`: Número do pedido
- `slug`: Código da fatura
- `capture_method`: Método de pagamento (credit_card ou pix)
- `transaction_nsu`: ID único da transação

## Verificação de Status

```json
{
  "handle": "sua_infinite_tag",
  "order_nsu": "123456",
  "transaction_nsu": "UUID-que-recebeu",
  "slug": "codigo-da-fatura"
}
```

**Resposta:**
```json
{
  "success": true,
  "paid": true,
  "amount": 1500,
  "paid_amount": 1510,
  "installments": 1,
  "capture_method": "pix"
}
```
