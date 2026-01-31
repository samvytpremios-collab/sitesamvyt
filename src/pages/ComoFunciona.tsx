import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ticket, CreditCard, Trophy, Bell, CheckCircle, Award } from 'lucide-react';
import Footer from '@/components/Footer';

const steps = [
  {
    number: 1,
    icon: Ticket,
    title: 'Escolha suas Cotas',
    description: 'Selecione a quantidade de cotas que deseja comprar. Cada cota custa apenas R$ 1,00 e aumenta suas chances de ganhar!',
  },
  {
    number: 2,
    icon: CreditCard,
    title: 'Faça o Pagamento',
    description: 'Pague via PIX de forma rápida e segura. A confirmação é instantânea e seus números são reservados automaticamente.',
  },
  {
    number: 3,
    icon: Bell,
    title: 'Receba seus Números',
    description: 'Após o pagamento, você recebe seus números da sorte por email e WhatsApp. Guarde-os com carinho!',
  },
  {
    number: 4,
    icon: Trophy,
    title: 'Aguarde o Sorteio',
    description: 'O sorteio é realizado com base na Loteria Federal, garantindo total transparência e segurança.',
  },
];

const ComoFunciona = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="container mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 particle-bg" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Como <span className="gradient-text">Funciona</span>?
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Participar é simples, rápido e 100% seguro. Veja o passo a passo completo.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent" />
                )}
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 
                                  flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        Passo {step.number}
                      </span>
                      <h3 className="font-display font-bold text-xl">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loteria Federal Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-medium">Sorteio Oficial</span>
            </div>
            
            <h2 className="text-3xl font-display font-bold mb-4">
              Baseado na <span className="gradient-text">Loteria Federal</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Os resultados são baseados nos números da Loteria Federal, garantindo 
              imparcialidade e transparência total. Você pode conferir os resultados 
              oficiais a qualquer momento.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-bold mb-1">100% Auditável</h4>
                <p className="text-xs text-muted-foreground">Resultados públicos e verificáveis</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-bold mb-1">Sem Manipulação</h4>
                <p className="text-xs text-muted-foreground">Números gerados externamente</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-bold mb-1">Confiança Total</h4>
                <p className="text-xs text-muted-foreground">Milhões confiam na Loteria Federal</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComoFunciona;
