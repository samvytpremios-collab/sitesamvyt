
# Plano: Atualização Visual - Fontes, Cores e Navegação

## Visão Geral

Baseado na logo SamVyt (estilo racing/speed, itálica, com reflexo cromado azul), vamos atualizar as fontes para combinar melhor com a identidade visual e corrigir a navegação mobile.

---

## 1. Novas Fontes

### Fonte Principal (Títulos e Destaques)
- **Orbitron** - Fonte futurista geométrica que combina com o estilo tech/racing da logo
- Alternativa complementar: **Rajdhani** para subtítulos (mais leve, mantém o estilo moderno)

### Fonte de Corpo
- Manter **Inter** para texto corrido (já está funcionando bem)

---

## 2. Alterações nos Arquivos

### `index.html`
- Atualizar título da página de "Lovable App" para "SamVyt Prêmios"
- Atualizar meta descriptions

### `src/index.css`
- Trocar import do Google Fonts:
  - Remover: Space Grotesk
  - Adicionar: Orbitron (pesos 400, 500, 600, 700, 900)
  - Adicionar: Rajdhani (pesos 400, 500, 600, 700)
- Atualizar regras CSS para usar as novas fontes

### `tailwind.config.ts`
- Atualizar `fontFamily`:
  - `display`: Orbitron (para títulos principais)
  - `heading`: Rajdhani (para subtítulos)
  - `body`: Inter (manter)

### `src/components/Header.tsx`
**Correções no Mobile:**
- Reposicionar botão do menu mobile para melhor alinhamento
- Ajustar espaçamento dos links no drawer
- Melhorar transições e feedback visual
- Adicionar efeito de hover mais suave nos links
- Corrigir posição dos links do footer no drawer

---

## 3. Aplicação das Novas Fontes

### Onde usar Orbitron (font-display)
- Títulos principais (h1, h2)
- Números de cotas
- Preços em destaque
- Logo textual (fallback)
- Animação de intro "SAMVYT"

### Onde usar Rajdhani (font-heading)
- Subtítulos (h3, h4, h5, h6)
- Labels e badges
- Botões
- Navegação

### Onde usar Inter (font-body)
- Parágrafos
- Descrições
- Texto geral

---

## 4. Componentes Afetados

| Componente | Mudança |
|------------|---------|
| `Header.tsx` | Corrigir navegação mobile, melhorar espaçamentos |
| `ProductSection.tsx` | Aplicar novas fontes |
| `QuotaSelector.tsx` | Aplicar novas fontes nos números e títulos |
| `IntroAnimation.tsx` | Usar Orbitron no texto "SAMVYT" |
| `Footer.tsx` | Aplicar novas fontes |
| `QuotaTicket.tsx` | Aplicar novas fontes nos números |

---

## Detalhes Técnicos

### Import das Fontes (Google Fonts)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
```

### Configuração Tailwind
```javascript
fontFamily: {
  display: ["Orbitron", "sans-serif"],  // Títulos principais
  heading: ["Rajdhani", "sans-serif"],   // Subtítulos e navegação
  body: ["Inter", "sans-serif"],         // Corpo de texto
}
```

### Classes CSS Atualizadas
```css
h1, h2 {
  font-family: 'Orbitron', sans-serif;
}

h3, h4, h5, h6 {
  font-family: 'Rajdhani', sans-serif;
}

body {
  font-family: 'Inter', sans-serif;
}
```

---

## Resultado Esperado

- Fontes combinando com o estilo racing/futurista da logo
- Navegação mobile mais organizada e funcional
- Hierarquia tipográfica clara e consistente
- Melhor experiência visual em todos os dispositivos
