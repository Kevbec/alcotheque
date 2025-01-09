import { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import QuantityInput from '../inputs/QuantityInput';
import { Bottle } from '../../types/bottle';
import GiftStatusForm from './GiftStatusForm';

interface StatusUpdateFormProps {
  status: 'en_stock' | 'ouverte' | 'consommee' | 'offerte';
  currentQuantity: number;
  onSubmit: (data: { 
    quantity: number; 
    sourceStatus?: 'en_stock' | 'ouverte';
    giftInfo?: { to: string };
  }) => void;
  onCancel: () => void;
  bottle: Bottle;
}

export default function StatusUpdateForm({
  status,
  currentQuantity,
  onSubmit,
  onCancel,
  bottle
}: StatusUpdateFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [sourceStatus, setSourceStatus] = useState<'en_stock' | 'ouverte'>('en_stock');
  const [error, setError] = useState<string | null>(null);

  // Calculer les quantités disponibles
  const openedQuantity = bottle.quantityOpened || 0;
  const stockQuantity = bottle.quantity || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérifier la quantité disponible selon la source
    const availableQuantity = sourceStatus === 'en_stock' ? stockQuantity : openedQuantity;

    if (quantity > availableQuantity) {
      setError(`Quantité insuffisante. Maximum disponible : ${availableQuantity}`);
      return;
    }

    if (availableQuantity <= 0) {
      setError('Aucune bouteille disponible');
      return;
    }

    onSubmit({ quantity, sourceStatus });
  };

  // Si c'est le statut "offerte", utiliser le formulaire dédié
  if (status === 'offerte') {
    return (
      <GiftStatusForm
        currentQuantity={currentQuantity}
        onSubmit={(data) => onSubmit({ ...data })}
        onCancel={onCancel}
      />
    );
  }

  // Si ce n'est pas le statut "finie", utiliser le formulaire standard
  if (status !== 'consommee') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantité
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            disabled={!!error}
          >
            Confirmer
          </button>
        </div>
      </form>
    );
  }

  // Formulaire spécifique pour le statut "finie"
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Source des bouteilles
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSourceStatus('en_stock');
                setQuantity(1);
                setError(null);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                sourceStatus === 'en_stock'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              En stock ({stockQuantity})
            </button>
            <button
              type="button"
              onClick={() => {
                setSourceStatus('ouverte');
                setQuantity(1);
                setError(null);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                sourceStatus === 'ouverte'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Ouvertes ({openedQuantity})
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantité à terminer
          </label>
          <QuantityInput
            value={quantity}
            onChange={(value) => {
              setQuantity(value);
              setError(null);
            }}
            min={1}
            max={sourceStatus === 'en_stock' ? stockQuantity : openedQuantity}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {sourceStatus === 'en_stock' 
              ? `${stockQuantity - quantity} bouteille(s) resteront en stock`
              : `${openedQuantity - quantity} bouteille(s) resteront ouvertes`}
          </p>
        </div>
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
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          disabled={!!error}
        >
          Confirmer
        </button>
      </div>
    </form>
  );
}