import { bottleService } from '../services/bottleService';
import { useAuthStore } from './useAuthStore';
import { Bottle, GiftInfo } from '../types/bottle';
import { StateCreator } from 'zustand';

type BottleSet = Parameters<StateCreator<any, any, any, any>>[0];
type BottleGet = ReturnType<StateCreator<any, any, any, any>>;

export async function handleBottleUpdate(
  id: string,
  updates: Partial<Bottle>,
  set: BottleSet
) {
  try {
    set({ loading: true, error: null });
    await bottleService.updateBottle(id, updates);
    
    // Mettre à jour immédiatement le state local
    set(state => ({
      bottles: state.bottles.map(bottle =>
        bottle.id === id ? { ...bottle, ...updates } : bottle
      )
    }));
  } catch (error) {
    set({ error: (error as Error).message });
    throw error;
  } finally {
    set({ loading: false });
  }
}

export async function handleStatusHistoryUpdate(
  id: string,
  newStatus: Bottle['status'],
  data: {
    rating?: number;
    comments?: string;
    giftInfo?: GiftInfo;
  },
  set: BottleSet,
  get: BottleGet
) {
  const bottle = get().bottles.find(b => b.id === id);
  if (!bottle) return;

  const lastHistoryEntry = bottle.statusHistory?.[bottle.statusHistory.length - 1];
  if (lastHistoryEntry?.newStatus === newStatus) {
    try {
      await handleBottleUpdate(id, data, set);
    } catch (error) {
      console.error('Error updating bottle:', error);
      throw error;
    }
    return;
  }

  try {
    const historyEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      newStatus,
      previousStatus: bottle.status,
      ...data
    };

    const updates = {
      status: newStatus,
      ...data,
      statusHistory: [
        ...(bottle.statusHistory || []),
        historyEntry
      ]
    };

    // Mettre à jour immédiatement le state local
    set(state => ({
      bottles: state.bottles.map(b =>
        b.id === id ? { ...b, ...updates } : b
      )
    }));

    // Puis mettre à jour la base de données
    await bottleService.updateBottle(id, updates);
  } catch (error) {
    // En cas d'erreur, revenir à l'état précédent
    set(state => ({
      bottles: state.bottles.map(b =>
        b.id === id ? bottle : b
      ),
      error: (error as Error).message
    }));
    throw error;
  }
}