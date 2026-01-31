import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface StatusCycleButtonProps extends Omit<ButtonProps, 'children'> {
  statuses: string[];
  interval?: number;
  icon?: React.ReactNode;
}

/**
 * StatusCycleButton
 * A button that cycles through different text states with blur animation.
 */
export const StatusCycleButton: React.FC<StatusCycleButtonProps> = ({
  statuses,
  interval = 2500,
  icon,
  className,
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (statuses.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statuses.length);
    }, interval);

    return () => clearInterval(timer);
  }, [statuses.length, interval]);

  return (
    <Button
      className={cn(
        'relative overflow-hidden min-w-[180px]',
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {icon}
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {statuses[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </Button>
  );
};

export default StatusCycleButton;
