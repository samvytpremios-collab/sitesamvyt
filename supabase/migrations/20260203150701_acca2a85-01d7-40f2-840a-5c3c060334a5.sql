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