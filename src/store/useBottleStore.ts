import { create } from 'zustand';
import { bottleService } from '../services/bottleService';
import { Bottle } from '../types/bottle';
import { useAuthStore } from './useAuthStore';

interface BottleStore {
  bottles: Bottle[];
  loading: boolean;
  error: string | null;
  fetchBottles: () => Promise<void>;
  addBottle: (bottle: Omit<Bottle, 'id'>) => Promise<void>;
  updateBottle: (id: string, updates: Partial<Bottle>) => Promise<void>;
  deleteBottle: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

export const useBottleStore = create<BottleStore>((set, get) => ({
  bottles: [],
  loading: false,
  error: null,

  fetchBottles: async () => {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return;

    try {
      set({ loading: true, error: null });
      const bottles = await bottleService.getBottles(userId);
      set({ bottles });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateBottle: async (id, updates) => {
    try {
      set({ loading: true, error: null });

      const existingBottle = get().bottles.find((bottle) => bottle.id === id);
      if (!existingBottle) throw new Error('Bouteille introuvable');

      // Ne créer un historique que si le statut change ou si c'est une modification de stock explicite
      if (updates.statusHistory) {
        // Si statusHistory est fourni, utiliser tel quel (cas des changements de statut)
        await bottleService.updateBottle(id, updates);
      } else if (updates.quantity !== undefined && existingBottle.status === 'en_stock') {
        // Pour les modifications de stock, créer une entrée d'historique uniquement si la quantité change
        const quantityDiff = updates.quantity - existingBottle.quantity;
        if (quantityDiff !== 0) {
          const historyEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            newStatus: 'en_stock',
            previousStatus: 'en_stock',
            quantity: quantityDiff
          };

          await bottleService.updateBottle(id, {
            ...updates,
            statusHistory: [...(existingBottle.statusHistory || []), historyEntry]
          });
        } else {
          await bottleService.updateBottle(id, updates);
        }
      } else {
        // Pour les autres mises à jour, pas d'historique
        await bottleService.updateBottle(id, updates);
      }

      set((state) => ({
        bottles: state.bottles.map((bottle) =>
          bottle.id === id ? { ...bottle, ...updates } : bottle
        ),
      }));

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addBottle: async (bottle) => {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return;

    try {
      set({ loading: true, error: null });
      const newBottle = await bottleService.addBottle(userId, bottle);
      set((state) => ({ bottles: [...state.bottles, newBottle] }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteBottle: async (id) => {
    try {
      set({ loading: true, error: null });
      await bottleService.deleteBottle(id);
      set((state) => ({
        bottles: state.bottles.filter((bottle) => bottle.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (id) => {
    const bottle = get().bottles.find((b) => b.id === id);
    if (!bottle) return;

    try {
      const updates = { isFavorite: !bottle.isFavorite };
      await bottleService.updateBottle(id, updates);
      set((state) => ({
        bottles: state.bottles.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));