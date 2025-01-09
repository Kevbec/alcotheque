import { Wine, Star, Gift, ShoppingCart, MapPin, CircleDollarSign } from 'lucide-react';
import { Bottle } from '../../types/bottle';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useModalStore } from '../../store/useModalStore';

interface BottleCardProps {
  bottle: Bottle;
}

export default function BottleCard({ bottle }: BottleCardProps) {
  const openViewBottleModal = useModalStore((state) => state.openViewBottleModal);

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status: Bottle['status']) => {
    switch (status) {
      case 'en_stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ouverte':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'consommee':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'offerte':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  const getStatusLabel = (status: Bottle['status']) => {
    switch (status) {
      case 'en_stock':
        return 'En Stock';
      case 'ouverte':
        return 'Ouverte';
      case 'consommee':
        return 'Consommée';
      case 'offerte':
        return 'Offerte';
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => openViewBottleModal(bottle)}
    >
      {/* Photo Section */}
      <div className="relative aspect-square">
        {bottle.photo ? (
          <img
            src={bottle.photo}
            alt={bottle.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <Wine className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {bottle.isFavorite && (
          <div className="absolute top-2 right-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(bottle.status)}`}>
            {getStatusLabel(bottle.status)}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div>
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">{bottle.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Wine className="w-4 h-4" />
            <span>{getTypeLabel(bottle.type)}</span>
            {bottle.year && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{bottle.year}</span>
              </>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{bottle.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {formatPrice(bottle.purchasePrice)}
            </span>
          </div>
        </div>

        {/* Origin & Rating Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {bottle.origin === 'cadeau_recu' ? (
              <>
                <Gift className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {bottle.giftInfo?.from || 'Cadeau'}
                </span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(bottle.acquisitionDate), 'dd MMM yyyy', { locale: fr })}
                </span>
              </>
            )}
          </div>
          {bottle.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{bottle.rating}</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {bottle.comments && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {bottle.comments}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}