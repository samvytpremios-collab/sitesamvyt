import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import mascotImage from '@/assets/samvyt-mascots.png';
interface IntroAnimationProps {
  onComplete: () => void;
}
const IntroAnimation = ({
  onComplete
}: IntroAnimationProps) => {
  const [stage, setStage] = useState<'mascots' | 'text' | 'complete'>('mascots');
  useEffect(() => {
    const timer1 = setTimeout(() => setStage('text'), 1500);
    const timer2 = setTimeout(() => setStage('complete'), 3000);
    const timer3 = setTimeout(() => onComplete(), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);
  return <AnimatePresence>
      {stage !== 'complete' && <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background" initial={{
      opacity: 1
    }} exit={{
      opacity: 0,
      scale: 1.1
    }} transition={{
      duration: 0.5,
      ease: 'easeInOut'
    }}>
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-primary/30" initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: 0
        }} animate={{
          y: [null, Math.random() * window.innerHeight],
          scale: [0, 1, 0],
          opacity: [0, 0.5, 0]
        }} transition={{
          duration: 3,
          delay: i * 0.1,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />)}
          </div>

          {/* Aurora glow effect */}
          <motion.div className="absolute inset-0" initial={{
        opacity: 0
      }} animate={{
        opacity: 0.3
      }} style={{
        background: 'radial-gradient(ellipse at center, hsl(187 100% 50% / 0.15) 0%, transparent 70%)'
      }} />

          <div className="relative flex flex-col items-center justify-center">
            {/* Mascots */}
            <motion.div initial={{
          scale: 0,
          opacity: 0,
          y: 50
        }} animate={{
          scale: stage === 'mascots' ? 1 : 0.8,
          opacity: 1,
          y: stage === 'text' ? -50 : 0
        }} transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 0.8
        }} className="relative">
              {/* Glow behind mascots */}
              <motion.div className="absolute inset-0 blur-3xl" initial={{
            opacity: 0
          }} animate={{
            opacity: 0.5
          }} transition={{
            delay: 0.5
          }} style={{
            background: 'radial-gradient(circle, hsl(187 100% 50% / 0.3) 0%, transparent 70%)'
          }} />
              
              <motion.img src={mascotImage} alt="SamVyt Mascots" className="w-64 h-auto md:w-80 relative z-10 drop-shadow-2xl" animate={{
            y: [0, -8, 0]
          }} transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }} />
            </motion.div>

            {/* Text reveal */}
            <AnimatePresence>
              {stage === 'text' && <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.5
          }} className="text-center mt-8">
                  
                  <motion.p className="text-xl md:text-2xl text-primary mt-2 font-display text-glow" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.3
            }}>
                    PRÊMIOS
                  </motion.p>
                </motion.div>}
            </AnimatePresence>

            {/* Loading bar */}
            <motion.div className="absolute -bottom-20 w-48 h-1 bg-muted rounded-full overflow-hidden" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }}>
              <motion.div className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full" initial={{
            width: '0%'
          }} animate={{
            width: '100%'
          }} transition={{
            duration: 3,
            ease: 'easeInOut'
          }} />
            </motion.div>
          </div>
        </motion.div>}
    </AnimatePresence>;
};
export default IntroAnimation;