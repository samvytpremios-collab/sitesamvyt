import { motion } from 'framer-motion';
import { Ticket, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuotaTicketProps {
  numbers: string[];
  isLoading?: boolean;
  className?: string;
}

const QuotaTicket = ({ numbers, isLoading, className }: QuotaTicketProps) => {
  if (numbers.length === 0 && !isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-primary/20 via-secondary to-cyan-500/10",
        "border border-primary/30",
        "p-4",
        className
      )}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary" />
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full" />
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full" />
      
      {/* Dashed line */}
      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-border/50 hidden" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-sm uppercase tracking-widest">
            Seus Números
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>{numbers.length} {numbers.length === 1 ? 'cota' : 'cotas'}</span>
        </div>
      </div>

      {/* Numbers Grid */}
      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-16 h-10 rounded-lg bg-secondary/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
          {numbers.map((number, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, type: 'spring', stiffness: 500 }}
              className="relative group"
            >
              <div
                className="px-3 py-2 rounded-lg bg-secondary/80 border border-border
                         font-display font-bold text-sm text-foreground
                         group-hover:border-primary/50 group-hover:bg-primary/10
                         transition-colors duration-200
                         shadow-sm tracking-wider"
              >
                {number}
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer hint */}
      {numbers.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Números reservados até a confirmação do pagamento
        </p>
      )}
    </motion.div>
  );
};

export default QuotaTicket;
