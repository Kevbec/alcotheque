import { useState } from 'react';
import { X } from 'lucide-react';
import { Bottle } from '../../types/bottle';
import StarRating from '../inputs/StarRating';
import { useBottleStore } from '../../store/useBottleStore';
import PartialConsumptionForm from '../bottles/PartialConsumptionForm';

interface QuickStatusModalProps {
  bottle: Bottle;
  action: 'open' | 'finish';
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickStatusModal({ bottle, action, isOpen, onClose }: QuickStatusModalProps) {
  const updateBottle = useBottleStore((state) => state.updateBottle);
  const [rating, setRating] = useState(bottle.rating || 0);
  const [comment, setComment] = useState(bottle.comments || '');
  const [showPartialConsumption, setShowPartialConsumption] = useState(bottle.quantity > 1);

  const handleSubmit = async (consumedQuantity?: number) => {
    const updates: Partial<Bottle> = {
      rating: rating || undefined,
      comments: comment || undefined,
    };

    if (action === 'open') {
      updates.status = 'ouverte';
      updates.openedDate = new Date();
    } else if (action === 'finish') {
      if (consumedQuantity && bottle.quantity > consumedQuantity) {
        // Mise à jour partielle
        updates.quantity = bottle.quantity - consumedQuantity;
        updates.statusHistory = [
          ...(bottle.statusHistory || []),
          {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            newStatus: 'consommee',
            previousStatus: bottle.status,
            quantity: consumedQuantity
          }
        ];
      } else {
        // Consommation totale
        updates.status = 'consommee';
        updates.finishedDate = new Date();
      }
    }

    await updateBottle(bottle.id, updates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {action === 'open' ? 'Ouvrir la bouteille' : 'Terminer la bouteille'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {action === 'finish' && showPartialConsumption ? (
              <PartialConsumptionForm
                currentQuantity={bottle.quantity}
                onSubmit={(quantity) => handleSubmit(quantity)}
                onCancel={() => setShowPartialConsumption(false)}
              />
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note
                  </label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Commentaire
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors resize-none"
                    placeholder="Ajouter un commentaire..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSubmit()}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
                  >
                    Confirmer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}