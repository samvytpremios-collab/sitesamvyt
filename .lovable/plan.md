
# Corrigir Sistema de Cotas - Reserva, Confirmação e Liberação

## Resumo do Problema

O sistema tem 3 problemas críticos:
1. Cotas **não são reservadas** durante o checkout
2. O **webhook não está recebendo** notificações do InfinitePay
3. **Não há liberação automática** de cotas não pagas

## Correções Necessárias

### 1. Reservar Cotas Durante o Checkout

**Arquivo:** `src/services/checkout.ts`

Após criar a transação, atualizar as cotas selecionadas para status `reserved`:

```typescript
// Após inserir na tabela transaction_quotas
// Atualizar status das cotas para 'reserved'
await supabase
  .from('quotas')
  .update({ 
    status: 'reserved',
    transaction_id: transaction.id,
    updated_at: new Date().toISOString()
  })
  .in('id', quotaIds)
```

### 2. Configurar Webhook no InfinitePay

O InfinitePay precisa ser configurado para enviar notificações para:
```
https://[SEU_PROJETO].supabase.co/functions/v1/infinitepay-webhook
```

Você precisará:
1. Acessar o painel do InfinitePay
2. Configurar a URL do webhook nas configurações

### 3. Criar Função para Liberar Cotas Expiradas

**Nova função:** `supabase/functions/release-expired-quotas/index.ts`

Esta função será chamada periodicamente (via cron ou manualmente) para:
- Buscar transações `pending` que expiraram
- Atualizar cotas associadas para `available`
- Marcar transações como `expired`

```typescript
// Lógica principal:
// 1. Buscar transações pending onde expires_at < now()
// 2. Buscar cotas associadas via transaction_quotas
// 3. Atualizar cotas para status: 'available', user_id: null
// 4. Atualizar transações para status: 'expired'
```

### 4. Adicionar Política RLS para UPDATE nas Cotas

**Migração SQL necessária:**

A política atual só permite UPDATE de `available` → `reserved`. Precisamos permitir que o service_role (usado pelo webhook) também possa fazer `reserved` → `sold`.

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/services/checkout.ts` | Adicionar reserva de cotas |
| `supabase/functions/release-expired-quotas/index.ts` | Nova função para liberar cotas |
| Migração SQL | Atualizar política RLS |

## Fluxo Corrigido

```
Cliente seleciona cotas
        ↓
   Cotas: available → reserved
        ↓
   Redireciona para InfinitePay
        ↓
    Pagamento concluído
        ↓
   Webhook recebe notificação
        ↓
   Cotas: reserved → sold
        ↓
   Transação: pending → paid
```

## Fluxo de Expiração

```
   Cotas: reserved (30 min)
        ↓
   Pagamento não concluído
        ↓
   Função de liberação roda
        ↓
   Cotas: reserved → available
        ↓
   Transação: pending → expired
```

## Observação Importante

Você precisa configurar o webhook no painel do InfinitePay para que ele notifique seu sistema quando um pagamento for concluído. Sem essa configuração, o sistema nunca saberá que o pagamento foi feito.

A URL do webhook é:
```
https://pgfrhweuqvstezueqcrf.supabase.co/functions/v1/infinitepay-webhook
```
