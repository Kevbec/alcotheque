import { Star } from 'lucide-react';

interface FavoriteFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function FavoriteFilter({ value, onChange }: FavoriteFilterProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${value
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }
      `}
    >
      <Star className={`w-4 h-4 ${value ? 'fill-yellow-400' : ''}`} />
      Favoris uniquement
    </button>
  );
}