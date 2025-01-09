import { ArrowUpDown, Star, Pencil, Trash2, Calendar, MapPin, CircleDollarSign, Gift, Package } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';
import { useBottleStore } from '../../store/useBottleStore';
import { formatTypeLabel } from '../../utils/formatters';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bottle, SortField } from '../../types/bottle';

interface MobileBottleListProps {
  bottles: Bottle[];
  sort: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
  onSort: (field: SortField) => void;
}

const MOBILE_HEADERS = [
  { id: 'name' as SortField, label: 'NOM', width: 'flex-1' },
  { id: 'type' as SortField, label: 'TYPE', width: 'flex-1' },
  { id: 'price' as SortField, label: 'PRIX', width: 'flex-1' },
  { id: 'date' as SortField, label: 'DATE', width: 'flex-1' }
] as const;

export default function MobileBottleList({ bottles, sort, onSort }: MobileBottleListProps) {
  const { openViewBottleModal, setEditMode } = useModalStore();
  const { deleteBottle, toggleFavorite } = useBottleStore();

  const handleDelete = (e: React.MouseEvent, bottleId: string) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bouteille ?')) {
      deleteBottle(bottleId);
    }
  };

  const handleEdit = (e: React.MouseEvent, bottle: Bottle) => {
    e.stopPropagation();
    setEditMode(true);
    openViewBottleModal(bottle);
  };

  const handleView = (bottle: Bottle) => {
    setEditMode(false);
    openViewBottleModal(bottle);
  };

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20">
        <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-4 gap-0">
            {MOBILE_HEADERS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onSort(id)}
                className={`flex items-center justify-center gap-1 py-3 px-2 text-xs font-medium uppercase transition-colors ${
                  sort.field === id 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {label}
                <ArrowUpDown className={`h-3 w-3 ${
                  sort.field === id 
                    ? 'text-indigo-500 dark:text-indigo-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottle List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {bottles.map((bottle) => (
          <div 
            key={bottle.id} 
            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => handleView(bottle)}
          >
            <div className="flex gap-3">
              {/* Thumbnail with Favorite */}
              <div className="relative w-16 h-16 flex-shrink-0">
                {bottle.photo ? (
                  <img
                    src={bottle.photo}
                    alt={bottle.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(bottle.id);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-sm"
                >
                  <Star 
                    className={`w-4 h-4 ${
                      bottle.isFavorite
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  {/* First Row: Name and Actions */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {bottle.name}
                        </h3>
                        {bottle.origin === 'cadeau_recu' && (
                          <Gift className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={bottle.status} className="text-[10px] px-1.5 py-0.5" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTypeLabel(bottle.type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium">{bottle.quantity}</span>
                      </div>
                      <button 
                        onClick={(e) => handleEdit(e, bottle)}
                        className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, bottle.id)}
                        className="p-1 text-red-400 hover:text-red-500 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Second Row: Info Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {format(new Date(bottle.acquisitionDate), 'dd/MM/yy', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{bottle.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <CircleDollarSign className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{formatPrice(bottle.purchasePrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}