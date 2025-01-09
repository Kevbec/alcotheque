import { useState, useEffect } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';
import { useBottleStore } from '../../store/useBottleStore';
import { Bottle } from '../../types/bottle';
import { useModalStore } from '../../store/useModalStore';
import BottleStatusButtons from '../bottles/BottleStatusButtons';
import BottleDetails from '../bottles/BottleDetails';
import BottleHistory from '../bottles/BottleHistory';
import BottleEditForm from '../bottles/BottleEditForm';
import { formatTypeLabel } from '../../utils/formatters';
import { updateBottleQuantities } from '../../utils/bottleUtils';

interface ViewBottleModalProps {
  bottle: Bottle;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewBottleModal({
  bottle,
  isOpen,
  onClose,
}: ViewBottleModalProps) {
  const { updateBottle, deleteBottle } = useBottleStore();
  const { isEditMode, setEditMode } = useModalStore();
  const [currentBottle, setCurrentBottle] = useState<Bottle>(bottle);

  useEffect(() => {
    setCurrentBottle(bottle);
  }, [bottle]);

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bouteille ?')) {
      deleteBottle(bottle.id);
      onClose();
    }
  };

  const handleStatusChange = async (
    newStatus: Bottle['status'],
    data?: {
      quantity?: number;
      historyEntry?: any;
      giftInfo?: { to: string };
    }
  ) => {
    try {
      const updates: Partial<Bottle> = {};

      if (data?.historyEntry) {
        // Cas spécial pour l'ajout au stock
        updates.quantity = data.quantity;
        updates.statusHistory = [
          ...(currentBottle.statusHistory || []),
          data.historyEntry
        ];
      } else {
        // Cas standard pour les autres changements de statut
        const historyEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          newStatus,
          previousStatus: currentBottle.status,
          quantity: data?.quantity,
          giftInfo: data?.giftInfo
        };

        updates.status = newStatus;
        updates.statusHistory = [
          ...(currentBottle.statusHistory || []),
          historyEntry
        ];

        if (data?.quantity) {
          const quantityUpdates = updateBottleQuantities(currentBottle, historyEntry);
          Object.assign(updates, quantityUpdates);
        }
      }

      await updateBottle(bottle.id, updates);
      setCurrentBottle(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating bottle:', error);
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl animate-fadeIn">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentBottle.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatTypeLabel(currentBottle.type)}
                  {currentBottle.year && (
                    <span className="ml-2 text-gray-500 dark:text-gray-500">
                      ({currentBottle.year})
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-start gap-2">
                {!isEditMode && (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-red-400 hover:text-red-500 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isEditMode ? (
              <BottleEditForm
                bottle={currentBottle}
                onSave={(updatedBottle) => {
                  updateBottle(bottle.id, updatedBottle);
                  setCurrentBottle((prev) => ({ ...prev, ...updatedBottle }));
                  setEditMode(false);
                }}
                onCancel={() => setEditMode(false)}
              />
            ) : (
              <div className="flex flex-col space-y-6">
                <BottleStatusButtons
                  currentStatus={currentBottle.status}
                  currentQuantity={currentBottle.quantity}
                  bottle={currentBottle}
                  onStatusChange={handleStatusChange}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BottleDetails
                    bottle={currentBottle}
                    onQuantityChange={(quantity) => {
                      updateBottle(bottle.id, { quantity });
                      setCurrentBottle(prev => ({ ...prev, quantity }));
                    }}
                    editable={true}
                  />
                </div>

                <BottleHistory
                  history={currentBottle.statusHistory}
                  acquisitionDate={currentBottle.acquisitionDate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}