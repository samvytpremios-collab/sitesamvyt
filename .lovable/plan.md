
# Plano: Correção do Checkout InfinitePay

## Diagnóstico Realizado

Após análise detalhada do fluxo de checkout, identifiquei que:

1. **Criação de usuários funciona** - 5 usuários foram criados com sucesso no banco
2. **Nenhuma transação foi criada** - todas as tentativas falharam com erro RLS
3. **As políticas RLS foram aplicadas** - mas podem não estar em efeito ainda

### Problema Identificado

O erro "new row violates row-level security policy for table transactions" indica que o PostgreSQL está rejeitando o INSERT, mesmo com a política `"Criar transacoes checkout"` configurada corretamente.

**Possíveis causas:**
- Cache do PostgREST não atualizou após a migração
- Conflito entre políticas PERMISSIVE/RESTRICTIVE (improvável, mas verificaremos)

---

## Solução Proposta

### Etapa 1: Forçar Atualização do Cache RLS

Vou criar uma nova migração que:
1. Remove TODAS as políticas de INSERT da tabela `transactions`
2. Recria a política com configuração garantidamente correta
3. Adiciona um `NOTIFY` para forçar atualização do cache

### Etapa 2: Simplificar o Fluxo de Checkout  

Vou adicionar logs mais detalhados no código para identificar exatamente onde o erro ocorre.

### Etapa 3: Testar com Browser Tool

Após as correções, vou testar o checkout automaticamente para garantir que funciona.

---

## Mudanças Técnicas

### 1. Migração SQL

```sql
-- Remover políticas de INSERT existentes
DROP POLICY IF EXISTS "Criar transacoes" ON public.transactions;
DROP POLICY IF EXISTS "Criar transacoes checkout" ON public.transactions;

-- Recriar política limpa
CREATE POLICY "Permitir checkout anonimo" ON public.transactions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Notificar PostgREST para recarregar schema
NOTIFY pgrst, 'reload schema';
```

### 2. Melhoria no código (checkout.ts)

- Adicionar log detalhado do erro exato retornado pelo Supabase
- Verificar se o `user_id` está correto antes de inserir
- Adicionar fallback para retry em caso de erro

### 3. Adicionar política de UPDATE (opcional)

Para o passo 9 do checkout (salvar `external_payment_id`), precisamos permitir UPDATE:

```sql
CREATE POLICY "Atualizar transacao apos criacao" ON public.transactions
  FOR UPDATE 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| Nova migração SQL | Recriar políticas RLS |
| `src/services/checkout.ts` | Melhorar tratamento de erro |

---

## Resultado Esperado

Após implementar estas correções:
1. O checkout criará a transação com sucesso
2. O link do InfinitePay será gerado corretamente
3. O usuário será redirecionado para `https://pay.infinitepay.io/@samvyt10?amount=X&description=Y`

