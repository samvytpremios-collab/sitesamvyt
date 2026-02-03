-- Remover políticas de INSERT existentes na tabela transactions
DROP POLICY IF EXISTS "Criar transacoes" ON public.transactions;
DROP POLICY IF EXISTS "Criar transacoes checkout" ON public.transactions;
DROP POLICY IF EXISTS "Permitir checkout anonimo" ON public.transactions;
DROP POLICY IF EXISTS "Atualizar transacao apos criacao" ON public.transactions;

-- Criar política PERMISSIVE para INSERT (checkout anônimo)
CREATE POLICY "Permitir checkout anonimo" ON public.transactions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Criar política PERMISSIVE para UPDATE (atualizar link de pagamento)
CREATE POLICY "Atualizar transacao apos criacao" ON public.transactions
  FOR UPDATE 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Notificar PostgREST para recarregar schema cache
NOTIFY pgrst, 'reload schema';