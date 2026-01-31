import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Ticket } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { GlowInput } from '@/components/ui/glow-input';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha email e senha',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Buscar usuário pelo email
      const { data: users, error: userError } = await supabase
        .table('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .limit(1);

      if (userError) throw userError;

      if (!users || users.length === 0) {
        toast({
          title: 'Usuário não encontrado',
          description: 'Email não cadastrado',
          variant: 'destructive',
        });
        return;
      }

      const user = users[0];

      // Verificar senha (comparação simples - em produção use bcrypt)
      if (user.phone !== password) {
        toast({
          title: 'Senha incorreta',
          description: 'Verifique sua senha e tente novamente',
          variant: 'destructive',
        });
        return;
      }

      // Salvar sessão no localStorage
      localStorage.setItem('user_session', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));

      toast({
        title: 'Login realizado!',
        description: `Bem-vindo, ${user.name}!`,
      });

      // Redirecionar para minhas cotas
      navigate('/minhas-cotas');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Acessar Minhas Cotas
          </h1>
          <p className="text-muted-foreground">
            Entre com seu email e telefone para ver suas cotas
          </p>
        </div>

        {/* Form Card */}
        <GlassCard className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <GlowInput
              type="email"
              label="Email"
              icon={<Mail className="w-4 h-4 text-primary" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
            />

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Senha (seu telefone)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-secondary border border-border 
                           focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground 
                           hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use o telefone cadastrado na compra como senha
              </p>
            </div>

            {/* Submit Button */}
            <ShimmerButton
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-6 text-lg font-bold"
            >
              <span className="flex items-center gap-3">
                {isLoading ? 'Entrando...' : 'Acessar Minhas Cotas'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </span>
            </ShimmerButton>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Ainda não tem cotas?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-primary hover:underline font-medium"
              >
                Comprar agora
              </button>
            </p>
          </div>
        </GlassCard>

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Em caso de dúvidas, entre em contato pelo WhatsApp
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
