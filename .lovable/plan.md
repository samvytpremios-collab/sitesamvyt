
# Plano: Corrigir Navegação e Layout Mobile

## Problema Identificado

Analisando a imagem, o problema **não é o menu drawer**, mas sim uma **sobreposição de z-index** onde os elementos do ProductSection (Chip A21 Pro, Câmera 200MP, Garantia Apple) estão aparecendo sobre o QuotaSelector, criando uma bagunça visual.

**Causa raiz**: O `AuroraBackground` usa `z-10` para seu conteúdo, enquanto o `QuotaSelector` também tem elementos com `z-10`, criando conflitos de stacking context.

---

## Solucao

### 1. Corrigir z-index do AuroraBackground

**Arquivo**: `src/components/AuroraBackground.tsx`

- Remover `z-10` do container de children
- Adicionar `overflow-hidden` para evitar vazamento de conteudo
- O background WebGL ja fica atras naturalmente (z-index default)

**De:**
```tsx
<div className="absolute inset-0 z-10">
  {children}
</div>
```

**Para:**
```tsx
<div className="relative z-0">
  {children}
</div>
```

### 2. Ajustar ProductSection

**Arquivo**: `src/components/ProductSection.tsx`

- Garantir que o conteudo fique isolado dentro do AuroraBackground
- Adicionar `isolate` para criar stacking context proprio

### 3. Corrigir QuotaSelector

**Arquivo**: `src/components/QuotaSelector.tsx`

- Ajustar z-index do container para nao conflitar
- Mudar de `z-10` para `z-0` no container principal

### 4. Melhorar navegacao mobile no Header

**Arquivo**: `src/components/Header.tsx`

- Aumentar z-index do header para `z-50` (ja esta)
- Garantir que o Sheet overlay tenha z-index maior
- Melhorar posicionamento do botao X no drawer

---

## Alteracoes Detalhadas

### AuroraBackground.tsx

```text
Linha 30-32 (CSSFallback):
- Mudar: <div className="absolute inset-0 z-10">
- Para:  <div className="relative">

Linha 185:
- Mudar: <div className="absolute inset-0 z-10">
- Para:  <div className="relative">
```

### QuotaSelector.tsx

```text
Linha 100:
- Mudar: <div className="relative z-10 container mx-auto max-w-md">
- Para:  <div className="relative container mx-auto max-w-md">
```

### ProductSection.tsx

```text
Adicionar classe `isolate` no container principal para isolar stacking context
```

---

## Resultado Esperado

- ProductSection fica contido dentro do AuroraBackground
- QuotaSelector aparece corretamente abaixo, sem sobreposicoes
- Navegacao mobile funciona sem conflitos
- Header permanece fixo no topo com maior prioridade
