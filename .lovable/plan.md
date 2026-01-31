

# Plano: Otimização do Resumo do Pedido e Menu Mobile

## Problemas Identificados

### 1. Resumo do Pedido (QuotaSelector.tsx)
- Valores não estão alinhados corretamente à direita
- Espaçamento inconsistente entre linhas
- Falta de estrutura visual clara (tabela ou grid)

### 2. Menu Mobile (Header.tsx)
- Itens muito espaçados (py-4 = 16px de padding vertical)
- Falta de efeitos visuais futuristas
- Botão "Minhas Cotas" pode ser mais destacado
- Layout geral pode ser mais compacto

---

## Solução

### 1. Otimizar Resumo do Pedido

**Problema atual:**
```tsx
<div className="flex justify-between items-center">
  <span className="text-muted-foreground">Quantidade</span>
  <span className="font-medium">{quantity} cotas</span>
</div>
```

**Solução:**
Usar estrutura de grid com colunas fixas para garantir alinhamento perfeito:

```tsx
<div className="grid grid-cols-[1fr_auto] gap-y-3 gap-x-4">
  <span className="text-muted-foreground text-sm">Quantidade</span>
  <span className="font-medium text-right">2 cotas</span>
  
  <span className="text-muted-foreground text-sm">Preço unitário</span>
  <span className="font-medium text-right">R$ 1,00</span>
  
  <!-- Separador ocupa as 2 colunas -->
  <div className="col-span-2 h-px bg-border" />
  
  <span className="font-semibold text-base">Total</span>
  <span className="font-bold text-xl gradient-text text-right">R$ 2,00</span>
</div>
```

### 2. Otimizar Menu Mobile

**Melhorias:**
- Reduzir padding dos itens de `py-4` para `py-3`
- Adicionar ícones com fundo sutil
- Hover com efeito de glow
- Animação de entrada escalonada
- Separador com gradiente neon
- Botão "Minhas Cotas" com efeito pulsante

---

## Arquivos Afetados

| Arquivo | Alterações |
|---------|------------|
| `src/components/QuotaSelector.tsx` | Refatorar layout do Resumo do Pedido com grid |
| `src/components/Header.tsx` | Otimizar menu mobile com design compacto e futurista |

---

## Detalhes Técnicos

### QuotaSelector.tsx - Linhas 309-340

**DE:**
```tsx
<div className="p-6 space-y-4">
  <div className="flex items-center gap-2">
    <h3 className="font-heading font-bold text-lg tracking-wide">Resumo do Pedido</h3>
  </div>

  <div className="space-y-2 text-sm">
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">Quantidade</span>
      <span className="font-medium">{quantity} {quantity === 1 ? 'cota' : 'cotas'}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">Preço unitário</span>
      <span className="font-medium">{formatCurrency(pricePerQuota)}</span>
    </div>
    {selectedNumbers.length > 0 && (
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Números selecionados</span>
        <span className="font-medium text-primary">{selectedNumbers.length}</span>
      </div>
    )}
    <div className="h-px bg-border my-2" />
    <div className="flex justify-between items-center">
      <span className="font-semibold text-lg">Total</span>
      <span className="font-display font-bold text-2xl gradient-text">
        {formatCurrency(totalPrice)}
      </span>
    </div>
  </div>
</div>
```

**PARA:**
```tsx
<div className="p-6">
  <h3 className="font-heading font-bold text-lg tracking-wide mb-4">Resumo do Pedido</h3>
  
  <div className="grid grid-cols-[1fr_auto] gap-y-3 items-center">
    <span className="text-muted-foreground text-sm">Quantidade</span>
    <span className="font-medium text-sm text-right tabular-nums">
      {quantity} {quantity === 1 ? 'cota' : 'cotas'}
    </span>
    
    <span className="text-muted-foreground text-sm">Preço unitário</span>
    <span className="font-medium text-sm text-right tabular-nums">
      {formatCurrency(pricePerQuota)}
    </span>
    
    {selectedNumbers.length > 0 && (
      <>
        <span className="text-muted-foreground text-sm">Números selecionados</span>
        <span className="font-medium text-sm text-primary text-right tabular-nums">
          {selectedNumbers.length}
        </span>
      </>
    )}
    
    <div className="col-span-2 h-px bg-gradient-to-r from-transparent via-border to-transparent my-1" />
    
    <span className="font-semibold">Total</span>
    <span className="font-display font-bold text-xl gradient-text text-right tabular-nums">
      {formatCurrency(totalPrice)}
    </span>
  </div>
</div>
```

### Header.tsx - Menu Mobile (Linhas 96-135)

**Melhorias no nav:**
- Padding reduzido: `py-4` → `py-3`
- Ícones com background: `bg-secondary/50 p-2 rounded-lg`
- Gap entre itens: `gap-2` → `gap-1.5`
- Hover glow sutil
- Separador com gradiente

```tsx
<nav className="flex-1 flex flex-col p-4 gap-1.5">
  {mainNavLinks.map((link, index) => {
    const Icon = link.icon;
    const isActive = location.pathname === link.to;
    return (
      <Link
        key={link.to}
        to={link.to}
        onClick={closeMenu}
        className={cn(
          'flex items-center gap-3 px-3 py-3 rounded-xl font-heading font-semibold text-sm transition-all duration-200',
          isActive
            ? 'bg-primary/15 text-primary border border-primary/40 shadow-[0_0_15px_hsl(187_100%_50%_/_0.15)]'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
        )}
      >
        <div className={cn(
          'p-2 rounded-lg transition-colors',
          isActive ? 'bg-primary/20' : 'bg-secondary/50'
        )}>
          <Icon className="w-4 h-4" />
        </div>
        {link.label}
      </Link>
    );
  })}

  {/* Separador com gradiente */}
  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-3" />

  {/* Minhas Cotas - Mais compacto */}
  <Link
    to="/login"
    onClick={closeMenu}
    className={cn(
      'flex items-center gap-3 px-3 py-3 rounded-xl font-heading font-bold text-sm border transition-all duration-200',
      location.pathname.startsWith('/login') || location.pathname.startsWith('/minhas-cotas')
        ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(187_100%_50%_/_0.3)]'
        : 'border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(187_100%_50%_/_0.2)]'
    )}
  >
    <div className="p-2 rounded-lg bg-primary/20">
      <Ticket className="w-4 h-4" />
    </div>
    Minhas Cotas
  </Link>
</nav>
```

---

## Resultado Esperado

### Resumo do Pedido
- Valores perfeitamente alinhados à direita com `grid` e `text-right`
- Números com fonte monoespaçada (`tabular-nums`) para alinhamento consistente
- Separador com gradiente sutil
- Visual mais limpo e profissional

### Menu Mobile
- Layout mais compacto e elegante
- Ícones com fundo sutil que destaca o item ativo
- Efeitos de glow nos itens ativos
- Separador com gradiente neon
- Transições suaves
- Melhor hierarquia visual

