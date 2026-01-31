import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard = ({
  children,
  className,
  hover = true,
  glow = true,
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        // Base glass morphism
        'relative rounded-2xl',
        'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
        'backdrop-blur-xl',
        'border border-white/[0.1]',
        
        // Shadow and depth
        'shadow-[0_8px_32px_0_rgba(0,217,255,0.1)]',
        
        // Hover effects
        hover && [
          'transition-all duration-300',
          'hover:scale-[1.02]',
          'hover:shadow-[0_8px_32px_0_rgba(0,217,255,0.2)]',
          'hover:border-primary/30',
        ],
        
        // Glow effect
        glow && 'before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-primary/20 before:via-transparent before:to-primary/20 before:-z-10 before:blur-sm',
        
        className
      )}
    >
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
