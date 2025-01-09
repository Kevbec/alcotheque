import { Trash2 } from 'lucide-react';
import { FilterState } from './types';

interface MobileFilterActionsProps {
  onClose: () => void;
  onReset: () => void;
}

export default function MobileFilterActions({ onClose, onReset }: MobileFilterActionsProps) {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
      <button
        onClick={onReset}
        className="w-full py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Réinitialiser les filtres
      </button>
      <button
        onClick={onClose}
        className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        Appliquer les filtres
      </button>
    </div>
  );
}