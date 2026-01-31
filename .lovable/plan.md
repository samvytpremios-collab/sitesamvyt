

# Plano: Simplificar a Barra de Progresso de Vendas

## Objetivo
Mostrar informações mais claras e diretas sobre o status das vendas, removendo números redundantes e focando no que importa.

## Situação Atual (Linhas 117-146)
A barra atualmente exibe:
- Header: "Cotas disponíveis" + "X de Y"
- Barra de progresso animada
- Texto: "X% das cotas já foram vendidas"

## Nova Estrutura Proposta

```text
┌─────────────────────────────────────────────┐
│  📈 Progresso de Vendas                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  ██████████████░░░░░░░░░░░░░░░░░░░░  42%    │
│                                             │
│  ✓ 7.140 vendidas    ○ 9.860 disponíveis   │
└─────────────────────────────────────────────┘
```

## Alterações

**Arquivo:** `src/components/QuotaSelector.tsx`

**Modificações:**
1. Alterar o header de "Cotas disponíveis" para "Progresso de Vendas"
2. Remover o texto "X de Y" do canto superior direito
3. Adicionar a porcentagem ao lado da barra de progresso
4. Adicionar linha com ícones mostrando vendidas e disponíveis separadamente

**Código atualizado (linhas 117-146):**

```tsx
{/* Stats Bar */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  className="mb-6"
>
  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
    <div className="flex items-center gap-2 mb-3">
      <TrendingUp className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium">Progresso de Vendas</span>
    </div>
    
    {/* Barra de progresso com porcentagem */}
    <div className="flex items-center gap-3 mb-3">
      <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${soldPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
        />
      </div>
      <span className="text-sm font-bold text-primary min-w-[45px] text-right">
        {soldPercentage}%
      </span>
    </div>
    
    {/* Estatísticas: vendidas e disponíveis */}
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5 text-green-500" />
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{formatNumber(stats.sold + stats.reserved)}</span> vendidas
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/50" />
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{formatNumber(stats.available)}</span> disponíveis
        </span>
      </div>
    </div>
  </div>
</motion.div>
```

## Resultado Visual

| Antes | Depois |
|-------|--------|
| "Cotas disponíveis 9.860 de 17.000" | "Progresso de Vendas" |
| "42% das cotas já foram vendidas" | Barra com **42%** ao lado |
| - | "✓ 7.140 vendidas ○ 9.860 disponíveis" |

## Benefícios
- Visual mais limpo e organizado
- Informações mais diretas e fáceis de entender
- Porcentagem em destaque ao lado da barra
- Separação clara entre vendidas e disponíveis

