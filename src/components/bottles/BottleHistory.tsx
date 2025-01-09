import { Star, Package } from 'lucide-react';
import { StatusHistoryEntry } from '../../types/bottle';
import { formatDate } from '../../utils/dateFormatters';
import StatusBadge from './StatusBadge';

interface BottleHistoryProps {
  history?: StatusHistoryEntry[];
  acquisitionDate: string;
}

export default function BottleHistory({ history = [], acquisitionDate }: BottleHistoryProps) {
  const uniqueHistory = history.reduce((acc: StatusHistoryEntry[], current) => {
    const isDuplicate = acc.some(item => 
      item.date === current.date && 
      item.newStatus === current.newStatus &&
      item.quantity === current.quantity
    );
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);

  const sortedHistory = uniqueHistory.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Historique
      </h4>
      <div className="space-y-3">
        {sortedHistory.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 text-sm animate-fadeIn">
            <div className="mt-0.5 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between min-w-0 gap-1 sm:gap-4">
              <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(entry.date)}
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <StatusBadge status={entry.newStatus} className="whitespace-nowrap" />
                {entry.giftInfo?.to && (
                  <>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      Offert à {entry.giftInfo.to}
                    </span>
                  </>
                )}
                {entry.rating && (
                  <>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{entry.rating}</span>
                    </div>
                  </>
                )}
              </div>
              {entry.quantity && (
                <div className="flex items-center gap-2 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  <Package className="w-4 h-4" />
                  <span>{entry.quantity}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}