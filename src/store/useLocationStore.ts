import { create } from 'zustand';
import { locationService } from '../services/locationService';
import { useAuthStore } from './useAuthStore';

interface Location {
  id: string;
  name: string;
}

interface LocationStore {
  locations: Location[];
  loading: boolean;
  error: string | null;
  fetchLocations: () => Promise<void>;
  addLocation: (name: string) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  locations: [],
  loading: false,
  error: null,

  fetchLocations: async () => {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return;

    try {
      set({ loading: true, error: null });
      const locations = await locationService.getLocations(userId);
      set({ locations });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addLocation: async (name: string) => {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return;

    try {
      set({ loading: true, error: null });
      const newLocation = await locationService.addLocation(userId, name);
      set(state => ({
        locations: [...state.locations, newLocation]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeLocation: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await locationService.deleteLocation(id);
      set(state => ({
        locations: state.locations.filter(location => location.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));