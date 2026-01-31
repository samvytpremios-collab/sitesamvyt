import { ReactNode, useRef, useState, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'mixed';
  variant?: 'default' | 'bordered' | 'spotlight';
  animate?: boolean;
}

export const CyberCard = ({
  children,
  className,
  glowColor = 'cyan',
  variant = 'default',
  animate = true,
}: CyberCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const glowColors = {
    cyan: 'rgba(0, 217, 255, 0.15)',
    purple: 'rgba(138, 43, 226, 0.15)',
    mixed: 'rgba(0, 217, 255, 0.1)',
  };

  const borderGradients = {
    cyan: 'from-cyan-500/50 via-transparent to-cyan-500/50',
    purple: 'from-purple-500/50 via-transparent to-purple-500/50',
    mixed: 'from-cyan-500/50 via-purple-500/50 to-cyan-500/50',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative group', className)}
    >
      {/* Animated border gradient - only for bordered variant */}
      {variant === 'bordered' && (
        <div
          className={cn(
            'absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            'bg-gradient-to-r',
            borderGradients[glowColor]
          )}
          style={{
            background: isHovered
              ? `conic-gradient(from ${Date.now() / 20}deg, hsl(187 100% 50% / 0.5), hsl(270 60% 50% / 0.5), hsl(187 100% 50% / 0.5))`
              : undefined,
          }}
        />
      )}

      {/* Main card container */}
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden',
          'bg-card/80 backdrop-blur-xl',
          'border border-border/50',
          'shadow-[0_0_30px_rgba(0,217,255,0.05)]',
          'transition-all duration-300',
          'group-hover:border-primary/30',
          'group-hover:shadow-[0_0_40px_rgba(0,217,255,0.1)]'
        )}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/40 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/40 rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/40 rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/40 rounded-br-sm" />

        {/* Spotlight effect - only for spotlight variant */}
        {variant === 'spotlight' && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
            style={{
              background: isHovered
                ? `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, ${glowColors[glowColor]}, transparent 80%)`
                : 'transparent',
            }}
          />
        )}

        {/* Inner glow on top edge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{
              animation: isHovered ? 'scan 2s linear infinite' : 'none',
            }}
          />
        </div>
      </div>

      {/* CSS for scan animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(calc(100% + 200px)); }
        }
      `}</style>
    </motion.div>
  );
};

export default CyberCard;
