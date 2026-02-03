
# Correção Final: Conceder Permissões de Tabela (GRANT)

## Diagnóstico Conclusivo

Após investigação detalhada, descobri a causa raiz do erro RLS:

**O problema NÃO é a política RLS** (que está correta e PERMISSIVE).

**O problema são os GRANTs ausentes** - o role `anon` não tem permissão para INSERT na tabela `transactions`.

### Evidência:
```sql
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'transactions';
-- Resultado: VAZIO []
```

Para que o PostgreSQL permita uma operação com RLS:
1. O role precisa ter **GRANT** para a operação na tabela
2. A **política RLS** precisa permitir a linha específica

Temos #2, mas falta #1.

---

## Solução

Criar uma migração SQL que concede os GRANTs necessários para todas as tabelas usadas no checkout.

### SQL a ser executado:

```sql
-- Conceder permissões para o role 'anon' (usuários não autenticados)
GRANT SELECT, INSERT ON public.transactions TO anon;
GRANT SELECT, INSERT ON public.users TO anon;
GRANT SELECT, UPDATE ON public.quotas TO anon;
GRANT SELECT, INSERT ON public.transaction_quotas TO anon;
GRANT SELECT ON public.raffle_configs TO anon;

-- Conceder permissões para o role 'authenticated' (usuários autenticados)
GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.quotas TO authenticated;
GRANT SELECT, INSERT ON public.transaction_quotas TO authenticated;
GRANT SELECT ON public.raffle_configs TO authenticated;

-- Garantir que a tabela usa sequência correta (se houver)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Forçar atualização do cache do PostgREST
NOTIFY pgrst, 'reload schema';
```

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| Nova migração SQL | Adicionar GRANTs para todas as tabelas do checkout |

## Resultado Esperado

Após aplicar esta migração:
1. O role `anon` terá permissão para INSERT na tabela `transactions`
2. A política RLS (que já é PERMISSIVE) permitirá a inserção
3. O checkout funcionará corretamente e redirecionará para o InfinitePay
