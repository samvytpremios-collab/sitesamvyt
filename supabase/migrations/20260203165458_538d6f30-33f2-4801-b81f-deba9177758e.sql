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