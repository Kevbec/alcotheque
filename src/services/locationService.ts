import { collection, doc, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const locationService = {
  async getLocations(userId: string) {
    if (!db) throw new Error('Firebase non initialisé');
    
    try {
      const locationsRef = collection(db, 'locations');
      const q = query(locationsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des emplacements:', error);
      throw error;
    }
  },

  async addLocation(userId: string, name: string) {
    if (!db) throw new Error('Firebase non initialisé');
    
    try {
      const locationsRef = collection(db, 'locations');
      const docRef = await addDoc(locationsRef, {
        userId,
        name,
        createdAt: new Date().toISOString()
      });
      return {
        id: docRef.id,
        name
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un emplacement:', error);
      throw error;
    }
  },

  async deleteLocation(locationId: string) {
    if (!db) throw new Error('Firebase non initialisé');
    
    try {
      const locationRef = doc(db, 'locations', locationId);
      await deleteDoc(locationRef);
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un emplacement:', error);
      throw error;
    }
  }
};