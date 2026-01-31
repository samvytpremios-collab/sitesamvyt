import { motion } from 'framer-motion';
import { Shield, Award, Eye, CreditCard } from 'lucide-react';
import { HolographicCard } from '@/components/ui/holographic-card';

const badges = [
  {
    icon: Award,
    title: 'Loteria Federal',
    description: 'Sorteio oficial e auditável',
    color: 'text-amber-500',
  },
  {
    icon: Shield,
    title: 'Pagamento Seguro',
    description: 'Dados 100% protegidos',
    color: 'text-green-500',
  },
  {
    icon: Eye,
    title: 'Transparência Total',
    description: 'Acompanhe tudo em tempo real',
    color: 'text-primary',
  },
  {
    icon: CreditCard,
    title: 'PIX Instantâneo',
    description: 'Confirmação em segundos',
    color: 'text-blue-500',
  },
];

const TrustBadges = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 particle-bg opacity-50" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Por que confiar na <span className="gradient-text">SamVyt Prêmios</span>?
          </h2>
          <p className="text-muted-foreground">
            Transparência e segurança em cada etapa
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <HolographicCard className="h-full">
                <div className="p-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 mx-auto
                                flex items-center justify-center">
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-sm">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
