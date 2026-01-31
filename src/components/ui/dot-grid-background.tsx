import { useEffect, useRef } from 'react';

interface DotGridBackgroundProps {
  dotSize?: number;
  dotColor?: string;
  backgroundColor?: string;
  gap?: number;
  className?: string;
}

export const DotGridBackground = ({
  dotSize = 1,
  dotColor = 'rgba(0, 217, 255, 0.3)',
  backgroundColor = 'transparent',
  gap = 30,
  className = '',
}: DotGridBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / gap);
      const rows = Math.ceil(canvas.height / gap);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;

          // Calcular distância do mouse
          const dx = mouseX - x;
          const dy = mouseY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          // Tamanho do ponto baseado na distância do mouse
          const scale = Math.max(0, 1 - distance / maxDistance);
          const size = dotSize + scale * 3;

          // Opacidade baseada na distância
          const opacity = 0.3 + scale * 0.7;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = dotColor.replace(/[\d.]+\)$/g, `${opacity})`);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotSize, dotColor, backgroundColor, gap]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
