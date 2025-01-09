import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface PartialConsumptionFormProps {
  currentQuantity: number;
  onSubmit: (consumedQuantity: number) => void;
  onCancel: () => void;
}

export default function PartialConsumptionForm({ 
  currentQuantity, 
  onSubmit, 
  onCancel 
}: PartialConsumptionFormProps) {
  const [consumedQuantity, setConsumedQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = consumedQuantity + delta;
    if (newQuantity >= 1 && newQuantity < currentQuantity) {
      setConsumedQuantity(newQuantity);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Combien de bouteilles avez-vous consommé ?
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => handleQuantityChange(-1)}
          disabled={consumedQuantity <= 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <span className="text-2xl font-semibold min-w-[3ch] text-center">
          {consumedQuantity}
        </span>
        
        <button
          type="button"
          onClick={() => handleQuantityChange(1)}
          disabled={consumedQuantity >= currentQuantity - 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {currentQuantity - consumedQuantity} bouteille(s) resteront en stock
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={() => onSubmit(consumedQuantity)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
}