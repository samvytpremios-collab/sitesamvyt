import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface BentoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  colSpan?: 1 | 2;
  tags?: string[];
  status?: 'active' | 'coming-soon' | 'new';
  children?: React.ReactNode;
  onClick?: () => void;
}

const statusStyles = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  'coming-soon': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  new: 'bg-primary/20 text-primary border-primary/30',
};

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  icon: Icon,
  className,
  colSpan = 1,
  tags,
  status,
  children,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'group relative p-6 rounded-2xl',
        'bg-card/50 backdrop-blur-sm',
        'border border-border/50',
        'transition-all duration-300',
        'hover:border-primary/40',
        'hover:shadow-[0_8px_30px_rgba(0,229,255,0.12)]',
        'cursor-pointer',
        colSpan === 2 && 'md:col-span-2',
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          
          {status && (
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border',
                statusStyles[status]
              )}
            >
              {status === 'coming-soon' ? 'Em breve' : status === 'new' ? 'Novo' : 'Ativo'}
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="text-lg font-display font-bold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg bg-secondary/80 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {children}
      </div>
    </motion.div>
  );
};

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className,
  columns = 3,
}) => {
  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        columnClasses[columns],
        className
      )}
    >
      {children}
    </div>
  );
};

export default BentoGrid;
