import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, ArrowRight, ArrowLeft, Shield, Award, Clock, Copy, Check, QrCode } from 'lucide-react';
import { ShineButton } from '@/components/ui/shine-button';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  totalPrice: number;
}

const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  phone: z.string().min(10, 'Telefone inválido').max(15),
});

type CustomerData = z.infer<typeof customerSchema>;

type Step = 'dados' | 'resumo' | 'pagamento';

const CheckoutModal = ({ isOpen, onClose, quantity, totalPrice }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('dados');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  
  // Mock PIX data - será substituído pela integração real
  const [pixData] = useState({
    code: '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540510.005802BR5925SAMVYT PREMIOS LTDA6009SAO PAULO62070503***6304ABCD',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
  });

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
      setIsLoading(true);
      // Simular criação do pagamento PIX
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setStep('pagamento');
    }
  };

  const handlePrevStep = () => {
    if (step === 'resumo') setStep('dados');
    else if (step === 'pagamento') setStep('resumo');
  };

  const handleCopyPix = async () => {
    await navigator.clipboard.writeText(pixData.code);
    setCopied(true);
    toast({
      title: 'Código PIX copiado!',
      description: 'Cole no app do seu banco para pagar.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep('dados');
    setCustomerData({ name: '', email: '', phone: '' });
    setErrors({});
    onClose();
  };

  const getTimeRemaining = () => {
    const diff = pixData.expiresAt.getTime() - Date.now();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={handleClose}
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
              {step !== 'dados' && (
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
                  {step === 'pagamento' && 'Pagamento PIX'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Etapa {step === 'dados' ? '1' : step === 'resumo' ? '2' : '3'} de 3
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-secondary">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-cyan-400"
              initial={{ width: '33%' }}
              animate={{ 
                width: step === 'dados' ? '33%' : step === 'resumo' ? '66%' : '100%' 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

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
                  {/* Order Details */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantidade</span>
                      <span className="font-medium">{quantity} cotas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor unitário</span>
                      <span className="font-medium">{formatCurrency(1)}</span>
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

              {/* Step 3: PIX Payment */}
              {step === 'pagamento' && (
                <motion.div
                  key="pagamento"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Timer */}
                  <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-amber-500">
                      Expira em {getTimeRemaining()}
                    </span>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-secondary/50 border border-border">
                    <div className="w-48 h-48 bg-background rounded-xl flex items-center justify-center border border-border">
                      <QrCode className="w-32 h-32 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Escaneie o QR Code com o app do seu banco
                    </p>
                  </div>

                  {/* Copy Pix Code */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">
                      Ou copie o código PIX:
                    </p>
                    <button
                      onClick={handleCopyPix}
                      className="w-full p-4 rounded-xl bg-secondary border border-border
                               hover:border-primary/50 transition-colors
                               flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-500">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 text-primary" />
                          <span className="font-medium">Copiar código PIX</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Value Display */}
                  <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground">Valor a pagar</p>
                    <p className="font-display font-bold text-3xl gradient-text">
                      {formatCurrency(totalPrice)}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Após o pagamento, você receberá seus números por email e WhatsApp.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {step !== 'pagamento' ? (
              <ShineButton
                size="lg"
                onClick={handleNextStep}
                loading={isLoading}
                className="w-full"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                {step === 'dados' ? 'Continuar' : 'Gerar PIX'}
              </ShineButton>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-4 rounded-xl bg-secondary hover:bg-secondary/80 
                         font-medium transition-colors"
              >
                Fechar
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
