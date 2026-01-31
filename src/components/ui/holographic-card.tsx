import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const HolographicCard = ({ children, className }: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    card.style.setProperty('--bg-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--bg-y', `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    card.style.setProperty('--x', `50%`);
    card.style.setProperty('--y', `50%`);
    card.style.setProperty('--bg-x', '50%');
    card.style.setProperty('--bg-y', '50%');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'transition-transform duration-100 ease-out',
        'will-change-transform',
        className
      )}
      style={{
        background: 'hsl(var(--card) / 0.9)',
        ['--x' as string]: '50%',
        ['--y' as string]: '50%',
        ['--bg-x' as string]: '50%',
        ['--bg-y' as string]: '50%',
      }}
    >
      {/* Holographic gradient border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: '1px',
          background: 'linear-gradient(120deg, rgba(0, 229, 255, 0.6), rgba(150, 0, 255, 0.6), rgba(255, 150, 0, 0.4), rgba(0, 229, 255, 0.6))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Holographic reflection that follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background: `radial-gradient(
            400px circle at var(--x) var(--y),
            rgba(0, 229, 255, 0.2),
            rgba(150, 0, 255, 0.15) 40%,
            transparent 70%
          )`,
        }}
      />

      {/* Rainbow shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(
            120deg,
            transparent 20%,
            rgba(255, 0, 150, 0.1) 35%,
            rgba(0, 229, 255, 0.15) 50%,
            rgba(150, 0, 255, 0.1) 65%,
            transparent 80%
          )`,
          backgroundPosition: 'var(--bg-x) var(--bg-y)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Inner glow on edges */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-purple-500/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-purple-500/50 rounded-br-lg" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HolographicCard;
