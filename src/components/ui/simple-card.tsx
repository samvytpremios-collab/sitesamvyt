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
        // Base styles - minimalista
        'rounded-2xl',
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800',
        'shadow-sm',
        
        // Hover effect (opcional)
        hover && [
          'transition-all duration-200',
          'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700',
        ],
        
        className
      )}
    >
      {children}
    </div>
  );
};
