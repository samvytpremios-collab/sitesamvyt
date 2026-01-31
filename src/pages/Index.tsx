import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroAnimation from '@/components/IntroAnimation';
import Header from '@/components/Header';
import ProductSection from '@/components/ProductSection';
import QuotaSelector from '@/components/QuotaSelector';
import TrustBadges from '@/components/TrustBadges';
import Footer from '@/components/Footer';


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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
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
          {/* Global Header */}
          <Header />

          {/* Product Section - iPhone 17 Pro with Aurora Background */}
          <ProductSection />

          {/* Quota Selector Section */}
          <QuotaSelector />

          {/* Trust Badges */}
          <TrustBadges />

          {/* Footer */}
          <Footer />
        </motion.div>
      )}
    </div>
  );
};

export default Index;
