import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Shuffle, ShoppingCart, Sparkles, Check } from 'lucide-react';
import { ShineButton } from '@/components/ui/shine-button';
import { GlowCard } from '@/components/ui/glow-card';
import CheckoutModal from '@/components/CheckoutModal';
const QUICK_ADD_OPTIONS = [5, 10, 20, 50, 100];
const PRICE_PER_QUOTA = 1.00;
const MIN_QUOTAS = 1;
const MAX_QUOTAS = 1000;
const QuotaSelector = () => {
  const [quantity, setQuantity] = useState(10);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const totalPrice = quantity * PRICE_PER_QUOTA;
  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, MAX_QUOTAS));
  };
  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, MIN_QUOTAS));
  };
  const handleQuickAdd = (amount: number) => {
    setQuantity(prev => Math.min(prev + amount, MAX_QUOTAS));
  };
  const handleSelectQuotas = async () => {
    setIsSelecting(true);
    // Simular seleção aleatória
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSelecting(false);
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  return <section id="cotas" className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 particle-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-md">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
            Selecione suas Cotas
          </h2>
          <p className="text-muted-foreground text-lg">
            Cada cota custa apenas <span className="text-primary font-semibold">{formatCurrency(PRICE_PER_QUOTA)}</span>
          </p>
        </motion.div>

        {/* Mode Badge */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Shuffle className="w-4 h-4 text-primary" />
            
          </div>
        </motion.div>

        {/* Quantity Counter */}
        <GlowCard selected className="mb-6">
          <div className="flex flex-col items-center py-6">
            <div className="flex items-center justify-center gap-6">
              {/* Decrement Button */}
              <motion.button whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }} onClick={handleDecrement} disabled={quantity <= MIN_QUOTAS} className="w-14 h-14 rounded-full bg-secondary hover:bg-secondary/80 
                         flex items-center justify-center transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         border border-border hover:border-primary/50">
                <Minus className="w-6 h-6 text-foreground" />
              </motion.button>

              {/* Quantity Display */}
              <div className="flex flex-col items-center min-w-[120px]">
                <AnimatePresence mode="popLayout">
                  <motion.span key={quantity} initial={{
                  opacity: 0,
                  y: -20,
                  scale: 0.8
                }} animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0.8
                }} className="text-6xl font-display font-bold gradient-text">
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <span className="text-muted-foreground text-sm uppercase tracking-wider mt-1">
                  {quantity === 1 ? 'cota' : 'cotas'}
                </span>
              </div>

              {/* Increment Button */}
              <motion.button whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }} onClick={handleIncrement} disabled={quantity >= MAX_QUOTAS} className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 
                         flex items-center justify-center transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-[0_0_20px_hsl(187_100%_50%_/_0.3)]">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </motion.button>
            </div>

            {/* Quick input */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">ou digite:</span>
              <input type="number" value={quantity} onChange={e => {
              const val = parseInt(e.target.value) || MIN_QUOTAS;
              setQuantity(Math.min(Math.max(val, MIN_QUOTAS), MAX_QUOTAS));
            }} className="w-20 h-8 text-center bg-secondary border border-border rounded-lg 
                         text-foreground font-medium focus:outline-none focus:border-primary
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min={MIN_QUOTAS} max={MAX_QUOTAS} />
            </div>
          </div>
        </GlowCard>

        {/* Quick Add Chips */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="flex flex-wrap justify-center gap-2 mb-6">
          {QUICK_ADD_OPTIONS.map((amount, index) => <motion.button key={amount} initial={{
          opacity: 0,
          scale: 0.8
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.05
        }} whileHover={{
          scale: 1.05,
          y: -2
        }} whileTap={{
          scale: 0.95
        }} onClick={() => handleQuickAdd(amount)} className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 
                       border border-border hover:border-primary/50
                       font-medium text-sm transition-all duration-200
                       hover:shadow-[0_0_15px_hsl(187_100%_50%_/_0.2)]">
              <span className="text-primary">+</span>{amount}
            </motion.button>)}
        </motion.div>

        {/* Select Random Button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mb-6">
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={handleSelectQuotas} disabled={isSelecting} className="w-full py-4 rounded-xl bg-secondary/50 hover:bg-secondary
                     border border-border hover:border-primary/50
                     flex items-center justify-center gap-3
                     transition-all duration-300
                     disabled:opacity-70">
            {isSelecting ? <>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Selecionando números...</span>
              </> : <>
                <Shuffle className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  Selecionar <span className="text-primary font-bold">{quantity}</span> cotas aleatórias
                </span>
              </>}
          </motion.button>
        </motion.div>

        {/* Order Summary */}
        <GlowCard className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg">Resumo do Pedido</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantidade</span>
                <span className="font-medium">{quantity} {quantity === 1 ? 'cota' : 'cotas'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preço unitário</span>
                <span className="font-medium">{formatCurrency(PRICE_PER_QUOTA)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-display font-bold text-2xl gradient-text">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* CTA Button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }}>
          <ShineButton size="xl" onClick={() => setIsCheckoutOpen(true)} className="w-full" icon={<ShoppingCart className="w-5 h-5" />}>
            Finalizar Compra
          </ShineButton>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>Loteria Federal</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>Transparência total</span>
          </div>
        </motion.div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} quantity={quantity} totalPrice={totalPrice} />
    </section>;
};
export default QuotaSelector;