import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam = ({
  children,
  className,
  duration = 3,
  delay = 0,
  colorFrom = 'rgba(0, 217, 255, 0.8)',
  colorTo = 'rgba(138, 43, 226, 0.8)',
}: BorderBeamProps) => {
  return (
    <div className={cn('relative rounded-2xl', className)}>
      {/* Animated border */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          padding: '2px',
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `conic-gradient(from 0deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
            animation: `spin ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
          }}
        />
        <div className="absolute inset-[2px] rounded-2xl bg-background" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
