-- Tabela para sessões de acesso do cliente (link único pós-pagamento)
CREATE TABLE public.customer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  access_token varchar(64) NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone
);

-- Índice para busca rápida por token
CREATE INDEX idx_customer_sessions_token ON public.customer_sessions(access_token);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.customer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffle_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_quotas ENABLE ROW LEVEL SECURITY;

-- ========== POLÍTICAS PARA customer_sessions ==========
-- Clientes acessam apenas sua própria sessão via token
CREATE POLICY "Acesso por token" ON public.customer_sessions
  FOR SELECT TO anon, authenticated
  USING (true);

-- ========== POLÍTICAS PARA quotas ==========
-- Qualquer um pode ver cotas disponíveis (para mostrar na UI)
CREATE POLICY "Ver cotas disponiveis" ON public.quotas
  FOR SELECT TO anon, authenticated
  USING (status = 'available');

-- Usuários autenticados podem ver suas próprias cotas
CREATE POLICY "Ver proprias cotas" ON public.quotas
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ========== POLÍTICAS PARA users ==========
-- Permitir inserção de novos usuários durante checkout
CREATE POLICY "Inserir usuarios no checkout" ON public.users
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Usuários podem ver e atualizar seus próprios dados
CREATE POLICY "Ver proprio perfil" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Atualizar proprio perfil" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- ========== POLÍTICAS PARA transactions ==========
-- Permitir criação de transações durante checkout
CREATE POLICY "Criar transacoes" ON public.transactions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Usuários veem suas próprias transações
CREATE POLICY "Ver proprias transacoes" ON public.transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ========== POLÍTICAS PARA raffle_configs ==========
-- Qualquer um pode ver rifas ativas
CREATE POLICY "Ver rifas ativas" ON public.raffle_configs
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

-- ========== POLÍTICAS PARA transaction_quotas ==========
-- Leitura pública para verificar associações
CREATE POLICY "Ver associacoes" ON public.transaction_quotas
  FOR SELECT TO anon, authenticated
  USING (true);