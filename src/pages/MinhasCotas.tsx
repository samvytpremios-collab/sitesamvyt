import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Ticket, Calendar, Trophy, Share2, Copy, Check, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

interface QuotaData {
  id: string;
  number: string;
  status: string;
}

interface SessionData {
  user: {
    name: string;
    email: string;
  };
  transaction: {
    amount: number;
    quantity: number;
    status: string;
    created_at: string;
  };
  raffle: {
    name: string;
    prize: string;
    draw_date: string;
    draw_method: string;
  };
  quotas: QuotaData[];
}

const MinhasCotas = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!token) {
        setError('Token de acesso não fornecido.');
        setLoading(false);
        return;
      }

      try {
        // Buscar sessão pelo token
        const { data: session, error: sessionError } = await supabase
          .from('customer_sessions')
          .select('*, users(*)')
          .eq('access_token', token)
          .single();

        if (sessionError || !session) {
          setError('Sessão não encontrada ou expirada.');
          setLoading(false);
          return;
        }

        // Buscar transações do usuário
        const { data: transactions, error: transError } = await supabase
          .from('transactions')
          .select('*, raffle_configs(*)')
          .eq('user_id', session.user_id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (transError || !transactions || transactions.length === 0) {
          setError('Nenhuma transação encontrada.');
          setLoading(false);
          return;
        }

        const transaction = transactions[0];

        // Buscar cotas do usuário
        const { data: quotas, error: quotasError } = await supabase
          .from('quotas')
          .select('*')
          .eq('user_id', session.user_id)
          .eq('transaction_id', transaction.id);

        if (quotasError) {
          console.error('Error fetching quotas:', quotasError);
        }

        // Montar dados da sessão
        const userData = session.users as unknown as { name: string; email: string };
        const raffleData = transaction.raffle_configs as unknown as {
          name: string;
          prize: string;
          draw_date: string;
          draw_method: string;
        };

        setSessionData({
          user: {
            name: userData?.name || 'Participante',
            email: userData?.email || '',
          },
          transaction: {
            amount: transaction.amount,
            quantity: transaction.quantity,
            status: transaction.status,
            created_at: transaction.created_at || '',
          },
          raffle: {
            name: raffleData?.name || 'Sorteio',
            prize: raffleData?.prize || 'Prêmio',
            draw_date: raffleData?.draw_date || '',
            draw_method: raffleData?.draw_method || 'Loteria Federal',
          },
          quotas: quotas || [],
        });
      } catch (err) {
        console.error('Error:', err);
        setError('Erro ao carregar seus dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [token]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minhas Cotas - SamVyt Prêmios',
          text: 'Confira minhas cotas no sorteio!',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'Cole onde quiser para compartilhar.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'A definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/30">
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="py-6 px-4 border-b border-border">
          <div className="container mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o início
            </Link>
          </div>
        </header>
        
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold mb-2">Ops! Algo deu errado</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Ir para o início
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Compartilhar</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 particle-bg" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-2xl relative z-10">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Olá, <span className="gradient-text">{sessionData?.user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-muted-foreground">
              Aqui estão suas cotas para o sorteio
            </p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-card/50 border border-border mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Status do Pedido</h2>
              {getStatusBadge(sessionData?.transaction.status || 'pending')}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Quantidade</p>
                <p className="font-bold text-lg">{sessionData?.transaction.quantity} cotas</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor pago</p>
                <p className="font-bold text-lg gradient-text">
                  {formatCurrency(sessionData?.transaction.amount || 0)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Raffle Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg mb-1">
                  {sessionData?.raffle.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Prêmio: <span className="text-foreground font-medium">{sessionData?.raffle.prize}</span>
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formatDate(sessionData?.raffle.draw_date || '')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{sessionData?.raffle.draw_method}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quotas List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg">Seus Números</h2>
            </div>
            
            {sessionData?.quotas && sessionData.quotas.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {sessionData.quotas.map((quota, index) => (
                  <motion.div
                    key={quota.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.02 }}
                    className="aspect-square rounded-xl bg-card border border-border
                             flex items-center justify-center font-display font-bold
                             text-sm hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    {quota.number.toString().padStart(5, '0')}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-card/50 border border-border text-center">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Seus números serão exibidos aqui após a confirmação do pagamento.
                </p>
              </div>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-8"
          >
            Guarde este link! Você pode acessá-lo a qualquer momento para ver seus números.
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MinhasCotas;
