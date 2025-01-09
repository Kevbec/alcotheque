import { useState, useEffect } from 'react';
import { Bottle } from '../../types/bottle';
import StatusUpdateForm from '../bottles/StatusUpdateForm';

interface QuickStatusUpdateFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  status: Bottle['status'];
  currentQuantity: number;
  initialData?: {
    rating?: number;
    comments?: string;
    quantity?: number;
    giftInfo?: { to?: string };
  };
  onSubmit: (data: {
    rating?: number;
    comments?: string;
    quantity?: number;
    giftInfo?: { to?: string };
  }) => void;
}

export default function QuickStatusUpdateForm({ 
  status, 
  currentQuantity,
  onSubmit, 
  initialData = {},
  ...props 
}: QuickStatusUpdateFormProps) {
  const [giftRecipient, setGiftRecipient] = useState(initialData.giftInfo?.to || '');

  if (status === 'en_stock') return null;
  if (status === 'offerte') {
    return (
      <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Offert à
          </label>
          <input
            type="text"
            value={giftRecipient}
            onChange={(e) => setGiftRecipient(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
            placeholder="Nom du destinataire"
            required
          />
        </div>

        <button
          onClick={() => onSubmit({ giftInfo: { to: giftRecipient.trim() } })}
          disabled={!giftRecipient.trim()}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enregistrer
        </button>
      </div>
    );
  }

  return (
    <StatusUpdateForm
      status={status}
      currentQuantity={currentQuantity}
      initialData={initialData}
      onSubmit={onSubmit}
    />
  );
}