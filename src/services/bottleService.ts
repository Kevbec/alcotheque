import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Bottle } from '../types/bottle';
import { toFirestoreData, validateFirestoreData } from '../utils/firestoreHelpers';

class BottleService {
  async getBottles(userId: string): Promise<Bottle[]> {
    if (!db) throw new Error('Firebase non initialisé');

    try {
      const bottlesRef = collection(db, 'bottles');
      const q = query(bottlesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Bottle[];
    } catch (error) {
      console.error('Erreur lors de la récupération des bouteilles:', error);
      throw error;
    }
  }

  async addBottle(userId: string, bottle: Omit<Bottle, 'id'>) {
    if (!db) throw new Error('Firebase non initialisé');

    try {
      const bottlesRef = collection(db, 'bottles');
      const bottleData = toFirestoreData({
        ...bottle,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!validateFirestoreData(bottleData)) {
        throw new Error('Données invalides pour Firestore');
      }

      const docRef = await addDoc(bottlesRef, bottleData);
      return {
        ...bottle,
        id: docRef.id,
      };
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une bouteille:", error);
      throw error;
    }
  }

  async updateBottle(bottleId: string, updates: Partial<Bottle>) {
    if (!db) throw new Error('Firebase non initialisé');

    try {
      const bottleRef = doc(db, 'bottles', bottleId);
      const updateData = toFirestoreData({
        ...updates,
        updatedAt: new Date(),
      });

      if (!validateFirestoreData(updateData)) {
        throw new Error('Données invalides pour Firestore');
      }

      await updateDoc(bottleRef, updateData);
      
      // Vérification de la mise à jour
      const updatedDoc = await getDoc(bottleRef);
      console.log('Document mis à jour:', updatedDoc.data());
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une bouteille:", error);
      throw error;
    }
  }

  async deleteBottle(bottleId: string) {
    if (!db) throw new Error('Firebase non initialisé');

    try {
      const bottleRef = doc(db, 'bottles', bottleId);
      await deleteDoc(bottleRef);
    } catch (error) {
      console.error("Erreur lors de la suppression d'une bouteille:", error);
      throw error;
    }
  }
}

export const bottleService = new BottleService();