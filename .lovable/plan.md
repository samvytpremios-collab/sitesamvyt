
# Plano: Sistema de Compra de Cotas Mobile-First

## Resumo
Criar um sistema completo de compra de cotas inspirado no design do print, com foco em mobile, segurança visual (Loteria Federal) e fluxo de cadastro pós-compra.

---

## Parte 1: Banco de Dados

### Tabela: `customer_sessions` (Nova)
Vincular compradores aos seus números, mesmo sem login tradicional. Após pagar, o cliente recebe um link/código para acessar suas cotas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único |
| user_id | uuid | Referência para users |
| access_token | varchar | Token único para acessar cotas |
| created_at | timestamp | Data de criação |
| expires_at | timestamp | Validade do acesso (opcional) |

### Políticas RLS Necessárias
- `quotas`: Permitir leitura pública de cotas (para mostrar disponíveis)
- `transactions`: Usuários veem apenas suas transações
- `users`: Inserção pública (cadastro durante checkout)

---

## Parte 2: Interface do Seletor de Cotas

### Componente `QuotaSelector` (Reescrever)

**Layout Mobile-First inspirado no print:**

```text
+----------------------------------+
|     SELECIONE SUAS COTAS         |
|    Cada cota custa R$ 1,00       |
+----------------------------------+
|         [Aleatório]              |
+----------------------------------+
|                                  |
|      [ - ]    42    [ + ]        |
|              COTAS               |
|                                  |
+----------------------------------+
| [+5] [+10] [+20] [+50] [+100]    |
+----------------------------------+
|                                  |
|   [Selecionar 42 cotas]          |
|                                  |
+----------------------------------+
|   +---------------------------+  |
|   |     Resumo do Pedido      |  |
|   |   42 cotas x R$ 1,00      |  |
|   |   TOTAL: R$ 42,00         |  |
|   +---------------------------+  |
+----------------------------------+
|                                  |
|     [FINALIZAR COMPRA]           |
|                                  |
+----------------------------------+
```

### Elementos Visuais
- Header com gradiente cyan/azul
- Contador grande e interativo (botoes - e +)
- Chips de atalho com bordas arredondadas
- Botao "Selecionar X cotas aleatorias" com icone shuffle
- Card de resumo com glow effect
- CTA "Finalizar Compra" com ShineButton

---

## Parte 3: Modal de Checkout

### Componente `CheckoutModal` (Novo)

**Fluxo em 3 etapas:**

1. **Dados do Cliente**
   - Nome completo
   - Email
   - Telefone (WhatsApp)
   - Validacao em tempo real

2. **Resumo e Confirmacao**
   - Quantidade de cotas
   - Valor total
   - Destaque: "Sorteio pela Loteria Federal"
   - Selos de seguranca

3. **Pagamento PIX**
   - QR Code gerado
   - Codigo copia-cola
   - Timer de expiracao
   - Verificacao automatica

---

## Parte 4: Pagina "Minhas Cotas"

### Rota: `/minhas-cotas/:token`

**Acessivel via link unico enviado apos pagamento:**

- Lista de numeros comprados
- Status do pagamento
- Dados da rifa
- Data do sorteio
- Botao para compartilhar

---

## Parte 5: Paginas Institucionais

### Novas Rotas

| Rota | Pagina | Conteudo |
|------|--------|----------|
| `/como-funciona` | Como Funciona | Passo a passo visual, Loteria Federal |
| `/faq` | Perguntas Frequentes | Accordion com duvidas comuns |
| `/termos` | Termos de Uso | Regras de participacao |
| `/privacidade` | Politica de Privacidade | LGPD, uso de dados |

### Secao de Confianca (Footer e paginas)
- "Sorteio pela Loteria Federal"
- "Pagamento 100% seguro"
- "Transparencia total"
- Selos visuais com icones

---

## Parte 6: Estrutura de Arquivos

```text
src/
  components/
    QuotaSelector.tsx          (reescrever)
    CheckoutModal.tsx          (novo)
    CheckoutForm.tsx           (novo)
    PaymentPix.tsx             (novo)
    TrustBadges.tsx            (novo)
    Footer.tsx                 (novo - extrair de Index)
  pages/
    Index.tsx                  (atualizar)
    MinhasCotas.tsx            (novo)
    ComoFunciona.tsx           (novo)
    FAQ.tsx                    (novo)
    Termos.tsx                 (novo)
    Privacidade.tsx            (novo)
  hooks/
    useRaffle.ts               (novo - buscar rifa ativa)
    useQuotas.ts               (novo - gerenciar selecao)
    useCheckout.ts             (novo - processo de compra)
```

---

## Parte 7: Secao Tecnica

### Migracao SQL Necessaria

```sql
-- Tabela para sessoes de acesso do cliente
CREATE TABLE public.customer_sessions (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  access_token varchar NOT NULL UNIQUE,
  created_at timestamp DEFAULT now(),
  expires_at timestamp
);

-- Habilitar RLS
ALTER TABLE public.customer_sessions ENABLE ROW LEVEL SECURITY;

-- Politica: cliente acessa apenas sua sessao
CREATE POLICY "Clientes acessam propria sessao"
  ON public.customer_sessions
  FOR SELECT
  USING (access_token = current_setting('request.headers')::json->>'x-access-token');

-- Politicas para quotas
ALTER TABLE public.quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um ve cotas disponiveis"
  ON public.quotas
  FOR SELECT
  TO anon, authenticated
  USING (status = 'available');

-- Politicas para users (permitir cadastro)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir insercao de usuarios"
  ON public.users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politicas para transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios veem proprias transacoes"
  ON public.transactions
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IN (
    SELECT user_id FROM customer_sessions 
    WHERE access_token = current_setting('request.headers')::json->>'x-access-token'
  ));
```

### Edge Function: `create-pix-payment`

Para integracao com gateway de pagamento (InfinityPay, MercadoPago, etc):
- Recebe: quantidade de cotas, dados do cliente
- Cria usuario em `users` se nao existir
- Cria transacao em `transactions`
- Gera PIX via API do gateway
- Retorna QR Code e codigo

### Edge Function: `verify-payment`

Webhook para confirmar pagamento:
- Recebe notificacao do gateway
- Atualiza status da transacao
- Reserva cotas aleatorias para o cliente
- Envia email/WhatsApp com link de acesso

---

## Ordem de Implementacao

1. **Migracao do banco** - Criar tabela e politicas RLS
2. **QuotaSelector** - Interface de selecao mobile-first
3. **CheckoutModal** - Formulario e fluxo de pagamento
4. **Pagina MinhasCotas** - Visualizar numeros comprados
5. **Paginas institucionais** - Termos, FAQ, etc.
6. **Footer e Trust Badges** - Elementos de confianca
7. **Edge Functions** - Integracao de pagamento (fase 2)

---

## Consideracoes Mobile

- **Touch targets**: Minimo 48px para botoes
- **Fontes**: Tamanhos legiveis (16px base)
- **Espacamento**: Generoso para evitar toques acidentais
- **Animacoes**: Suaves mas responsivas
- **Scroll**: Secoes full-height quando apropriado
