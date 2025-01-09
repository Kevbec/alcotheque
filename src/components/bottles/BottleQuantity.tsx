import { Package } from 'lucide-react';
import QuantityInput from '../inputs/QuantityInput';

interface BottleQuantityProps {
  quantity: number;
  onUpdate?: (quantity: number) => void;
  editable?: boolean;
}

export default function BottleQuantity({ quantity, onUpdate, editable = false }: BottleQuantityProps) {
  if (editable && onUpdate) {
    return (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantité
          </div>
          <QuantityInput value={quantity} onChange={onUpdate} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Package className="w-5 h-5 text-gray-400" />
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Quantité</div>
        <div className="font-medium">{quantity}</div>
      </div>
    </div>
  );
}