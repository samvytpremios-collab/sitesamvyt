-- Corrigir política de INSERT na tabela transactions para permitir checkout anônimo
-- A política atual é RESTRICTIVE, precisamos criar uma PERMISSIVE
DROP POLICY IF EXISTS "Criar transacoes" ON public.transactions;

CREATE POLICY "Criar transacoes checkout" ON public.transactions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);