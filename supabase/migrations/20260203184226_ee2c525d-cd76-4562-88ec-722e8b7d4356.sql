-- Permitir que usuários vejam suas cotas por user_id (para login customizado)
CREATE POLICY "Ver cotas por user_id direto"
ON public.quotas
FOR SELECT
USING (true);

-- Remover política restritiva anterior
DROP POLICY IF EXISTS "Ver cotas disponiveis" ON public.quotas;
DROP POLICY IF EXISTS "Ver proprias cotas" ON public.quotas;