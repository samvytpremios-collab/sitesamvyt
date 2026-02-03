
# Correção do Preço das Cotas no InfinitePay

## Diagnóstico

O InfinitePay está mostrando R$ 100,00 para 10 cotas porque a Edge Function está enviando os dados incorretamente:

**Problema identificado:**
- `body.amount` contém o **valor total** (ex: R$ 10,00 para 10 cotas)
- O código converte esse total para centavos: `1000` (R$ 10,00 × 100)
- O InfinitePay interpreta como R$ 10,00 **por unidade** × 10 unidades = R$ 100,00

**Payload atual (incorreto):**
```json
{
  "items": [{
    "quantity": 10,
    "price": 1000,  // InfinitePay entende: R$10/unidade × 10 = R$100
    "description": "10x Cotas"
  }]
}
```

**Payload correto:**
```json
{
  "items": [{
    "quantity": 10,
    "price": 100,   // R$1/unidade × 10 = R$10
    "description": "10x Cotas"
  }]
}
```

---

## Solução

Modificar a Edge Function para calcular o preço **unitário** em centavos:

### Arquivo: `supabase/functions/create-payment-link/index.ts`

**Alteração na linha 66-77:**

```typescript
// ANTES (incorreto):
const priceInCents = Math.round(body.amount * 100);

// DEPOIS (correto):
const unitPriceInCents = Math.round((body.amount / body.quantity) * 100);
```

E no payload:

```typescript
items: [
  {
    quantity: body.quantity,
    price: unitPriceInCents,  // Preço unitário em centavos
    description: body.description,
  },
],
```

---

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| 10 cotas × R$1 | R$ 100,00 ❌ | R$ 10,00 ✓ |
| 5 cotas × R$1 | R$ 50,00 ❌ | R$ 5,00 ✓ |
| 100 cotas × R$1 | R$ 1.000,00 ❌ | R$ 100,00 ✓ |

---

## Detalhes Técnicos

Apenas **uma linha** precisa ser alterada na Edge Function `create-payment-link`:

```typescript
// Linha ~66: Calcular preço UNITÁRIO em centavos
const unitPriceInCents = Math.round((body.amount / body.quantity) * 100);
```

O restante do código permanece inalterado. Após a correção, o fluxo funcionará corretamente:

1. Frontend envia `amount: 10` (total em reais) e `quantity: 10`
2. Edge Function calcula: `10 ÷ 10 × 100 = 100 centavos` (R$ 1,00 por unidade)
3. InfinitePay recebe: `quantity: 10, price: 100`
4. Cliente vê: 10 × R$ 1,00 = R$ 10,00 ✓
