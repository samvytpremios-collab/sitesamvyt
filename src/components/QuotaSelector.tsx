import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Shuffle, ShoppingCart, Check, TrendingUp, Loader2 } from 'lucide-react';
import { SolidButton } from '@/components/ui/solid-button';
import { CyberCard } from '@/components/ui/cyber-card';
import CheckoutModal from '@/components/CheckoutModal';
import QuotaTicket from '@/components/QuotaTicket';
import { useRaffleData } from '@/hooks/useRaffleData';

const QUICK_ADD_OPTIONS = [5, 10, 20, 50, 100];
const MIN_QUOTAS = 1;
const MAX_QUOTAS = 1000;

const QuotaSelector = () => {
  const { raffle, stats, isLoading: isLoadingRaffle, selectRandomQuotas } = useRaffleData();
  const [quantity, setQuantity] = useState(10);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

  const pricePerQuota = raffle?.pricePerQuota || 1;
  const totalPrice = quantity * pricePerQuota;

  // Limitar quantidade ao disponível
  const maxAvailable = Math.min(stats.available, MAX_QUOTAS);

  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, maxAvailable));
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, MIN_QUOTAS));
  };

  const handleQuickAdd = (amount: number) => {
    setQuantity(prev => Math.min(prev + amount, maxAvailable));
  };

  const handleSelectQuotas = async () => {
    setIsSelecting(true);
    setSelectedNumbers([]);
    
    try {
      const quotas = await selectRandomQuotas(quantity);
      const numbers = quotas.map(q => q.number);
      
      // Animar a adição dos números um a um
      for (let i = 0; i < numbers.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        setSelectedNumbers(prev => [...prev, numbers[i]]);
      }
    } catch (error) {
      console.error('Erro ao selecionar cotas:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  // Atualizar números selecionados quando quantidade mudar
  useEffect(() => {
    if (selectedNumbers.length > quantity) {
      setSelectedNumbers(prev => prev.slice(0, quantity));
    }
  }, [quantity, selectedNumbers.length]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Calcular porcentagem vendida
  const soldPercentage = stats.total > 0 
    ? Math.round(((stats.sold + stats.reserved) / stats.total) * 100) 
    : 0;

  if (isLoadingRaffle) {
    return (
      <section id="cotas" className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="cotas" className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Subtle overlay effects - main background is global */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2 tracking-wide">
            Selecione suas Cotas
          </h2>
          <p className="text-muted-foreground text-lg">
            Cada cota custa apenas{' '}
            <span className="text-primary font-semibold">{formatCurrency(pricePerQuota)}</span>
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Cotas disponíveis</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(stats.available)} de {formatNumber(stats.total)}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${soldPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              {soldPercentage}% das cotas já foram vendidas
            </p>
          </div>
        </motion.div>

        {/* Mode Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Shuffle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Seleção aleatória</span>
          </div>
        </motion.div>

        {/* Quantity Counter */}
        <CyberCard variant="bordered" glowColor="cyan" className="mb-6 p-6">
          <div className="flex flex-col items-center py-6">
            <div className="flex items-center justify-center gap-6">
              {/* Decrement Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrement}
                disabled={quantity <= MIN_QUOTAS}
                className="w-14 h-14 rounded-full bg-secondary hover:bg-secondary/80 
                         flex items-center justify-center transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         border border-border hover:border-primary/50"
              >
                <Minus className="w-6 h-6 text-foreground" />
              </motion.button>

              {/* Quantity Display */}
              <div className="flex flex-col items-center min-w-[120px]">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={quantity}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="text-6xl font-display font-black gradient-text tracking-wider"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <span className="text-muted-foreground text-sm uppercase tracking-wider mt-1">
                  {quantity === 1 ? 'cota' : 'cotas'}
                </span>
              </div>

              {/* Increment Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrement}
                disabled={quantity >= maxAvailable}
                className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 
                         flex items-center justify-center transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-[0_0_20px_hsl(187_100%_50%_/_0.3)]"
              >
                <Plus className="w-6 h-6 text-primary-foreground" />
              </motion.button>
            </div>

            {/* Quick input */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">ou digite:</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || MIN_QUOTAS;
                  setQuantity(Math.min(Math.max(val, MIN_QUOTAS), maxAvailable));
                }}
                className="w-20 h-8 text-center bg-secondary border border-border rounded-lg 
                         text-foreground font-medium focus:outline-none focus:border-primary
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={MIN_QUOTAS}
                max={maxAvailable}
              />
            </div>
          </div>
        </CyberCard>

        {/* Quick Add Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {QUICK_ADD_OPTIONS.map((amount, index) => (
            <motion.button
              key={amount}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAdd(amount)}
              disabled={quantity + amount > maxAvailable}
              className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 
                       border border-border hover:border-primary/50
                       font-medium text-sm transition-all duration-200
                       hover:shadow-[0_0_15px_hsl(187_100%_50%_/_0.2)]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-primary">+</span>{amount}
            </motion.button>
          ))}
        </motion.div>

        {/* Select Random Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectQuotas}
            disabled={isSelecting || stats.available === 0}
            className="w-full py-4 rounded-xl bg-secondary/50 hover:bg-secondary
                     border border-border hover:border-primary/50
                     flex items-center justify-center gap-3
                     transition-all duration-300
                     disabled:opacity-70"
          >
            {isSelecting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Selecionando números...</span>
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  Selecionar <span className="text-primary font-bold">{quantity}</span> cotas aleatórias
                </span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Selected Numbers Ticket */}
        <AnimatePresence>
          {selectedNumbers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <QuotaTicket numbers={selectedNumbers} isLoading={isSelecting} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Summary */}
        <CyberCard variant="spotlight" glowColor="mixed" className="mb-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg tracking-wide">Resumo do Pedido</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantidade</span>
                <span className="font-medium">{quantity} {quantity === 1 ? 'cota' : 'cotas'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preço unitário</span>
                <span className="font-medium">{formatCurrency(pricePerQuota)}</span>
              </div>
              {selectedNumbers.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Números selecionados</span>
                  <span className="font-medium text-primary">{selectedNumbers.length}</span>
                </div>
              )}
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-display font-bold text-2xl gradient-text">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </CyberCard>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SolidButton
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full"
            size="lg"
            variant="primary"
            disabled={stats.available === 0}
          >
            <ShoppingCart className="w-5 h-5" />
            {selectedNumbers.length > 0 ? 'Comprar estas Cotas' : 'Finalizar Compra'}
          </SolidButton>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>{raffle?.drawMethod || 'Loteria Federal'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-500" />
            <span>Transparência total</span>
          </div>
        </motion.div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        quantity={quantity}
        totalPrice={totalPrice}
        selectedNumbers={selectedNumbers}
        raffleId={raffle?.id}
      />
    </section>
  );
};

export default QuotaSelector;
