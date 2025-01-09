import { Bottle, StatusHistoryEntry } from '../types/bottle';

export function updateBottleQuantities(
  bottle: Bottle,
  newEntry: StatusHistoryEntry
): Partial<Bottle> {
  const { quantity = 0, newStatus, previousStatus } = newEntry;

  // Initialiser les mises à jour avec l'historique
  const updates: Partial<Bottle> = {
    status: newStatus,
    statusHistory: [...(bottle.statusHistory || []), newEntry]
  };

  // Gérer les différents cas de changement de statut
  switch (newStatus) {
    case 'en_stock':
      // Ajout au stock
      updates.quantity = (bottle.quantity || 0) + quantity;
      break;

    case 'ouverte':
      // Déduire du stock pour ouvrir des bouteilles
      updates.quantity = Math.max(0, (bottle.quantity || 0) - quantity);
      updates.quantityOpened = (bottle.quantityOpened || 0) + quantity;
      break;

    case 'consommee':
      if (previousStatus === 'en_stock') {
        // Consommation directe depuis le stock
        updates.quantity = Math.max(0, (bottle.quantity || 0) - quantity);
        updates.quantityConsumed = (bottle.quantityConsumed || 0) + quantity;
      } else if (previousStatus === 'ouverte') {
        // Consommation de bouteilles ouvertes
        updates.quantityOpened = Math.max(0, (bottle.quantityOpened || 0) - quantity);
        updates.quantityConsumed = (bottle.quantityConsumed || 0) + quantity;
      }
      break;

    case 'offerte':
      // Déduire du stock pour les bouteilles offertes
      updates.quantity = Math.max(0, (bottle.quantity || 0) - quantity);
      updates.quantityGifted = (bottle.quantityGifted || 0) + quantity;
      break;
  }

  return updates;
}