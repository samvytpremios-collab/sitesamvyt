
# Plano: Cards Futuristas e Remoção de Fundos Brancos

## Problema Identificado

O `SimpleCard` e outros componentes ainda usam `bg-white` que conflita com o tema escuro/futurista do site. Os cards são muito genéricos e não combinam com a estética neon/cyberpunk do projeto.

### Componentes com fundo branco encontrados:
- `src/components/ui/simple-card.tsx` - linha 20: `bg-white dark:bg-gray-900`
- `src/components/ui/solid-button.tsx` - linha 13: variant secondary usa `bg-white`
- `src/pages/Login.tsx` - linha 124: input com `bg-white`

---

## Solução

### 1. Criar Novo Componente: CyberCard

Substituir o SimpleCard por um card futurista com:
- Fundo escuro translúcido (glass morphism)
- Borda com gradiente animado neon
- Efeito de spotlight no hover (segue o mouse)
- Glow sutil cyan/purple
- Linhas de "circuito" decorativas opcionais

### 2. Atualizar SimpleCard

Remover completamente o `bg-white` e usar cores do tema escuro:

```tsx
// DE:
'bg-white dark:bg-gray-900',
'border border-gray-200 dark:border-gray-800',

// PARA:
'bg-card/80 backdrop-blur-xl',
'border border-border/50',
'shadow-[0_0_30px_rgba(0,217,255,0.05)]',
```

### 3. Atualizar SolidButton

Remover variant secondary com fundo branco:

```tsx
// DE:
secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',

// PARA:
secondary: 'bg-secondary hover:bg-secondary/80 text-foreground border border-border',
```

### 4. Atualizar Login.tsx

Inputs sem fundo branco:

```tsx
// DE:
className="... bg-white dark:bg-gray-900 ..."

// PARA:
className="... bg-secondary border-border ..."
```

### 5. Criar CyberCard Component

Novo componente com visual futurista:

```tsx
// src/components/ui/cyber-card.tsx
interface CyberCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'mixed';
  variant?: 'default' | 'bordered' | 'spotlight';
}
```

**Características:**
- Gradiente de borda animado (conic-gradient rotativo)
- Background com glass effect escuro
- Efeito spotlight que segue o cursor
- Cantos com "clips" estilo cyberpunk
- Inner glow sutil

---

## Arquivos Afetados

| Arquivo | Ação |
|---------|------|
| `src/components/ui/simple-card.tsx` | Atualizar para tema escuro |
| `src/components/ui/solid-button.tsx` | Remover bg-white do secondary |
| `src/components/ui/cyber-card.tsx` | Criar novo componente |
| `src/pages/Login.tsx` | Atualizar inputs |
| `src/components/QuotaSelector.tsx` | Usar CyberCard em vez de SimpleCard |

---

## Design do CyberCard

```text
+--[ CYBER CARD ]------------------+
|                                   |
|   ╔═══════════════════════════╗   |  <- Borda neon animada
|   ║                           ║   |
|   ║      Conteúdo             ║   |  <- Glass background
|   ║                           ║   |
|   ╚═══════════════════════════╝   |
|          ~~~~~~~~                 |  <- Spotlight effect (hover)
+-----------------------------------+
```

**Paleta de cores:**
- Background: `hsl(210 45% 8% / 0.8)` (card escuro translúcido)
- Borda: Gradiente `cyan -> purple -> cyan` animado
- Glow: `rgba(0, 217, 255, 0.1)` a `rgba(138, 43, 226, 0.1)`

---

## Detalhes Técnicos

### CyberCard - Estrutura

```tsx
<div className="relative group">
  {/* Animated border */}
  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-conic animate-spin-slow opacity-50" />
  
  {/* Inner background */}
  <div className="relative rounded-2xl bg-card/80 backdrop-blur-xl border border-border/30 p-6">
    
    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/50" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/50" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/50" />
    
    {/* Spotlight effect */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{
        background: `radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(0,217,255,0.1), transparent)`
      }}
    />
    
    {/* Content */}
    {children}
  </div>
</div>
```

### Aplicação no QuotaSelector

Substituir os dois usos de `SimpleCard`:

```tsx
// Linha 161 - Contador de quantidade
<CyberCard variant="bordered" className="mb-6 p-6">
  {/* conteúdo do contador */}
</CyberCard>

// Linha 309 - Resumo do pedido  
<CyberCard variant="spotlight" className="mb-6 p-6">
  {/* conteúdo do resumo */}
</CyberCard>
```

---

## Resultado Esperado

- Zero componentes com fundo branco em todo o site
- Cards com visual cyberpunk/futurista consistente
- Efeitos de hover interativos (spotlight, glow)
- Bordas animadas com gradiente neon
- Integração perfeita com o fundo procedural do site
- Visual premium e não genérico
