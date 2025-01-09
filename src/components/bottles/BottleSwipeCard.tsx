import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bottle, BottleConsumptionStatus } from '../../types/bottle';
import { Wine, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useModalStore } from '../../store/useModalStore';
import QuickStatusModal from '../modals/QuickStatusModal';

interface BottleSwipeCardProps {
  bottle: Bottle;
  onStatusChange: (status: BottleConsumptionStatus) => void;
}

export default function BottleSwipeCard({ bottle, onStatusChange }: BottleSwipeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: bottle.id });

  const { openViewBottleModal, openQuickStatusModal } = useModalStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status: Bottle['status']) => {
    switch (status) {
      case 'ouverte':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'consommee':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getStatusLabel = (status: Bottle['status']) => {
    switch (status) {
      case 'ouverte':
        return 'Ouverte';
      case 'consommee':
        return 'Consommée';
      default:
        return 'En stock';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing"
      onClick={() => openViewBottleModal(bottle)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold mb-1">{bottle.name}</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Wine className="w-4 h-4 mr-1" />
              <span>
                {format(bottle.acquisitionDate, 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
          {bottle.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium">{bottle.rating}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bottle.status)}`}>
            {getStatusLabel(bottle.status)}
          </span>
          
          {bottle.status !== 'en_stock' && bottle.openedDate && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Ouvert le {format(bottle.openedDate, 'dd/MM/yyyy', { locale: fr })}
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          {bottle.status === 'en_stock' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickStatusModal(bottle, 'open');
              }}
              className="flex-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
            >
              Ouvrir
            </button>
          )}
          {bottle.status === 'ouverte' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickStatusModal(bottle, 'finish');
              }}
              className="flex-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}