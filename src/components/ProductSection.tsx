import { motion } from 'framer-motion';
import { Star, Shield, Zap, ChevronDown } from 'lucide-react';
import { ShineButton } from '@/components/ui/shine-button';
import iphoneImage from '@/assets/iphone-17-pro.png';
const ProductSection = () => {
  const features = [{
    icon: Zap,
    text: 'Chip A21 Pro'
  }, {
    icon: Star,
    text: 'Câmera 200MP'
  }, {
    icon: Shield,
    text: 'Garantia Apple'
  }];
  return <section className="min-h-screen w-full relative">
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="text-center mb-12">
          <motion.span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-display text-sm mb-6" initial={{
          scale: 0
        }} whileInView={{
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2,
          type: 'spring'
        }}> PRÊMIO EXCLUSIVO</motion.span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
            <span className="gradient-text">iPhone 17 Pro</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">O smartphone mais avançado da Apple pode ser seu por apenas R$1,00</p>
        </motion.div>

        {/* iPhone Display */}
        <motion.div className="relative mb-12" initial={{
        scale: 0.8,
        opacity: 0
      }} whileInView={{
        scale: 1,
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.3,
        duration: 0.8,
        type: 'spring'
      }}>
        {/* iPhone Image */}
          <motion.img src={iphoneImage} alt="iPhone 17 Pro" className="relative w-56 h-auto md:w-72 lg:w-80" animate={{
          y: [0, -10, 0]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />
        </motion.div>

        {/* Features */}
        

        {/* CTA Button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.8
      }} className="flex flex-col items-center gap-6">
          <ShineButton size="xl" onClick={() => {
          document.getElementById('cotas')?.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
            Quero Participar
          </ShineButton>

          {/* Scroll indicator */}
          <motion.div animate={{
          y: [0, 8, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="text-muted-foreground">
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default ProductSection;