import { useState } from 'react';
import { isDate } from 'date-fns';
import { Bottle, SortField } from '../../types/bottle';
import BottleCard from './BottleCard';
import BottleListItem from './BottleListItem';
import BottleListHeader from './BottleListHeader';
import MobileBottleList from './MobileBottleList';
import { useWindowSize } from '../../hooks/useWindowSize';

interface BottleListProps {
  bottles: Bottle[];
  viewMode: 'list' | 'grid';
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function BottleList({ bottles, viewMode }: BottleListProps) {
  const [sort, setSort] = useState<SortConfig>({ field: 'date', direction: 'desc' });
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const ensureDate = (date: Date | string): Date => {
    if (isDate(date)) return date;
    return new Date(date);
  };

  const sortedBottles = [...bottles].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    
    switch (sort.field) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'type':
        return direction * a.type.localeCompare(b.type);
      case 'location':
        return direction * a.location.localeCompare(b.location);
      case 'price':
        const priceA = a.purchasePrice || 0;
        const priceB = b.purchasePrice || 0;
        return direction * (priceA - priceB);
      case 'date':
        return direction * (ensureDate(a.acquisitionDate).getTime() - ensureDate(b.acquisitionDate).getTime());
      default:
        return 0;
    }
  });

  const toggleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (!bottles || bottles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Aucune bouteille dans l'inventaire.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    if (isMobile) {
      return (
        <MobileBottleList 
          bottles={sortedBottles} 
          sort={sort} 
          onSort={toggleSort} 
        />
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="max-h-[calc(100vh-16rem)] overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <BottleListHeader onSort={toggleSort} sortConfig={sort} />
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedBottles.map((bottle) => (
                <BottleListItem key={bottle.id} bottle={bottle} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedBottles.map((bottle) => (
        <BottleCard key={bottle.id} bottle={bottle} />
      ))}
    </div>
  );
}