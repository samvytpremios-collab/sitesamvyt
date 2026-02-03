
# Corrigir Sincronização de Números - Seleção vs Pagamento

## Problema Identificado

O sistema está selecionando números **duas vezes**:

1. **Durante a seleção visual**: O usuário clica em "Selecionar cotas aleatórias" e vê o número **85755**
2. **Durante o checkout**: O sistema **ignora** esse número e seleciona **novas cotas aleatórias**

Por isso, o número mostrado na seleção é diferente do que aparece no painel após o pagamento.

## Causa Raiz

No arquivo `src/services/checkout.ts`, linha 127:
```typescript
// O problema está aqui - ignora os selectedNumbers recebidos
quotaIds = await selectRandomQuotas(data.raffleId, data.quantity);
```

O parâmetro `selectedNumbers` é recebido mas nunca utilizado.

## Solução

Modificar o `processCheckout` para:
1. **Usar os números já selecionados** quando disponíveis
2. **Buscar os IDs das cotas** com base nos números selecionados
3. **Só selecionar novas cotas** se nenhum número foi previamente selecionado

### Fluxo Corrigido

```
Usuário seleciona cotas → Números: [85755] 
        ↓
Abre checkout com selectedNumbers: ["85755"]
        ↓
Checkout busca IDs das cotas por número
        ↓
Reserva essas cotas específicas
        ↓
Pagamento confirmado
        ↓
Painel mostra: 85755 ✓
```

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/services/checkout.ts` | Usar números selecionados em vez de gerar novos |

## Mudanças no Código

### checkout.ts

1. Criar nova função para buscar IDs por números:
```typescript
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
```

2. No `processCheckout`, usar os números selecionados:
```typescript
// Antes (errado)
quotaIds = await selectRandomQuotas(data.raffleId, data.quantity);

// Depois (correto)
if (data.selectedNumbers && data.selectedNumbers.length === data.quantity) {
  quotaIds = await getQuotaIdsByNumbers(data.raffleId, data.selectedNumbers);
} else {
  quotaIds = await selectRandomQuotas(data.raffleId, data.quantity);
}
```

## Resultado Esperado

Após a correção:
- O número **85755** mostrado na seleção será o **mesmo** número que aparece no painel "Minhas Cotas"
- Haverá consistência entre a visualização e a compra efetiva
