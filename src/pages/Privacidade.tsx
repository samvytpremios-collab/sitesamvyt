import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Footer from '@/components/Footer';

const Privacidade = () => {
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
        
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-medium">LGPD Compliant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Política de <span className="gradient-text">Privacidade</span>
            </h1>
            <p className="text-muted-foreground">
              Última atualização: Janeiro de 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 text-muted-foreground"
          >
            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                1. Informações que Coletamos
              </h2>
              <p>
                Coletamos apenas as informações necessárias para a prestação dos nossos serviços:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Dados de identificação:</strong> Nome completo e CPF</li>
                <li><strong>Dados de contato:</strong> Email e número de WhatsApp</li>
                <li><strong>Dados de transação:</strong> Histórico de compras e pagamentos</li>
                <li><strong>Dados técnicos:</strong> IP, navegador e dados de acesso ao site</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                2. Como Usamos seus Dados
              </h2>
              <p>
                Utilizamos seus dados para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Processar suas compras e reservar seus números</li>
                <li>Enviar confirmações de pagamento e números das cotas</li>
                <li>Notificar sobre resultados de sorteios</li>
                <li>Entrar em contato em caso de premiação</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                3. Compartilhamento de Dados
              </h2>
              <p>
                Seus dados podem ser compartilhados apenas com:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Processadores de pagamento:</strong> Para viabilizar transações PIX</li>
                <li><strong>Serviços de comunicação:</strong> Para envio de emails e mensagens</li>
                <li><strong>Autoridades competentes:</strong> Quando exigido por lei</li>
              </ul>
              <p className="mt-4">
                <strong>Nunca vendemos ou alugamos seus dados pessoais para terceiros.</strong>
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                4. Segurança dos Dados
              </h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger 
                seus dados, incluindo:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Criptografia SSL/TLS em todas as comunicações</li>
                <li>Armazenamento seguro em servidores certificados</li>
                <li>Acesso restrito apenas a funcionários autorizados</li>
                <li>Monitoramento contínuo de segurança</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                5. Seus Direitos (LGPD)
              </h2>
              <p>
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Confirmar a existência de tratamento de seus dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de dados desnecessários</li>
                <li>Revogar consentimento a qualquer momento</li>
                <li>Solicitar portabilidade dos dados</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                6. Retenção de Dados
              </h2>
              <p>
                Mantemos seus dados pelo período necessário para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Prestação dos serviços contratados</li>
                <li>Cumprimento de obrigações legais (mínimo 5 anos para registros fiscais)</li>
                <li>Exercício de direitos em processos judiciais</li>
              </ul>
              <p className="mt-4">
                Após esse período, os dados são anonimizados ou excluídos de forma segura.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                7. Cookies e Tecnologias de Rastreamento
              </h2>
              <p>
                Utilizamos cookies essenciais para o funcionamento do site e cookies de 
                análise para melhorar sua experiência. Você pode gerenciar suas preferências 
                de cookies nas configurações do seu navegador.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                8. Encarregado de Dados (DPO)
              </h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de 
                seus dados pessoais, entre em contato com nosso Encarregado de Proteção 
                de Dados através do email: privacidade@samvyt.com.br
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-card/50 border border-border">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                9. Alterações nesta Política
              </h2>
              <p>
                Esta política pode ser atualizada periodicamente. Alterações significativas 
                serão comunicadas por email. Recomendamos revisar esta página regularmente 
                para estar ciente de quaisquer mudanças.
              </p>
            </section>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacidade;
