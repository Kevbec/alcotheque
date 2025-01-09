import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types/user';
import { locationService } from '../services/locationService';

interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, firstName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  signUp: async (email: string, password: string, firstName: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Créer le profil utilisateur dans Firestore
      const userProfile: UserProfile = {
        id: user.uid,
        firstName,
        email,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Créer l'emplacement par défaut
      await locationService.addLocation(user.uid, 'Bar');
      
      set({ profile: userProfile });
      
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Charger le profil utilisateur
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      if (profileDoc.exists()) {
        set({ profile: profileDoc.data() as UserProfile });
      }
      
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut(auth);
      set({ user: null, profile: null });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null })
}));

// Écouteur d'état d'authentification
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Charger le profil utilisateur
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    useAuthStore.setState({ 
      user,
      profile: profileDoc.exists() ? profileDoc.data() as UserProfile : null,
      loading: false 
    });
  } else {
    useAuthStore.setState({ user: null, profile: null, loading: false });
  }
});