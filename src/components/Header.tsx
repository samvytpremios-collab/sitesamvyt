import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Home, Info, HelpCircle, Ticket } from 'lucide-react';
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
            <motion.img alt="SamVyt" className="h-12 w-auto object-contain" whileHover={{
            scale: 1.02
          }} transition={{
            type: 'spring',
            stiffness: 400
          }} src="/lovable-uploads/8f4d108d-e7df-4b33-9fff-4d8f9c152acc.png" />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && <nav className="flex items-center gap-1">
              {mainNavLinks.map(link => <NavLink key={link.to} to={link.to} className="px-4 py-2 rounded-lg text-sm font-heading font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 tracking-wide" activeClassName="text-primary bg-primary/10">
                  {link.label}
                </NavLink>)}
              <NavLink to="/login" className="ml-2 px-4 py-2 rounded-lg text-sm font-heading font-semibold border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 tracking-wide" activeClassName="bg-primary text-primary-foreground">
                <span className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  Minhas Cotas
                </span>
              </NavLink>
            </nav>}

          {/* Mobile Menu Button */}
          {isMobile && <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-12 h-12 hover:bg-primary/10" aria-label="Abrir menu de navegação">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 flex flex-col">
                {/* Header do drawer */}
                <SheetHeader className="p-6 border-b border-border bg-secondary/30">
                  <SheetTitle className="text-left">
                    <img alt="SamVyt" className="h-10 w-auto object-contain" src="/lovable-uploads/9baff3e2-6404-468c-a950-1b1fdff263e6.png" />
                  </SheetTitle>
                </SheetHeader>

                {/* Main Navigation */}
                <nav className="flex-1 flex flex-col p-4 gap-1.5">
                  {mainNavLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return <Link key={link.to} to={link.to} onClick={closeMenu} className={cn('flex items-center gap-3 px-3 py-3 rounded-xl font-heading font-semibold text-sm transition-all duration-200', isActive ? 'bg-primary/15 text-primary border border-primary/40 shadow-[0_0_15px_hsl(187_100%_50%_/_0.15)]' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60')}>
                        <div className={cn('p-2 rounded-lg transition-colors', isActive ? 'bg-primary/20' : 'bg-secondary/50')}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {link.label}
                      </Link>;
              })}

                  {/* Separador com gradiente */}
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-3" />

                  {/* Minhas Cotas - Mais compacto */}
                  <Link to="/login" onClick={closeMenu} className={cn('flex items-center gap-3 px-3 py-3 rounded-xl font-heading font-bold text-sm border transition-all duration-200', location.pathname.startsWith('/login') || location.pathname.startsWith('/minhas-cotas') ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(187_100%_50%_/_0.3)]' : 'border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(187_100%_50%_/_0.2)]')}>
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Ticket className="w-4 h-4" />
                    </div>
                    Minhas Cotas
                  </Link>
                </nav>

                {/* Footer Links */}
                <div className="p-4 border-t border-border bg-secondary/20">
                  <div className="flex items-center justify-center gap-6 text-sm">
                    {footerLinks.map(link => <Link key={link.to} to={link.to} onClick={closeMenu} className="text-muted-foreground hover:text-primary transition-colors font-medium">
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