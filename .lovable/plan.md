
# Validação de Seleção de Cotas Antes do Checkout

## Situação Atual

O botão "Finalizar Compra" está sempre habilitado, permitindo que o usuário prossiga sem selecionar os números aleatórios primeiro. Isso pode causar confusão no fluxo.

## Solução Proposta

Adicionar validação que exige a seleção de cotas aleatórias antes de permitir o checkout.

---

## Mudanças no Componente

### Arquivo: `src/components/QuotaSelector.tsx`

**1. Desabilitar botão se não houver números selecionados:**

```tsx
// Linha ~379: Adicionar condição de desabilitado
<SolidButton
  onClick={() => setIsCheckoutOpen(true)}
  className="w-full"
  size="lg"
  variant="primary"
  disabled={stats.available === 0 || selectedNumbers.length === 0}
>
```

**2. Mudar texto do botão para indicar o passo necessário:**

```tsx
{selectedNumbers.length > 0 
  ? `Comprar ${selectedNumbers.length} Cotas` 
  : 'Selecione as cotas acima'}
```

**3. Adicionar feedback visual quando desabilitado:**

Mostrar uma mensagem sutil abaixo do botão quando não houver cotas selecionadas:

```tsx
{selectedNumbers.length === 0 && (
  <p className="text-center text-xs text-muted-foreground mt-2">
    Clique em "Selecionar cotas aleatórias" acima para continuar
  </p>
)}
```

---

## Fluxo Atualizado

| Etapa | Ação do Usuário | Estado do Botão |
|-------|-----------------|-----------------|
| 1 | Escolhe quantidade (ex: 10) | Desabilitado - "Selecione as cotas acima" |
| 2 | Clica em "Selecionar 10 cotas aleatórias" | Animação de seleção |
| 3 | Números aparecem no ticket | Habilitado - "Comprar 10 Cotas" |
| 4 | Clica no botão | Abre modal de checkout |

---

## Visual Esperado

**Antes de selecionar:**
- Botão com opacidade reduzida
- Texto: "Selecione as cotas acima"
- Mensagem de ajuda abaixo

**Após selecionar:**
- Botão com destaque total
- Texto: "Comprar 10 Cotas"
- Sem mensagem adicional

---

## Validação Adicional

Garantir que a quantidade de números selecionados corresponda à quantidade escolhida:

```tsx
disabled={
  stats.available === 0 || 
  selectedNumbers.length === 0 || 
  selectedNumbers.length !== quantity
}
```

Isso evita que o usuário altere a quantidade após selecionar e tente comprar com números inconsistentes.
