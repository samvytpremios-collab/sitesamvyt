import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: 'Como sei que o sorteio é justo?',
    answer: 'Nossos sorteios são baseados nos resultados oficiais da Loteria Federal do Brasil, garantindo total transparência e imparcialidade. Qualquer pessoa pode verificar os resultados no site oficial da Caixa Econômica Federal.',
  },
  {
    question: 'Como recebo meu prêmio?',
    answer: 'O prêmio é depositado diretamente na conta bancária informada pelo ganhador via PIX ou transferência. Entraremos em contato por WhatsApp e email para confirmar os dados e realizar o pagamento em até 48 horas úteis.',
  },
  {
    question: 'Posso escolher meus próprios números?',
    answer: 'Atualmente, os números são selecionados de forma aleatória pelo sistema para garantir imparcialidade. Você escolhe a quantidade de cotas e o sistema distribui números únicos automaticamente.',
  },
  {
    question: 'Qual o prazo de pagamento do PIX?',
    answer: 'O PIX gerado tem validade de 30 minutos. Após esse período, você precisará gerar um novo código. A confirmação do pagamento é instantânea e seus números são reservados automaticamente.',
  },
  {
    question: 'Como cancelo minha compra?',
    answer: 'Após a confirmação do pagamento, não é possível cancelar a compra, pois os números já foram reservados em seu nome. Em caso de problemas com o pagamento, entre em contato conosco.',
  },
  {
    question: 'Posso participar de qualquer lugar do Brasil?',
    answer: 'Sim! A participação é aberta para maiores de 18 anos de qualquer estado brasileiro. Basta ter um CPF válido e uma forma de pagamento via PIX.',
  },
  {
    question: 'Como acompanho meus números?',
    answer: 'Após o pagamento, você recebe um link exclusivo por email e WhatsApp para acessar seus números a qualquer momento. Também enviamos lembretes antes do sorteio.',
  },
  {
    question: 'O site é seguro?',
    answer: 'Sim! Utilizamos criptografia SSL de ponta a ponta, seus dados de pagamento são processados por gateways certificados, e nunca armazenamos informações sensíveis do seu cartão.',
  },
  {
    question: 'Existe limite de cotas por pessoa?',
    answer: 'Você pode comprar até 1000 cotas por transação. Se desejar mais, basta realizar novas compras. Não há limite total por pessoa.',
  },
  {
    question: 'O que acontece se ninguém ganhar?',
    answer: 'Sempre há um ganhador! O prêmio é entregue ao participante cujo número mais se aproximar do resultado da Loteria Federal, seguindo regras claras divulgadas antes do sorteio.',
  },
];

const FAQ = () => {
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

      {/* Content */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 particle-bg" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Central de Ajuda</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Perguntas <span className="gradient-text">Frequentes</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas sobre como participar dos nossos sorteios.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-xl px-4 bg-card/50 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center p-6 rounded-2xl bg-card/50 border border-border"
          >
            <h3 className="font-display font-bold text-lg mb-2">
              Não encontrou sua dúvida?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Entre em contato conosco pelo WhatsApp que responderemos rapidamente.
            </p>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl 
                       bg-green-500 hover:bg-green-600 text-white font-medium
                       transition-colors"
            >
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
