import { Bottle } from '../types/bottle';

export function determineBottleStatus(quantities: {
  inStock: number;
  opened: number;
  consumed: number;
  gifted: number;
}): Bottle['status'] {
  const { inStock, opened, consumed, gifted } = quantities;

  // Règle #1: S'il y a du stock, le statut est TOUJOURS "en_stock"
  if (inStock > 0) {
    return 'en_stock';
  }

  // Règle #2: S'il n'y a plus de stock, déterminer le statut en fonction des quantités
  const statusQuantities = [
    { status: 'ouverte' as const, quantity: opened },
    { status: 'consommee' as const, quantity: consumed },
    { status: 'offerte' as const, quantity: gifted }
  ];

  // Trouver le statut avec la plus grande quantité
  const maxStatus = statusQuantities.reduce((max, current) => 
    current.quantity > max.quantity ? current : max
  );

  return maxStatus.quantity > 0 ? maxStatus.status : 'en_stock';
}

// Fonction utilitaire pour vérifier si une mise à jour de statut est valide
export function validateStatusUpdate(
  currentQuantities: {
    inStock: number;
    opened: number;
    consumed: number;
    gifted: number;
  },
  newStatus: Bottle['status'],
  quantity: number
): boolean {
  // Vérifier si la quantité à modifier est valide
  const totalQuantity = currentQuantities.inStock + 
    currentQuantities.opened + 
    currentQuantities.consumed + 
    currentQuantities.gifted;

  // La quantité à modifier ne doit pas dépasser le total disponible
  if (quantity > totalQuantity) {
    return false;
  }

  // Si il reste du stock, seul le statut "en_stock" est valide
  if (currentQuantities.inStock > 0) {
    return newStatus === 'en_stock';
  }

  return true;
}