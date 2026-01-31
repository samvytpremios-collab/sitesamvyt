import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SolidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const SolidButton = forwardRef<HTMLButtonElement, SolidButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30',
      secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
      success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-xl font-semibold',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:scale-[1.02] active:scale-[0.98]',
          
          // Variant
          variants[variant],
          
          // Size
          sizes[size],
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SolidButton.displayName = 'SolidButton';
