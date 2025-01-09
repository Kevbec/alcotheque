import { useState, useEffect } from 'react';
import { Bottle } from '../types/bottle';
import { estimateBottlePrice } from '../services/priceEstimation';

export function useBottlePrice(bottle: Bottle) {
  const [priceEstimation, setPriceEstimation] = useState<Awaited<ReturnType<typeof estimateBottlePrice>> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchEstimation() {
      setIsLoading(true);
      setError(null);
      
      try {
        const estimation = await estimateBottlePrice(bottle);
        if (mounted) {
          setPriceEstimation(estimation);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erreur lors de l\'estimation');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEstimation();

    return () => {
      mounted = false;
    };
  }, [bottle.id]);

  return { priceEstimation, isLoading, error };
}