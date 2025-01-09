import { MapPin, Gift, Wine } from 'lucide-react';
import { Bottle } from '../../types/bottle';
import BottleRating from './BottleRating';
import QuantityCards from './QuantityCards';
import BottleStatusButtons from './BottleStatusButtons';

interface BottleDetailsProps {
  bottle: Bottle;
  onQuantityChange?: (quantity: number) => void;
  onStatusChange?: (status: Bottle['status'], data?: {
    quantity?: number;
    giftInfo?: { to: string };
  }) => void;
  editable?: boolean;
}

export default function BottleDetails({ 
  bottle, 
  onQuantityChange,
  onStatusChange,
  editable = false 
}: BottleDetailsProps) {
  return (
    <div className="space-y-6">
      {bottle.photo ? (
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img 
            src={bottle.photo} 
            alt={bottle.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Wine className="w-12 h-12 text-gray-400" />
        </div>
      )}

      {editable && onStatusChange && (
        <BottleStatusButtons
          currentStatus={bottle.status}
          currentQuantity={bottle.quantity}
          onStatusChange={onStatusChange}
        />
      )}

      <QuantityCards
        inStock={bottle.quantity}
        opened={bottle.quantityOpened || 0}
        consumed={bottle.quantityConsumed || 0}
        gifted={bottle.quantityGifted || 0}
        purchasePrice={bottle.purchasePrice}
        estimatedValue={bottle.estimatedValue}
        onQuantityChange={onQuantityChange}
        onStatusChange={(newStatus) => onStatusChange?.(newStatus)}
        editable={editable}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Emplacement</div>
            <div className="font-medium">{bottle.location}</div>
          </div>
        </div>

        {bottle.origin === 'cadeau_recu' && bottle.giftInfo?.from && (
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Reçu de</div>
              <div className="font-medium">{bottle.giftInfo.from}</div>
            </div>
          </div>
        )}

        {bottle.status === 'offerte' && bottle.giftInfo?.to && (
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Offert à</div>
              <div className="font-medium">{bottle.giftInfo.to}</div>
            </div>
          </div>
        )}
      </div>

      {(bottle.rating || bottle.comments || bottle.notes) && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
          {bottle.rating && (
            <BottleRating 
              rating={bottle.rating} 
              comments={bottle.comments}
            />
          )}
          {bottle.notes && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Notes</div>
              <div className="text-gray-700 dark:text-gray-300">{bottle.notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}