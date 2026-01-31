import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, HelpCircle, Ticket, FileText, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import samvytLogo from '@/assets/samvyt-logo.png';
const mainNavLinks = [{
  to: '/',
  label: 'Início',
  icon: Home
}, {
  to: '/como-funciona',
  label: 'Como Funciona',
  icon: Info
}, {
  to: '/faq',
  label: 'FAQ',
  icon: HelpCircle
}];
const footerLinks = [{
  to: '/termos',
  label: 'Termos'
}, {
  to: '/privacidade',
  label: 'Privacidade'
}];
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const closeMenu = () => setIsOpen(false);
  return <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <motion.img 
              src={samvytLogo} 
              alt="SamVyt" 
              className="h-12 w-auto object-contain"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && <nav className="flex items-center gap-1">
              {mainNavLinks.map(link => <NavLink key={link.to} to={link.to} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200" activeClassName="text-primary bg-primary/10">
                  {link.label}
                </NavLink>)}
              <NavLink to="/minhas-cotas" className="ml-2 px-4 py-2 rounded-lg text-sm font-medium border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200" activeClassName="bg-primary text-primary-foreground">
                <span className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  Minhas Cotas
                </span>
              </NavLink>
            </nav>}

          {/* Mobile Menu Button */}
          {isMobile && <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-12 h-12" aria-label="Abrir menu de navegação">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <SheetHeader className="p-6 border-b border-border">
                  <SheetTitle className="text-left">
                    <img 
                      src={samvytLogo} 
                      alt="SamVyt" 
                      className="h-10 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>
                
                {/* Main Navigation */}
                <nav className="flex flex-col p-4 gap-1">
                  {mainNavLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return <Link key={link.to} to={link.to} onClick={closeMenu} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200', isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50')}>
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </Link>;
              })}
                  
                  {/* Minhas Cotas - Destacado */}
                  <Link to="/minhas-cotas" onClick={closeMenu} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mt-2 border transition-all duration-200', location.pathname.startsWith('/minhas-cotas') ? 'bg-primary text-primary-foreground border-primary' : 'border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground')}>
                    <Ticket className="w-5 h-5" />
                    Minhas Cotas
                  </Link>
                </nav>

                {/* Footer Links */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    {footerLinks.map(link => <Link key={link.to} to={link.to} onClick={closeMenu} className="text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>)}
                  </div>
                </div>
              </SheetContent>
            </Sheet>}
        </div>
      </div>
    </header>;
};
export default Header;