import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Termos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Content */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 particle-bg" />
        
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Documento Legal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Termos de <span className="gradient-text">Uso</span>
            </h1>
            <p className="text-muted-foreground">
              Última atualização: Janeiro de 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            <div className="space-y-8 text-muted-foreground">
              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  1. Aceitação dos Termos
                </h2>
                <p>
                  Ao acessar e utilizar o site SamVyt Prêmios, você concorda com estes Termos de Uso 
                  e com nossa Política de Privacidade. Se você não concordar com qualquer parte 
                  destes termos, não deverá utilizar nossos serviços.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  2. Elegibilidade
                </h2>
                <p>
                  Para participar dos sorteios, você deve:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Ter 18 anos completos ou mais</li>
                  <li>Possuir CPF válido e regular</li>
                  <li>Residir em território brasileiro</li>
                  <li>Possuir capacidade civil plena</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  3. Funcionamento dos Sorteios
                </h2>
                <p>
                  Os sorteios são realizados com base nos resultados oficiais da Loteria Federal 
                  do Brasil, garantindo total transparência e imparcialidade. O número vencedor 
                  é determinado de acordo com as regras específicas de cada campanha, divulgadas 
                  antes do início das vendas.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  4. Pagamento e Confirmação
                </h2>
                <p>
                  Os pagamentos são processados exclusivamente via PIX. A reserva dos números 
                  só é confirmada após a verificação do pagamento pelo nosso sistema. Pagamentos 
                  não confirmados resultarão na liberação automática dos números para outros 
                  participantes.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  5. Política de Reembolso
                </h2>
                <p>
                  Após a confirmação do pagamento, não são aceitos pedidos de cancelamento ou 
                  reembolso, pois os números já foram reservados em nome do participante. Em 
                  caso de problemas técnicos comprovados, analisaremos cada caso individualmente.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  6. Entrega do Prêmio
                </h2>
                <p>
                  O ganhador será notificado por email e WhatsApp. O prêmio será entregue 
                  em até 48 horas úteis após a confirmação dos dados bancários do ganhador. 
                  É responsabilidade do participante manter seus dados de contato atualizados.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  7. Responsabilidades do Usuário
                </h2>
                <p>
                  O participante é responsável por:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Manter a segurança de seus dados de acesso</li>
                  <li>Verificar suas cotas e números adquiridos</li>
                  <li>Acompanhar os resultados dos sorteios</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  8. Modificações
                </h2>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  Alterações significativas serão comunicadas por email aos participantes 
                  cadastrados. O uso contínuo do serviço após as alterações constitui 
                  aceitação dos novos termos.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-card/50 border border-border">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  9. Contato
                </h2>
                <p>
                  Para dúvidas sobre estes termos, entre em contato através do nosso 
                  WhatsApp ou email de suporte disponíveis na página de contato.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Termos;
