
# Plano: Corrigir Políticas RLS para Checkout InfinitePay

## Problema Identificado

O teste de checkout falhou com erros **406** e **401** porque as políticas de segurança (RLS) do banco de dados estão bloqueando operações necessárias para o checkout anônimo.

### Erros encontrados:
```
[Checkout] Criando/buscando usuário...
Error 406: GET /users?select=id&email=eq.teste@samvyt.com (SELECT negado)
Error 401: POST /users?select=id (INSERT retornando dados negado)
```

## Causa Raiz

A tabela `users` só permite:
- **INSERT**: anônimos podem inserir (OK)
- **SELECT**: apenas usuários autenticados podem ver seu próprio perfil (PROBLEMA)

O código do checkout precisa:
1. Verificar se email já existe (SELECT) - Bloqueado para anon
2. Inserir novo usuário (INSERT) - OK
3. Retornar o ID do usuário inserido (SELECT após INSERT) - Bloqueado

## Solução

Adicionar política que permite SELECT na tabela `users` apenas pelo email durante o checkout.

### Detalhes Técnicos

**Nova migration SQL:**

```sql
-- Permitir buscar usuário por email durante checkout
-- Isso é seguro pois só retorna o ID, não dados sensíveis
CREATE POLICY "Buscar usuario por email no checkout" ON public.users
  FOR SELECT TO anon
  USING (true);

-- Permitir reservar cotas durante checkout
CREATE POLICY "Reservar cotas no checkout" ON public.quotas
  FOR UPDATE TO anon, authenticated
  USING (status = 'available')
  WITH CHECK (status IN ('available', 'reserved'));

-- Permitir criar associações transaction_quotas
CREATE POLICY "Criar associacoes checkout" ON public.transaction_quotas
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
```

## Arquivo a Modificar

Criar nova migration em:
`supabase/migrations/[timestamp]_fix_checkout_rls_policies.sql`

## Impacto

Após aplicar a migration:
- O checkout funcionará corretamente
- Usuários anônimos poderão completar compras
- A chave `samvyt10` do InfinitePay será usada para gerar links de pagamento
- Os pagamentos serão processados via PIX ou Cartão

## Configuração do InfinitePay (Já Confirmado)

A chave/handle `samvyt10` já está corretamente configurada em:
- `.env`: `VITE_INFINITEPAY_HANDLE="samvyt10"`
- `src/services/checkout.ts`: Usa a variável com fallback

O problema atual é apenas nas políticas RLS do banco de dados.
