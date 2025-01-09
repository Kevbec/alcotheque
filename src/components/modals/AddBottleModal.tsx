import { X } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';
import AddBottleForm from '../bottles/AddBottleForm';

interface AddBottleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhoto?: string;
}

export default function AddBottleModal({ isOpen, onClose, initialPhoto }: AddBottleModalProps) {
  const { bottleRecognitionData, setBottleRecognitionData } = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Ajouter une bouteille
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <AddBottleForm
            initialPhoto={initialPhoto}
            recognitionData={bottleRecognitionData}
            onClose={onClose}
            onSuccess={() => {
              setBottleRecognitionData(null);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}