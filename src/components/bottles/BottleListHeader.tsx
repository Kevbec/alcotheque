import { ArrowUpDown } from 'lucide-react';
import { SortField } from '../../types/bottle';
import { useWindowSize } from '../../hooks/useWindowSize';

interface BottleListHeaderProps {
  onSort: (field: SortField) => void;
  sortConfig: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
}

const COLUMN_HEADERS = [
  { id: 'favorite', label: 'FAVORI', sortable: false, className: 'w-12' },
  { id: 'name', label: 'NOM', sortable: true, className: 'min-w-[200px]' },
  { id: 'type', label: 'TYPE', sortable: true, className: 'min-w-[120px]' },
  { id: 'status', label: 'STATUT', sortable: false, className: 'w-24' },
  { id: 'quantity', label: 'QTÉ', sortable: false, className: 'w-16 text-center' },
  { id: 'location', label: 'EMPLACEMENT', sortable: true, className: 'min-w-[150px]' },
  { id: 'gift', label: 'CADEAU', sortable: false, className: 'w-24 text-center' },
  { id: 'price', label: 'PRIX', sortable: true, className: 'w-32 text-right' },
  { id: 'rating', label: 'NOTE', sortable: false, className: 'w-24 text-center' },
  { id: 'actions', label: 'ACTIONS', sortable: false, className: 'w-24 text-right' }
] as const;

export default function BottleListHeader({ onSort, sortConfig }: BottleListHeaderProps) {
  const { width } = useWindowSize();
  const isMobile = width < 640;

  if (isMobile) {
    return null;
  }

  const renderSortableHeader = (id: string, label: string, className: string) => (
    <th 
      key={id}
      scope="col" 
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
    >
      <button
        className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        onClick={() => onSort(id as SortField)}
      >
        {label}
        <ArrowUpDown className={`h-4 w-4 ${
          sortConfig.field === id 
            ? 'text-indigo-500 dark:text-indigo-400' 
            : 'text-gray-400 dark:text-gray-500'
        }`} />
      </button>
    </th>
  );

  const renderHeader = ({ id, label, sortable, className }: typeof COLUMN_HEADERS[number]) => {
    return sortable ? (
      renderSortableHeader(id, label, className)
    ) : (
      <th 
        key={id}
        scope="col" 
        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
      >
        {label}
      </th>
    );
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
      <tr>
        {COLUMN_HEADERS.map(header => renderHeader(header))}
      </tr>
    </thead>
  );
}