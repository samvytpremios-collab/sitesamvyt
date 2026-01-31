
# Plano: Integrar HolographicCard no Resumo do Pedido

## Visão Geral

Criar o componente `HolographicCard` com efeitos holográficos 3D e aplicá-lo no card de "Resumo do Pedido" do QuotaSelector, substituindo o atual `CyberCard`.

---

## 1. Novo Componente: HolographicCard

### Arquivo
`src/components/ui/holographic-card.tsx`

### Características
- Efeito 3D de inclinação baseado na posição do mouse (perspective + rotateX/Y)
- Gradiente holográfico animado que segue o cursor
- Efeito de reflexo rainbow/holográfico
- Borda com brilho dinâmico
- Totalmente customizável via props

### Adaptações para TypeScript
O código original precisa de tipagem:
```typescript
interface HolographicCardProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}
```

### Cores do Gradiente Holográfico
```css
/* Reflexo rainbow que segue o mouse */
background: linear-gradient(
  120deg,
  rgba(255,0,150,0.3),
  rgba(0,229,255,0.3),
  rgba(150,0,255,0.3),
  rgba(255,230,0,0.3)
);
```

---

## 2. Arquivos Afetados

| Arquivo | Ação |
|---------|------|
| `src/components/ui/holographic-card.tsx` | **Criar** - novo componente |
| `src/components/QuotaSelector.tsx` | **Atualizar** - usar HolographicCard no Resumo do Pedido |

---

## 3. Alterações no QuotaSelector.tsx

### Importação
```typescript
import { HolographicCard } from '@/components/ui/holographic-card';
```

### Substituição (Linhas 309-339)

**DE:**
```tsx
<CyberCard variant="spotlight" glowColor="mixed" className="mb-6 p-6">
  <div className="space-y-4">
    {/* conteúdo do resumo */}
  </div>
</CyberCard>
```

**PARA:**
```tsx
<HolographicCard className="mb-6">
  <div className="p-6 space-y-4">
    {/* conteúdo do resumo - mantido igual */}
  </div>
</HolographicCard>
```

---

## 4. Detalhes Técnicos do HolographicCard

### Estrutura do Componente

```tsx
const HolographicCard = ({ children, className }: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Calcula rotação 3D baseada na posição do mouse
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    // Atualiza CSS variables para o gradiente
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="holographic-card"
    >
      {/* Camada de reflexo holográfico */}
      <div className="holographic-reflection" />
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
```

### Estilos CSS Inline (Tailwind + CSS Variables)

```css
/* Container principal */
.holographic-card {
  position: relative;
  background: rgba(10, 10, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.1s ease-out;
}

/* Reflexo holográfico */
.holographic-reflection {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    400px at var(--x, 50%) var(--y, 50%),
    rgba(0, 229, 255, 0.15),
    rgba(150, 0, 255, 0.1),
    transparent
  );
  opacity: 0.8;
  pointer-events: none;
}

/* Brilho de borda */
.holographic-card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 1rem;
  background: linear-gradient(
    120deg,
    rgba(0, 229, 255, 0.5),
    rgba(150, 0, 255, 0.5),
    rgba(255, 150, 0, 0.3)
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

---

## 5. Resultado Esperado

- Card do Resumo do Pedido com efeito 3D holográfico
- Reflexo rainbow que segue o movimento do mouse
- Inclinação suave baseada na posição do cursor
- Borda com gradiente neon animado
- Retorna suavemente à posição original ao sair com o mouse
- Mantém tema escuro consistente com o resto do site
- Performance otimizada usando CSS transforms e will-change
