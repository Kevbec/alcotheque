import { useState } from 'react';
import { Gift } from 'lucide-react';
import QuantityInput from '../inputs/QuantityInput';

interface GiftStatusFormProps {
  currentQuantity: number;
  onSubmit: (data: {
    quantity: number;
    giftInfo: { to: string };
  }) => void;
  onCancel: () => void;
}

export default function GiftStatusForm({
  currentQuantity,
  onSubmit,
  onCancel
}: GiftStatusFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [recipient, setRecipient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      quantity,
      giftInfo: { to: recipient.trim() }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
        <Gift className="w-5 h-5" />
        <span className="font-medium">Offrir des bouteilles</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quantité à offrir
        </label>
        <QuantityInput
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={currentQuantity}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {currentQuantity - quantity} bouteille(s) resteront en stock
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Destinataire
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          placeholder="Nom du destinataire"
          required
          autoFocus
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
          disabled={!recipient.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmer
        </button>
      </div>
    </form>
  );
}