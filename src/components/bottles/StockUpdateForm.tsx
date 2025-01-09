import { useState } from 'react';
import QuantityInput from '../inputs/QuantityInput';

interface StockUpdateFormProps {
  onSubmit: (data: { quantity: number }) => void;
  onCancel: () => void;
}

export default function StockUpdateForm({ onSubmit, onCancel }: StockUpdateFormProps) {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quantité à ajouter au stock
        </label>
        <QuantityInput
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={99}
        />
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
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
        >
          Confirmer
        </button>
      </div>
    </form>
  );
}