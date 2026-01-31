
# Plano: Remover Luz/Glow do iPhone

## Problema Identificado

A luz cyan atrás do iPhone não está combinando com o design geral do site. Ela aparece como um brilho difuso que pode parecer excessivo.

## Elementos a Remover

| Elemento | Localização | Descrição |
|----------|-------------|-----------|
| Glow Effect | Linha 62 | `<div className="blur-3xl bg-primary/30...">` - Círculo borrado atrás do iPhone |
| Drop Shadow | Linha 65 | `drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]` - Sombra cyan na imagem |

## Solução

Remover ambos os efeitos de luz, deixando o iPhone limpo e elegante sobre o fundo escuro.

## Alteração

**Arquivo:** `src/components/ProductSection.tsx`

**Antes (linhas 60-72):**
```tsx
<motion.div className="relative mb-12" ...>
  {/* Glow effect */}
  <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full scale-125" />

  {/* iPhone Image */}
  <motion.img 
    src={iphoneImage} 
    className="relative w-56 h-auto md:w-72 lg:w-80 drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]" 
    ...
  />
</motion.div>
```

**Depois:**
```tsx
<motion.div className="relative mb-12" ...>
  {/* iPhone Image */}
  <motion.img 
    src={iphoneImage} 
    className="relative w-56 h-auto md:w-72 lg:w-80" 
    ...
  />
</motion.div>
```

## Resultado

- iPhone aparecerá limpo, sem brilho artificial
- Visual mais minimalista e profissional
- Melhor integração com o background do site
