

# Plano: Sistema de Cotas Profissional com Apresentacao Premium

## Objetivo
Melhorar a apresentacao do sistema de cotas com pacotes minimos de 5, 10, 20 cotas na visualizacao, mas permitindo que o usuario escolha qualquer quantidade a partir de 1 cota. Implementar botoes e cards premium inspirados no 21st.dev.

## Novo Sistema de Cotas

### Logica de Apresentacao vs Compra
```text
PACOTES DE APRESENTACAO (destacados):
+--------+  +---------+  +---------+  +---------+  +---------+
|   5    |  |   10    |  |   20    |  |   50    |  |  100    |
| cotas  |  |  cotas  |  |  cotas  |  |  cotas  |  |  cotas  |
| R$ 5   |  |  R$ 10  |  |  R$ 20  |  |  R$ 50  |  | R$ 100  |
+--------+  +---------+  +---------+  +---------+  +---------+
                                         POPULAR

QUANTIDADE CUSTOMIZADA:
+-------------------------------------------+
|     Escolha sua quantidade (minimo 1)     |
|                                           |
|      [ - ]      25      [ + ]             |
|                                           |
|    Input numerico para digitacao rapida   |
+-------------------------------------------+
```

### Comportamento
- **Pacotes de destaque**: 5, 10, 20, 50 (popular), 100 cotas
- **Quantidade minima real**: 1 cota (usuario pode digitar ou usar botoes +/-)
- **Contador interativo**: Campo numerico editavel com botoes incrementais
- **Validacao**: Minimo 1, maximo configuravel (ex: 1000)

## Novos Componentes a Criar

### 1. `src/components/ui/shine-button.tsx` - Botao Premium com Efeito Brilho
Inspirado no "Gradient Button" do 21st.dev:
- Efeito de brilho deslizante (shine) no hover
- Gradiente animado de fundo (cyan para azul)
- Glow externo pulsante
- Suporte a icones e estados de loading

```text
Comportamento visual:
NORMAL:    [========Comprar Cotas========]
                    gradiente solido

HOVER:     [=====>Comprar Cotas<=======]
           brilho branco desliza da esquerda para direita
           glow externo intensifica
```

### 2. `src/components/ui/glow-card.tsx` - Card com Borda Luminosa
Inspirado no "Card Spotlight" do 21st.dev:
- Borda com gradiente animado quando selecionado
- Efeito de elevacao no hover
- Badge "POPULAR" posicionado acima do card
- Transicoes suaves de 300ms

```text
Card nao selecionado:
+------------------+
|      borda       |
|     cinza        |
+------------------+

Card selecionado:
*******************
*  borda brilha   *
*  cyan/azul      *
*  com glow       *
*******************
```

## Arquivos a Modificar

### 1. `src/components/QuotaSelector.tsx` - Refatoracao Completa

**Mudancas:**
- Novos pacotes: 5, 10, 20, 50, 100 cotas
- Input numerico editavel para quantidade customizada
- Botoes +/- com incrementos de 1 (clique), 10 (clique longo ou shift+clique)
- Resumo de compra com visual premium
- Integracao com ShineButton e GlowCard
- Animacoes de entrada escalonadas

**Layout proposto:**
```text
+=====================================================+
|                                                     |
|              ESCOLHA SUAS COTAS                     |
|     "Cada cota e uma chance de ganhar!"             |
|                                                     |
+=====================================================+
|                                                     |
|  +-------+  +-------+  +-------+  +-------+        |
|  |   5   |  |  10   |  |  20   |  |  50   |        |
|  | cotas |  | cotas |  | cotas |  | cotas |        |
|  +-------+  +-------+  +-------+  +-------+        |
|                           POPULAR                   |
|                                                     |
|                 +--------+                          |
|                 |  100   |                          |
|                 | cotas  |                          |
|                 +--------+                          |
|                                                     |
+=====================================================+
|                                                     |
|           Ou digite sua quantidade:                 |
|                                                     |
|        [ - ]    [  25  ]    [ + ]                   |
|                                                     |
|           minimo 1 cota                             |
|                                                     |
+=====================================================+
|                                                     |
|  +-----------------------------------------+        |
|  |                                         |        |
|  |  25 cotas           R$ 25,00            |        |
|  |                                         |        |
|  |  [====COMPRAR VIA PIX====]             |        |
|  |                                         |        |
|  |  Pagamento instantaneo e seguro        |        |
|  +-----------------------------------------+        |
|                                                     |
+=====================================================+
```

### 2. `src/components/ProductSection.tsx` - Adicionar CTA

**Mudancas:**
- Adicionar botao CTA "Quero Participar" apos as features
- Usar ShineButton para o CTA
- Adicionar indicador visual de scroll (seta animada)
- Scroll suave para secao de cotas ao clicar

### 3. `src/index.css` - Novas Animacoes

**Adicionar:**
- `@keyframes shine-slide` - Animacao do brilho
- `@keyframes glow-pulse` - Pulsacao do glow
- `.shine-button` - Classe utilitaria para efeito shine
- `.glow-border` - Classe para borda luminosa

## Detalhes Tecnicos

### Interface QuotaPackage Atualizada
```typescript
interface QuotaPackage {
  id: string;
  quantity: number;
  pricePerUnit: number;
  popular?: boolean;
  highlight?: boolean; // Para destacar pacotes especificos
}

const QUOTA_PACKAGES: QuotaPackage[] = [
  { id: 'pkg_5', quantity: 5, pricePerUnit: 1.00 },
  { id: 'pkg_10', quantity: 10, pricePerUnit: 1.00 },
  { id: 'pkg_20', quantity: 20, pricePerUnit: 1.00 },
  { id: 'pkg_50', quantity: 50, pricePerUnit: 1.00, popular: true },
  { id: 'pkg_100', quantity: 100, pricePerUnit: 1.00 },
];
```

### ShineButton Props
```typescript
interface ShineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  shineColor?: string; // default: white
  glowColor?: string;  // default: primary
}
```

### GlowCard Props
```typescript
interface GlowCardProps {
  selected?: boolean;
  popular?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}
```

### Animacoes CSS
```css
@keyframes shine-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px hsl(187 100% 50% / 0.3); }
  50% { box-shadow: 0 0 40px hsl(187 100% 50% / 0.6); }
}
```

## Resumo das Alteracoes

| Arquivo | Acao | Descricao |
|---------|------|-----------|
| `src/components/ui/shine-button.tsx` | Criar | Botao com efeito de brilho premium |
| `src/components/ui/glow-card.tsx` | Criar | Card com borda luminosa animada |
| `src/components/QuotaSelector.tsx` | Refatorar | Novo layout com pacotes 5-100, input customizado |
| `src/components/ProductSection.tsx` | Atualizar | Adicionar CTA com ShineButton |
| `src/index.css` | Atualizar | Novas animacoes shine e glow |

## Beneficios

1. **Apresentacao Premium**: Cards e botoes com efeitos visuais sofisticados
2. **Flexibilidade**: Usuario pode escolher qualquer quantidade a partir de 1
3. **UX Intuitiva**: Pacotes sugeridos + input livre para personalizacao
4. **Consistencia Visual**: Componentes reutilizaveis com identidade do projeto
5. **Preparado para Producao**: Codigo limpo e pronto para integracao com backend

