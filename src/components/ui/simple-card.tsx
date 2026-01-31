import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SimpleCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const SimpleCard = ({
  children,
  className,
  hover = false,
}: SimpleCardProps) => {
  return (
    <div
      className={cn(
        // Base styles - dark theme futurista
        'rounded-2xl',
        'bg-card/80 backdrop-blur-xl',
        'border border-border/50',
        'shadow-[0_0_30px_rgba(0,217,255,0.05)]',
        
        // Hover effect (opcional)
        hover && [
          'transition-all duration-300',
          'hover:shadow-[0_0_40px_rgba(0,217,255,0.1)]',
          'hover:border-primary/30',
        ],
        
        className
      )}
    >
      {children}
    </div>
  );
};
