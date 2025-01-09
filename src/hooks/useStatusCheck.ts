import { useEffect } from 'react';
import { useBottleStore } from '../store/useBottleStore';
import { determineBottleStatus } from '../utils/statusUtils';
import { Bottle } from '../types/bottle';

export function useStatusCheck() {
  const { bottles, updateBottle } = useBottleStore();

  useEffect(() => {
    bottles.forEach((bottle) => {
      const correctStatus = determineBottleStatus({
        inStock: bottle.quantity,
        opened: bottle.quantityOpened || 0,
        consumed: bottle.quantityConsumed || 0,
        gifted: bottle.quantityGifted || 0
      });

      if (bottle.status !== correctStatus) {
        updateBottle(bottle.id, { status: correctStatus });
      }
    });
  }, [bottles]);
}