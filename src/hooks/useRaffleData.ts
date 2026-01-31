import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RaffleConfig {
  id: string;
  name: string;
  prize: string;
  totalQuotas: number;
  pricePerQuota: number;
  drawDate: string;
  drawMethod: string;
  status: string;
}

interface QuotaStats {
  available: number;
  sold: number;
  reserved: number;
  total: number;
}

interface Quota {
  id: string;
  number: string;
  status: string;
}

export function useRaffleData() {
  const [raffle, setRaffle] = useState<RaffleConfig | null>(null);
  const [stats, setStats] = useState<QuotaStats>({ available: 0, sold: 0, reserved: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRaffleData();
  }, []);

  const fetchRaffleData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar configuração da rifa ativa
      const { data: raffleData, error: raffleError } = await supabase
        .from('raffle_configs')
        .select('*')
        .eq('status', 'active')
        .limit(1)
        .single();

      if (raffleError) throw raffleError;

      if (raffleData) {
        setRaffle({
          id: raffleData.id,
          name: raffleData.name,
          prize: raffleData.prize,
          totalQuotas: raffleData.total_quotas,
          pricePerQuota: Number(raffleData.price_per_quota),
          drawDate: raffleData.draw_date,
          drawMethod: raffleData.draw_method,
          status: raffleData.status,
        });

        // Contar cotas por status
        const { count: availableCount } = await supabase
          .from('quotas')
          .select('*', { count: 'exact', head: true })
          .eq('raffle_id', raffleData.id)
          .eq('status', 'available');

        const { count: soldCount } = await supabase
          .from('quotas')
          .select('*', { count: 'exact', head: true })
          .eq('raffle_id', raffleData.id)
          .eq('status', 'sold');

        const { count: reservedCount } = await supabase
          .from('quotas')
          .select('*', { count: 'exact', head: true })
          .eq('raffle_id', raffleData.id)
          .eq('status', 'reserved');

        setStats({
          available: availableCount || 0,
          sold: soldCount || 0,
          reserved: reservedCount || 0,
          total: raffleData.total_quotas,
        });
      }
    } catch (err) {
      console.error('Error fetching raffle data:', err);
      setError('Erro ao carregar dados da rifa');
    } finally {
      setIsLoading(false);
    }
  };

  const selectRandomQuotas = async (quantity: number): Promise<Quota[]> => {
    if (!raffle) return [];

    try {
      // Buscar mais cotas do que o necessário para garantir aleatoriedade
      const fetchLimit = Math.min(quantity * 5, 1000);
      
      const { data, error } = await supabase
        .from('quotas')
        .select('id, number, status')
        .eq('raffle_id', raffle.id)
        .eq('status', 'available')
        .limit(fetchLimit);

      if (error) throw error;
      
      if (!data || data.length < quantity) {
        throw new Error('Cotas insuficientes disponíveis');
      }

      // Embaralhar aleatoriamente e selecionar quantidade desejada
      const shuffled = data.sort(() => Math.random() - 0.5);
      
      return shuffled.slice(0, quantity);
    } catch (err) {
      console.error('Error selecting quotas:', err);
      return [];
    }
  };

  return {
    raffle,
    stats,
    isLoading,
    error,
    selectRandomQuotas,
    refetch: fetchRaffleData,
  };
}
