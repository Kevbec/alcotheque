import { useState } from 'react';
import { Bottle } from '../../types/bottle';
import { FullBottleIcon, HalfBottleIcon } from '../icons/BottleIcons';
import StatusUpdateForm from './StatusUpdateForm';
import StockUpdateForm from './StockUpdateForm';
import { Trash2, Gift } from 'lucide-react';

const statusConfig = [
  { 
    status: 'en_stock' as const, 
    icon: FullBottleIcon,
    mobileLabel: 'Stock',
    desktopLabel: 'En Stock',
    color: 'bg-indigo-600 hover:bg-indigo-700 text-white'
  },
  { 
    status: 'ouverte' as const, 
    icon: HalfBottleIcon,
    mobileLabel: 'Ouverte',
    desktopLabel: 'Ouverte',
    color: 'bg-indigo-500 hover:bg-indigo-600 text-white'
  },
  { 
    status: 'consommee' as const, 
    icon: Trash2,
    mobileLabel: 'Finie',
    desktopLabel: 'Consommée',
    color: 'bg-indigo-400 hover:bg-indigo-500 text-white'
  },
  { 
    status: 'offerte' as const, 
    icon: Gift,
    mobileLabel: 'Offerte',
    desktopLabel: 'Offerte',
    color: 'bg-indigo-300 hover:bg-indigo-400 text-white'
  }
];

interface BottleStatusButtonsProps {
  currentStatus: Bottle['status'];
  currentQuantity: number;
  bottle: Bottle;
  onStatusChange: (status: Bottle['status'], data?: {
    quantity?: number;
    historyEntry?: any;
    giftInfo?: { to: string };
  }) => void;
}

export default function BottleStatusButtons({ 
  currentStatus, 
  currentQuantity,
  bottle,
  onStatusChange 
}: BottleStatusButtonsProps) {
  const [selectedStatus, setSelectedStatus] = useState<Bottle['status'] | null>(null);

  const handleSubmit = (data: {
    quantity?: number;
    giftInfo?: { to: string };
  }) => {
    if (selectedStatus) {
      if (selectedStatus === 'en_stock' && data.quantity) {
        // Pour l'ajout au stock, on crée une entrée d'historique avec la quantité ajoutée
        const historyEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          newStatus: 'en_stock',
          previousStatus: 'en_stock',
          quantity: data.quantity
        };

        onStatusChange(selectedStatus, {
          quantity: currentQuantity + data.quantity,
          historyEntry
        });
      } else {
        // Pour les autres statuts, on utilise le comportement existant
        onStatusChange(selectedStatus, data);
      }
      setSelectedStatus(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        {statusConfig.map(({ status, icon: Icon, mobileLabel, desktopLabel, color }) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`
              flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-2 rounded-lg text-sm font-medium transition-colors
              ${currentStatus === status
                ? `${color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-indigo-600 dark:ring-indigo-400`
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] sm:text-xs whitespace-nowrap">
              {window.innerWidth < 640 ? mobileLabel : desktopLabel}
            </span>
          </button>
        ))}
      </div>

      {selectedStatus && (
        <div className="px-4">
          {selectedStatus === 'en_stock' ? (
            <StockUpdateForm
              onSubmit={handleSubmit}
              onCancel={() => setSelectedStatus(null)}
            />
          ) : (
            <StatusUpdateForm
              status={selectedStatus}
              currentQuantity={currentQuantity}
              bottle={bottle}
              onSubmit={handleSubmit}
              onCancel={() => setSelectedStatus(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}