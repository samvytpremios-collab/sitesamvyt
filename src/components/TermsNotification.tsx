import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'samvyt_terms_accepted';

const TermsNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(STORAGE_KEY);
    if (!hasAccepted) {
      // Small delay to not interrupt intro animation
      const timer = setTimeout(() => setIsVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl" />
          
          {/* Main card */}
          <div className="relative bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-5 shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground">
                Termos de Uso
              </h3>
            </div>

            {/* Content */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Ao continuar navegando, você concorda com nossos{' '}
              <Link 
                to="/termos" 
                className="text-primary hover:underline font-medium"
              >
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link 
                to="/privacidade" 
                className="text-primary hover:underline font-medium"
              >
                Política de Privacidade
              </Link>.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-primary-foreground font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              >
                Aceitar e Continuar
              </Button>
              <Link to="/termos">
                <Button variant="outline" size="sm" className="text-xs">
                  Ler mais
                </Button>
              </Link>
            </div>

            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-b-2xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsNotification;
