import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, ArrowRight, ArrowLeft, Shield, Award, Clock, Copy, Check, Loader2, Ticket, ExternalLink } from 'lucide-react';
import { ShineButton } from '@/components/ui/shine-button';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import QuotaTicket from '@/components/QuotaTicket';
import { processCheckout } from '@/services/checkout';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  totalPrice: number;
  selectedNumbers?: string[];
  raffleId?: string;
}

const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  phone: z.string().min(10, 'Telefone inválido').max(15),
});

type CustomerData = z.infer<typeof customerSchema>;

type Step = 'dados' | 'resumo' | 'processando' | 'sucesso';

const CheckoutModal = ({ isOpen, onClose, quantity, totalPrice, selectedNumbers = [], raffleId }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('dados');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerData>>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    if (field === 'phone') {
      value = formatPhone(value);
    }
    setCustomerData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep = () => {
    const result = customerSchema.safeParse(customerData);
    if (!result.success) {
      const fieldErrors: Partial<CustomerData> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CustomerData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (step === 'dados') {
      if (!validateStep()) return;
      setStep('resumo');
    } else if (step === 'resumo') {
      if (!raffleId) {
        toast({
          title: 'Erro',
          description: 'Rifa não encontrada',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);
      setStep('processando');

      try {
        const result = await processCheckout({
          raffleId,
          quantity,
          customerData: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone.replace(/\D/g, ''),
          },
          selectedNumbers,
        });

        if (!result.success || !result.paymentLink) {
          throw new Error(result.error || 'Erro ao processar checkout');
        }

        setPaymentLink(result.paymentLink);
        setTransactionId(result.transactionId || '');
        setStep('sucesso');

        toast({
          title: 'Pedido criado!',
          description: 'Redirecionando para pagamento...',
        });

        // Redirecionar para o link de pagamento após 2 segundos
        setTimeout(() => {
          window.open(result.paymentLink, '_blank');
        }, 2000);
      } catch (error) {
        console.error('Checkout error:', error);
        toast({
          title: 'Erro ao processar pedido',
          description: error instanceof Error ? error.message : 'Tente novamente',
          variant: 'destructive',
        });
        setStep('resumo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 'resumo') setStep('dados');
  };

  const handleClose = () => {
    setStep('dados');
    setCustomerData({ name: '', email: '', phone: '' });
    setErrors({});
    setPaymentLink('');
    setTransactionId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={step !== 'processando' ? handleClose : undefined}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-md bg-card border border-border 
                   rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden
                   shadow-[0_-10px_60px_hsl(187_100%_50%_/_0.1)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              {step === 'resumo' && (
                <button
                  onClick={handlePrevStep}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h3 className="font-display font-bold text-lg">
                  {step === 'dados' && 'Seus Dados'}
                  {step === 'resumo' && 'Confirmar Pedido'}
                  {step === 'processando' && 'Processando...'}
                  {step === 'sucesso' && 'Pedido Criado!'}
                </h3>
                {step !== 'sucesso' && step !== 'processando' && (
                  <p className="text-xs text-muted-foreground">
                    Etapa {step === 'dados' ? '1' : '2'} de 2
                  </p>
                )}
              </div>
            </div>
            {step !== 'processando' && (
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {step !== 'sucesso' && step !== 'processando' && (
            <div className="h-1 bg-secondary">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-cyan-400"
                initial={{ width: '50%' }}
                animate={{ 
                  width: step === 'dados' ? '50%' : '100%' 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            <AnimatePresence mode="wait">
              {/* Step 1: Customer Data */}
              {step === 'dados' && (
                <motion.div
                  key="dados"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={customerData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className={`w-full h-12 px-4 rounded-xl bg-secondary border transition-colors
                               focus:outline-none focus:border-primary
                               ${errors.name ? 'border-destructive' : 'border-border'}`}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className={`w-full h-12 px-4 rounded-xl bg-secondary border transition-colors
                               focus:outline-none focus:border-primary
                               ${errors.email ? 'border-destructive' : 'border-border'}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      className={`w-full h-12 px-4 rounded-xl bg-secondary border transition-colors
                               focus:outline-none focus:border-primary
                               ${errors.phone ? 'border-destructive' : 'border-border'}`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Seus dados são protegidos e usados apenas para enviar seus números da sorte.
                  </p>
                </motion.div>
              )}

              {/* Step 2: Summary */}
              {step === 'resumo' && (
                <motion.div
                  key="resumo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Selected Numbers */}
                  {selectedNumbers.length > 0 && (
                    <QuotaTicket numbers={selectedNumbers} className="mb-2" />
                  )}

                  {/* Order Details */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Detalhes do pedido</h4>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantidade</span>
                      <span className="font-medium">{quantity} cotas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor unitário</span>
                      <span className="font-medium">{formatCurrency(totalPrice / quantity)}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-display font-bold text-xl gradient-text">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Dados do comprador</h4>
                    <p className="font-medium">{customerData.name}</p>
                    <p className="text-sm text-muted-foreground">{customerData.email}</p>
                    <p className="text-sm text-muted-foreground">{customerData.phone}</p>
                  </div>

                  {/* Payment Methods */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <h4 className="font-medium text-sm text-muted-foreground mb-3">Formas de pagamento</h4>
                    <div className="flex gap-3">
                      <div className="flex-1 flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <span className="text-green-500 font-bold text-xs">PIX</span>
                        </div>
                        <span className="text-sm font-medium">PIX</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Cartão</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-xs font-medium">Pagamento Seguro</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="text-xs font-medium">Loteria Federal</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Processing */}
              {step === 'processando' && (
                <motion.div
                  key="processando"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <p className="text-lg font-medium">Criando seu pedido...</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Aguarde enquanto reservamos suas cotas e geramos o pagamento
                  </p>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'sucesso' && (
                <motion.div
                  key="sucesso"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col items-center py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                    >
                      <Check className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Pedido Criado!</h3>
                    <p className="text-muted-foreground text-center">
                      Suas cotas foram reservadas. Complete o pagamento para confirmar.
                    </p>
                  </div>

                  {transactionId && (
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Número do pedido</p>
                      <p className="font-mono text-sm">{transactionId}</p>
                    </div>
                  )}

                  {paymentLink && (
                    <a
                      href={paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-xl 
                               bg-primary hover:bg-primary/90 text-primary-foreground font-medium
                               transition-colors shadow-[0_0_20px_hsl(187_100%_50%_/_0.3)]"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Ir para Pagamento
                    </a>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    Você receberá seus números por email e WhatsApp após a confirmação do pagamento.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {step !== 'processando' && step !== 'sucesso' && (
            <div className="p-4 border-t border-border">
              <ShineButton
                size="lg"
                onClick={handleNextStep}
                loading={isLoading}
                className="w-full"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                {step === 'dados' ? 'Continuar' : 'Confirmar Pedido'}
              </ShineButton>
            </div>
          )}

          {step === 'sucesso' && (
            <div className="p-4 border-t border-border">
              <button
                onClick={handleClose}
                className="w-full py-4 rounded-xl bg-secondary hover:bg-secondary/80 
                         font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
