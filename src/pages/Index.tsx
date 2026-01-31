import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroAnimation from '@/components/IntroAnimation';
import Header from '@/components/Header';
import ProductSection from '@/components/ProductSection';
import QuotaSelector from '@/components/QuotaSelector';
import TrustBadges from '@/components/TrustBadges';
import Footer from '@/components/Footer';
import ProceduralGroundBackground from '@/components/ui/procedural-ground-background';
import TermsNotification from '@/components/TermsNotification';

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
    <div className="min-h-screen relative">
      {/* Global Procedural Background */}
      <ProceduralGroundBackground className="fixed inset-0 -z-10" />

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
          className="relative z-10"
        >
          {/* Global Header */}
          <Header />

          {/* Product Section - iPhone 17 Pro */}
          <ProductSection />

          {/* Quota Selector Section */}
          <QuotaSelector />

          {/* Trust Badges */}
          <TrustBadges />

          {/* Footer */}
          <Footer />

          {/* Terms Notification */}
          <TermsNotification />
        </motion.div>
      )}
    </div>
  );
};

export default Index;
