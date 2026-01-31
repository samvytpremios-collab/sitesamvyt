import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ComoFunciona from "./pages/ComoFunciona";
import FAQ from "./pages/FAQ";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import MinhasCotas from "./pages/MinhasCotas";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/login" element={<Login />} />
          <Route path="/minhas-cotas" element={<MinhasCotas />} />
          <Route path="/minhas-cotas/:token" element={<MinhasCotas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
