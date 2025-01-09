import { Star, Pencil, Trash2, Gift, Package } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bottle } from '../../types/bottle';
import { useModalStore } from '../../store/useModalStore';
import { useBottleStore } from '../../store/useBottleStore';
import { formatTypeLabel } from '../../utils/formatters';
import StatusBadge from './StatusBadge';

interface BottleListItemProps {
  bottle: Bottle;
}

export default function BottleListItem({ bottle }: BottleListItemProps) {
  const { openViewBottleModal, setEditMode } = useModalStore();
  const { deleteBottle, toggleFavorite } = useBottleStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bouteille ?')) {
      deleteBottle(bottle.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(true);
    openViewBottleModal(bottle);
  };

  const handleView = () => {
    setEditMode(false);
    openViewBottleModal(bottle);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(bottle.id);
  };

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
      onClick={handleView}
    >
      <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
        <button
          onClick={handleToggleFavorite}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Star 
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              bottle.isFavorite
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-400 dark:text-gray-600'
            }`}
          />
        </button>
      </td>
      
      <td className="px-2 sm:px-4 py-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {bottle.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {bottle.year || ''}
        </div>
      </td>
      
      <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {formatTypeLabel(bottle.type)}
        </div>
      </td>
      
      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm">
        <StatusBadge status={bottle.status} />
      </td>
      
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
          <Package className="w-4 h-4 text-gray-400" />
          {bottle.quantity}
        </div>
      </td>
      
      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {bottle.location}
        </div>
      </td>

      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
        {bottle.origin === 'cadeau_recu' ? (
          <div className="flex flex-col items-center">
            <Gift className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            {bottle.giftInfo?.from && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {bottle.giftInfo.from}
              </div>
            )}
          </div>
        ) : null}
      </td>
      
      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {formatPrice(bottle.purchasePrice)}
        </div>
        {bottle.estimatedValue && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Est: {formatPrice(bottle.estimatedValue)}
          </div>
        )}
      </td>
      
      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
        {bottle.rating ? (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm text-gray-900 dark:text-gray-100">
              {bottle.rating}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        )}
      </td>
      
      <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
        <div className="flex justify-end gap-1 sm:gap-2">
          <button onClick={handleEdit} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}