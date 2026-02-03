
# Corrigir Webhook do InfinitePay - Cotas Não Atualizam

## Problema Identificado

O webhook do InfinitePay **falha** ao processar o pagamento porque tenta atualizar colunas que não existem na tabela `transactions`:

- `paid_at` - **não existe**
- `pix_code` - **não existe**

### Evidência nos Logs

```
ERROR: Transaction not found: b83c14db-a446-411b-9791-1f1a436778a8
```

Na verdade, a transação existe! O erro real é que a query com `*, quotas(*)` está falhando porque a relação direta não existe.

## Solução

### 1. Corrigir o Webhook (`infinitepay-webhook/index.ts`)

Remover as colunas inexistentes e corrigir a lógica:

**Antes:**
```typescript
// Query com relação que não existe
.select('*, quotas(*)')

// Colunas que não existem
.update({
  status: 'paid',
  paid_at: new Date().toISOString(),
  external_payment_id: payload.invoice_slug,
  pix_code: payload.transaction_nsu,
})
```

**Depois:**
```typescript
// Query simples
.select('*')

// Apenas colunas que existem
.update({
  status: 'paid',
  external_payment_id: payload.invoice_slug,
  updated_at: new Date().toISOString(),
})
```

### 2. Deploy da Edge Function

Após a correção, fazer deploy da função atualizada.

### 3. Corrigir Dados Existentes (Opcional)

Atualizar manualmente a cota do pagamento de teste que já foi feito:

```sql
-- Atualizar transação como paga
UPDATE transactions 
SET status = 'paid', external_payment_id = 'ihmhRYzj5'
WHERE id = 'b83c14db-a446-411b-9791-1f1a436778a8';

-- Atualizar cota como vendida
UPDATE quotas 
SET status = 'sold', 
    user_id = 'bc6abe13-0765-4876-bf7a-bc254684469e',
    purchase_date = now()
WHERE id = '63829a3b-1487-4359-ba3e-1d0b22cf0d62';
```

## Resultado Esperado

Após a correção:
- O webhook irá processar pagamentos corretamente
- As cotas serão marcadas como `sold` e associadas ao `user_id`
- O painel "Minhas Cotas" mostrará as cotas pagas

## Detalhes Técnicos

### Arquivo a modificar
`supabase/functions/infinitepay-webhook/index.ts`

### Colunas disponíveis na tabela `transactions`
| Coluna | Existe |
|--------|--------|
| id | ✅ |
| status | ✅ |
| external_payment_id | ✅ |
| updated_at | ✅ |
| paid_at | ❌ |
| pix_code | ❌ |

### Mudanças no código

1. **Linha 47**: Remover `quotas(*)` da query
2. **Linha 63-67**: Remover `paid_at` e `pix_code` do update
3. Adicionar melhor log de erros para debug
