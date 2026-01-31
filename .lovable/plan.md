
# Plano: Atualização Visual Completa

## Visão Geral

Este plano inclui correção de erros de build, novos componentes visuais (fundo animado procedural, bento grid cards, botões animados) e aplicação do tema escuro em todo o site.

---

## 1. Correção de Erros de Build

### Arquivos Afetados
- `src/pages/Login.tsx`
- `src/pages/MinhasCotas.tsx`

### Problema
O código está usando `.table()` que não existe no cliente Supabase. O método correto é `.from()`.

### Correções

**Login.tsx (linha 35)**
```typescript
// DE:
const { data: users, error: userError } = await supabase.table('users')

// PARA:
const { data: users, error: userError } = await supabase.from('users')
```

**MinhasCotas.tsx (linhas 61, 72, 83)**
```typescript
// DE:
supabase.table('transactions')
supabase.table('quotas')
supabase.table('raffle_configs')

// PARA:
supabase.from('transactions')
supabase.from('quotas')
supabase.from('raffle_configs')
```

---

## 2. Novo Componente: Fundo Animado Procedural

### Arquivo
`src/components/ui/procedural-ground-background.tsx`

### Descrição
Fundo WebGL com linhas topográficas neon e movimento de ondulação. Usa shaders para performance otimizada.

### Características
- Canvas WebGL fullscreen
- Efeito de perspectiva de terreno
- Linhas neon topográficas (roxo/azul elétrico)
- Animação fluida de ondulação
- Fallback para CSS se WebGL não disponível
- Performance otimizada

### Paleta de Cores do Shader
```glsl
baseColor = vec3(0.04, 0.03, 0.12);  // Deep Space
accentColor = vec3(0.1, 0.3, 0.8);   // Electric Blue
neonColor = vec3(0.6, 0.2, 1.0);      // Neon Purple
```

---

## 3. Novo Componente: Bento Grid Cards

### Arquivo
`src/components/ui/bento-grid.tsx`

### Descrição
Grid de cards estilo Bento com design moderno, tags, ícones e efeitos de hover.

### Características
- Layout responsivo (1 coluna mobile, 3 colunas desktop)
- Suporte a col-span para cards maiores
- Efeito de hover com elevação e gradiente
- Tags clicáveis
- Status badges
- Ícones personalizáveis

---

## 4. Novo Componente: Status Cycle Button

### Arquivo
`src/components/ui/status-cycle-button.tsx`

### Descrição
Botão que cicla automaticamente entre diferentes textos/estados com animação de blur.

### Características
- Animação de transição com blur
- Ciclo automático configurável
- Suporte a variantes do shadcn Button
- Usa framer-motion para animações

---

## 5. Aplicação do Fundo Animado em Todo o Site

### Arquivos Afetados
- `src/pages/Index.tsx` - Wrapper principal
- `src/components/ProductSection.tsx` - Substituir AuroraBackground
- `src/components/QuotaSelector.tsx` - Adicionar fundo

### Estratégia
Criar um wrapper global que aplica o fundo procedural em todas as seções, garantindo que o efeito seja contínuo ao scrollar.

---

## 6. Estrutura de Arquivos

```text
src/
├── components/
│   ├── ui/
│   │   ├── procedural-ground-background.tsx  (NOVO)
│   │   ├── bento-grid.tsx                    (NOVO)
│   │   └── status-cycle-button.tsx           (NOVO)
│   ├── ProceduralBackground.tsx              (NOVO - wrapper)
│   └── ...
├── pages/
│   ├── Index.tsx                             (ATUALIZAR)
│   ├── Login.tsx                             (CORRIGIR)
│   └── MinhasCotas.tsx                       (CORRIGIR)
```

---

## Detalhes Técnicos

### ProceduralGroundBackground Component

```typescript
// Inicialização WebGL
const gl = canvas.getContext('webgl');

// Vertex Shader - Tela cheia
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }

// Fragment Shader - Efeito principal
- Simulação de perspectiva de terreno
- Ruído procedural em camadas
- Linhas topográficas neon
- Fade de horizonte

// Loop de animação
requestAnimationFrame(render);
- Atualiza u_time para animação
- Redimensiona canvas com window
```

### Integração no Index.tsx

```tsx
<ProceduralBackground className="fixed inset-0 -z-10" />
<main className="relative z-10">
  <Header />
  <ProductSection />
  <QuotaSelector />
  <TrustBadges />
  <Footer />
</main>
```

---

## Resultado Esperado

- Fundo animado escuro com linhas neon em todo o site
- Cards estilo bento grid modernos
- Botões com animações de ciclo de texto
- Erros de build corrigidos
- Performance otimizada com WebGL
- Fallback CSS para dispositivos sem suporte
