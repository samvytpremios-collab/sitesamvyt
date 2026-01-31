import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Award, Heart } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="py-12 px-4 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 particle-bg opacity-30" />
      
      <div className="container mx-auto relative z-10">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} className="space-y-8">
          {/* Logo e descrição */}
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold gradient-text mb-2 bg-cyan-50">
              SamVyt Prêmios
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Sorteios transparentes e seguros. Participe e concorra a prêmios incríveis 
              com resultados baseados na Loteria Federal.
            </p>
          </div>

          {/* Trust badges inline */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500 font-medium">Site Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-500 font-medium">Loteria Federal</span>
            </div>
          </div>

          {/* Links - Apenas Termos e Privacidade (os outros estão no Header) */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
              Privacidade
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground/70 text-xs">
              © {currentYear} SamVyt Prêmios. Todos os direitos reservados.
            </p>
            <p className="text-muted-foreground/50 text-xs flex items-center justify-center gap-1">
              Feito com <Heart className="w-3 h-3 text-red-500" /> no Brasil
            </p>
          </div>
        </motion.div>
      </div>
    </footer>;
};
export default Footer;