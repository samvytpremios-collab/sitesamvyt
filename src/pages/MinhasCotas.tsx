import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Trophy, LogOut, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuotaTicket from '@/components/QuotaTicket';

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Transaction {
  id: string;
  amount: number;
  quantity: number;
  status: string;
  created_at: string;
  raffle_id: string;
}

interface Quota {
  id: string;
  number: string;
  status: string;
}

const MinhasCotas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [raffleInfo, setRaffleInfo] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Verificar sessão no localStorage
      const sessionData = localStorage.getItem('user_session');
      
      if (!sessionData) {
        navigate('/login');
        return;
      }

      const userSession: UserSession = JSON.parse(sessionData);
      setUser(userSession);

      // Buscar transações do usuário
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userSession.id)
        .order('created_at', { ascending: false });

      if (transError) throw transError;

      setTransactions(transData || []);

      // Buscar cotas do usuário
      const { data: quotasData, error: quotasError } = await supabase
        .from('quotas')
        .select('*')
        .eq('user_id', userSession.id);

      if (quotasError) throw quotasError;

      setQuotas(quotasData || []);

      // Buscar informações da rifa
      if (transData && transData.length > 0) {
        const { data: raffleData, error: raffleError } = await supabase
          .from('raffle_configs')
          .select('*')
          .eq('id', transData[0].raffle_id)
          .single();

        if (!raffleError && raffleData) {
          setRaffleInfo(raffleData);
        }
      }
    } catch (error) {
      console.error('Session error:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Tente fazer login novamente',
        variant: 'destructive',
      });
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast({
      title: 'Logout realizado',
      description: 'Até logo!',
    });
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'A definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/30 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Confirmado
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500 border border-amber-500/30">
            Aguardando Pagamento
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalPaid = transactions
    .filter(t => t.status === 'paid' || t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const paidQuotas = quotas.filter(q => q.status === 'sold' || q.status === 'reserved');
  const quotaNumbers = paidQuotas.map(q => q.number);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* User Header */}
      <div className="border-b border-border/50 py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h2 className="font-display font-bold text-lg">
              Olá, <span className="gradient-text">{user.name.split(' ')[0]}</span>!
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 particle-bg" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-card/50 border border-border"
            >
              <div className="flex items-center gap-3 mb-2">
                <Ticket className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total de Cotas</p>
              </div>
              <p className="text-3xl font-display font-bold gradient-text">
                {quotas.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card/50 border border-border"
            >
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-5 h-5 text-green-500" />
                <p className="text-sm text-muted-foreground">Cotas Pagas</p>
              </div>
              <p className="text-3xl font-display font-bold text-green-500">
                {paidQuotas.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card/50 border border-border"
            >
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-muted-foreground">Total Investido</p>
              </div>
              <p className="text-3xl font-display font-bold text-amber-500">
                {formatCurrency(totalPaid)}
              </p>
            </motion.div>
          </div>

          {/* Raffle Info */}
          {raffleInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg mb-1">
                    {raffleInfo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Prêmio: <span className="text-foreground font-medium">{raffleInfo.prize}</span>
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Sorteio: {formatDate(raffleInfo.draw_date)}</span>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-primary/20 text-primary font-medium">
                      {raffleInfo.draw_method}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quotas Display */}
          {paidQuotas.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                <Ticket className="w-6 h-6 text-primary" />
                Seus Números da Sorte
              </h2>
              <QuotaTicket numbers={quotaNumbers} className="mb-6" />
              <p className="text-sm text-muted-foreground text-center">
                Guarde bem seus números! Boa sorte! 🍀
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-display font-bold mb-2">
                Nenhuma cota confirmada ainda
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete o pagamento para ver seus números da sorte
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Comprar mais cotas
              </button>
            </motion.div>
          )}

          {/* Transactions History */}
          {transactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-display font-bold mb-4">
                Histórico de Compras
              </h2>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-xl bg-card/50 border border-border flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{transaction.quantity} cotas</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold gradient-text mb-1">
                        {formatCurrency(transaction.amount)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default MinhasCotas;
