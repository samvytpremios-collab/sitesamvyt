-- Criar tabela transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  raffle_id UUID NOT NULL REFERENCES public.raffle_configs(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'pix',
  external_payment_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela transaction_quotas (relacionamento N:N entre transactions e quotas)
CREATE TABLE IF NOT EXISTS public.transaction_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  quota_id UUID NOT NULL REFERENCES public.quotas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(transaction_id, quota_id)
);

-- Habilitar RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_quotas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para transactions (permitir checkout anônimo)
CREATE POLICY "Permitir checkout anonimo INSERT" ON public.transactions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Ver proprias transacoes" ON public.transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Ver transacoes por token" ON public.transactions
  FOR SELECT TO anon, authenticated
  USING (true);

-- Políticas RLS para transaction_quotas
CREATE POLICY "Inserir quotas na transacao" ON public.transaction_quotas
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Ver quotas da transacao" ON public.transaction_quotas
  FOR SELECT TO anon, authenticated
  USING (true);

-- Conceder permissões (GRANTS) para anon e authenticated
GRANT SELECT, INSERT ON public.transactions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;

GRANT SELECT, INSERT ON public.transaction_quotas TO anon;
GRANT SELECT, INSERT ON public.transaction_quotas TO authenticated;

-- Garantir permissões nas outras tabelas também
GRANT SELECT, INSERT ON public.users TO anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;

GRANT SELECT, UPDATE ON public.quotas TO anon;
GRANT SELECT, UPDATE ON public.quotas TO authenticated;

GRANT SELECT ON public.raffle_configs TO anon;
GRANT SELECT ON public.raffle_configs TO authenticated;

-- Permitir uso de sequências
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Recarregar cache do PostgREST
NOTIFY pgrst, 'reload schema';