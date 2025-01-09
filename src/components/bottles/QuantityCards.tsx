import { Package, Wine, Gift, Trash2 } from 'lucide-react';
import { determineBottleStatus } from '../../utils/statusUtils';
import { useEffect } from 'react';
import { Bottle } from '../../types/bottle';

interface QuantityCardsProps {
  inStock: number;
  opened: number;
  consumed: number;
  gifted: number;
  purchasePrice?: number;
  estimatedValue?: number;
  onQuantityChange?: (field: 'quantity' | 'quantityOpened' | 'quantityConsumed' | 'quantityGifted', value: number) => void;
  onStatusChange?: (status: Bottle['status']) => void;
  editable?: boolean;
}

export default function QuantityCards({
  inStock,
  opened,
  consumed,
  gifted,
  purchasePrice,
  estimatedValue,
  onQuantityChange,
  onStatusChange,
  editable = false
}: QuantityCardsProps) {
  const totalBottles = inStock + opened + consumed + gifted;

  useEffect(() => {
    if (onStatusChange) {
      const newStatus = determineBottleStatus({ inStock, opened, consumed, gifted });
      onStatusChange(newStatus);
    }
  }, [inStock, opened, consumed, gifted, onStatusChange]);

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const QuantityDisplay = ({ 
    icon: Icon, 
    label, 
    value, 
    color 
  }: { 
    icon: typeof Package; 
    label: string; 
    value: number; 
    color: string;
  }) => (
    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${color}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        <span className="text-xs sm:text-sm font-medium text-white">{label}</span>
      </div>
      <span className="text-base sm:text-lg font-bold text-white">{value}</span>
    </div>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <QuantityDisplay
          icon={Wine}
          label="En stock"
          value={inStock}
          color="bg-blue-900 dark:bg-blue-800"
        />
        <QuantityDisplay
          icon={Package}
          label="Ouvertes"
          value={opened}
          color="bg-blue-800 dark:bg-blue-700"
        />
        <QuantityDisplay
          icon={Trash2}
          label="Finies"
          value={consumed}
          color="bg-blue-700 dark:bg-blue-600"
        />
        <QuantityDisplay
          icon={Gift}
          label="Offertes"
          value={gifted}
          color="bg-blue-600 dark:bg-blue-500"
        />
      </div>

      {(purchasePrice !== undefined || estimatedValue !== undefined) && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {purchasePrice !== undefined && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3">
              <div className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                Prix d'achat
              </div>
              <p className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatPrice(purchasePrice)}
              </p>
            </div>
          )}

          {estimatedValue !== undefined && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3">
              <div className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                Valeur estimée
              </div>
              <p className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatPrice(estimatedValue)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}