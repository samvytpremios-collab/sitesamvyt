
# Plano: Refinamento da Navegacao - Mobile-First

## Problema Atual
O site nao possui navegacao global consistente. A pagina principal nao tem header, as paginas institucionais tem apenas botao "Voltar", e nao existe menu mobile.

---

## Solucao: Header/Navbar Global Responsivo

### Novo Componente: `Header.tsx`

**Desktop (>768px):**
```text
+-------------------------------------------------------+
| [Logo SamVyt]     Como Funciona  FAQ  [Minhas Cotas]  |
+-------------------------------------------------------+
```

**Mobile (<768px):**
```text
+-----------------------------------------------+
| [Logo SamVyt]                     [Hamburger] |
+-----------------------------------------------+

Ao clicar no hamburguer, abre Drawer/Sheet lateral:
+---------------------------+
| X                         |
+---------------------------+
| SamVyt Premios            |
+---------------------------+
| > Inicio                  |
| > Como Funciona           |
| > FAQ                     |
| > Minhas Cotas            |
+---------------------------+
| Termos | Privacidade      |
+---------------------------+
```

### Caracteristicas do Header

1. **Posicao fixa** - `sticky top-0` para permanecer visivel durante scroll
2. **Backdrop blur** - Efeito glassmorphism combinando com o tema
3. **Logo clicavel** - Leva para home em todas as paginas
4. **Indicador de pagina ativa** - Destaque visual na pagina atual
5. **Animacoes suaves** - Transicoes ao abrir/fechar menu mobile
6. **Z-index alto** - Sempre acima do conteudo

---

## Arquivos a Criar/Modificar

### Criar: `src/components/Header.tsx`

**Estrutura:**
- Logo SamVyt (esquerda)
- Links de navegacao (centro/direita no desktop)
- Botao hamburguer (apenas mobile)
- Drawer/Sheet para menu mobile

**Navegacao:**
| Rota | Texto | Icone |
|------|-------|-------|
| `/` | Inicio | Home |
| `/como-funciona` | Como Funciona | Info |
| `/faq` | FAQ | HelpCircle |
| `/minhas-cotas/:token` | Minhas Cotas | Ticket |

### Modificar: `src/pages/Index.tsx`

- Adicionar `<Header />` antes do `ProductSection`
- Remover animacao de intro longa (reduzir para mais rapida ou skip)

### Modificar: Paginas Institucionais

Atualizar todas as paginas para usar o Header global em vez do header local:
- `src/pages/ComoFunciona.tsx`
- `src/pages/FAQ.tsx`
- `src/pages/Termos.tsx`
- `src/pages/Privacidade.tsx`
- `src/pages/MinhasCotas.tsx`

### Modificar: `src/components/Footer.tsx`

- Simplificar os links (ja estao no header)
- Manter apenas: Trust badges, Copyright, CNPJ

---

## Layout Responsivo

### Breakpoints Utilizados

| Dispositivo | Largura | Comportamento |
|-------------|---------|---------------|
| Mobile | < 768px | Menu hamburguer + Drawer |
| Tablet | 768px - 1024px | Links horizontais compactos |
| Desktop | > 1024px | Links horizontais espaçados |

### Touch Targets (Mobile)

- Botao hamburguer: minimo 48x48px
- Links do menu: altura 48px com padding generoso
- Area de toque ampla para facilitar navegacao

---

## Acessibilidade

- Navegacao por teclado (Tab, Enter, Escape)
- Aria-labels em todos os botoes
- Focus visible para navegacao
- Skip-to-content para leitores de tela

---

## Detalhes Tecnicos

### Header Component

```text
Estrutura do componente:
- Usar Sheet (vaul) para drawer mobile
- NavLink para links com estado ativo
- useIsMobile hook para detectar dispositivo
- framer-motion para animacoes
- cn() para classes condicionais
```

### Estilos

```text
Header container:
- sticky top-0 z-50
- bg-background/80 backdrop-blur-xl
- border-b border-border/50
- transition-all duration-300

Logo:
- Texto gradiente animado
- Link para "/"

Links Desktop:
- flex gap-6
- text-muted-foreground hover:text-primary
- Estado ativo: text-primary font-medium

Menu Mobile:
- Sheet side="right"
- Links empilhados verticalmente
- Icones ao lado de cada link
- Fechamento ao clicar em link
```

---

## Fluxo de Implementacao

1. Criar `Header.tsx` com layout responsivo
2. Integrar Sheet para menu mobile
3. Adicionar Header em `Index.tsx`
4. Remover headers locais das paginas institucionais e adicionar Header global
5. Ajustar Footer (simplificar links duplicados)
6. Testar navegacao em todos os dispositivos

---

## Resultado Esperado

- Navegacao consistente em todas as paginas
- Menu hamburguer funcional no mobile
- Links visiveis e acessiveis no desktop
- Logo sempre leva para home
- Experiencia fluida em qualquer dispositivo
