import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroAnimation from '@/components/IntroAnimation';
import ProductSection from '@/components/ProductSection';
import QuotaSelector from '@/components/QuotaSelector';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Product Section - iPhone 17 Pro with Aurora Background */}
          <ProductSection />

          {/* Quota Selector Section */}
          <QuotaSelector />

          {/* Footer */}
          <footer className="py-12 px-4 border-t border-border">
            <div className="container mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-display font-bold gradient-text">
                  SamVyt Prêmios
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Sorteios transparentes e seguros. Participe e concorra a prêmios incríveis.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
                  <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
                  <a href="#" className="hover:text-primary transition-colors">Contato</a>
                </div>
                <p className="text-muted-foreground/50 text-xs pt-4">
                  © 2026 SamVyt Prêmios. Todos os direitos reservados.
                </p>
              </motion.div>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
