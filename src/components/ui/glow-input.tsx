import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const GlowInput = forwardRef<HTMLInputElement, GlowInputProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium flex items-center gap-2">
            {icon}
            {label}
          </label>
        )}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-75 blur transition duration-300" />
          
          {/* Input */}
          <input
            ref={ref}
            className={cn(
              'relative w-full h-12 px-4 rounded-xl',
              'bg-secondary/50 backdrop-blur-sm',
              'border border-border',
              'text-foreground placeholder:text-muted-foreground',
              'transition-all duration-300',
              'focus:outline-none focus:border-primary/50 focus:bg-secondary/70',
              'hover:border-primary/30',
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);

GlowInput.displayName = 'GlowInput';
