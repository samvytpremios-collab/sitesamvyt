import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Ticket, Sparkles } from 'lucide-react';
import { ShineButton } from '@/components/ui/shine-button';
import { GlowCard } from '@/components/ui/glow-card';

// Interfaces preparadas para integração com PostgreSQL
interface QuotaPackage {
  id: string;
  quantity: number;
  pricePerUnit: number;
  popular?: boolean;
}
interface PaymentPayload {
  quotaQuantity: number;
  totalAmount: number;
  customerData?: {
    name: string;
    email: string;
    phone: string;
  };
}

// Interface para tabela 'quotas' no banco de dados
export interface Quota {
  id: string;
  raffle_id: string;
  number: number;
  status: 'available' | 'reserved' | 'paid';
  user_id?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

// Interface para tabela 'purchases' no banco de dados
export interface Purchase {
  id: string;
  user_id: string;
  raffle_id: string;
  quantity: number;
  total_amount: number;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_provider: 'infinitypay';
  payment_reference?: string;
  created_at: string;
}
const QUOTA_PACKAGES: QuotaPackage[] = [{
  id: 'pkg_5',
  quantity: 5,
  pricePerUnit: 1.00
}, {
  id: 'pkg_10',
  quantity: 10,
  pricePerUnit: 1.00
}, {
  id: 'pkg_20',
  quantity: 20,
  pricePerUnit: 1.00
}, {
  id: 'pkg_50',
  quantity: 50,
  pricePerUnit: 1.00,
  popular: true
}, {
  id: 'pkg_100',
  quantity: 100,
  pricePerUnit: 1.00
}];
const QuotaSelector = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>('pkg_50');
  const [customQuantity, setCustomQuantity] = useState(1);
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const selectedPackage = QUOTA_PACKAGES.find(p => p.id === selectedPackageId);
  const totalQuotas = isCustom ? customQuantity : selectedPackage?.quantity || 0;
  const totalPrice = totalQuotas * 1.00;
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);
    setIsCustom(false);
  };
  const handleCustomQuantityChange = (value: number) => {
    const newValue = Math.max(1, Math.min(1000, value));
    setCustomQuantity(newValue);
    setIsCustom(true);
    setSelectedPackageId(null);
  };

  // Placeholder para integração com InfinityPay
  const handlePayment = async () => {
    const payload: PaymentPayload = {
      quotaQuantity: totalQuotas,
      totalAmount: totalPrice
    };
    setIsProcessing(true);
    try {
      console.log('Payment payload:', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  return <section id="cotas" className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 particle-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      
    </section>;
};
export default QuotaSelector;