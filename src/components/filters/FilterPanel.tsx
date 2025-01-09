import { Search } from 'lucide-react';
import { useLocationStore } from '../../store/useLocationStore';
import { useBottleStore } from '../../store/useBottleStore';
import { FilterState } from './types';
import TypeFilter from './TypeFilter';
import FavoriteFilter from './FavoriteFilter';
import { getStatusLabel } from '../../utils/statusColors';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'en_stock', label: 'En Stock' },
  { value: 'ouverte', label: 'Ouverte' },
  { value: 'consommee', label: 'Finie' },
  { value: 'offerte', label: 'Offerte' }
];

export default function FilterPanel({ filters, onChange, onClose }: FilterPanelProps) {
  const bottles = useBottleStore((state) => state.bottles);
  
  // Récupérer uniquement les emplacements utilisés
  const usedLocations = Array.from(new Set(bottles.map(b => b.location)));
  
  // Calculer le nombre de bouteilles par emplacement
  const locationCounts = bottles.reduce((acc, bottle) => {
    acc[bottle.location] = (acc[bottle.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <TypeFilter 
        selectedTypes={filters.types}
        onChange={(types) => onChange({ ...filters, types })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Emplacements
        </label>
        <div className="flex flex-wrap gap-2">
          {usedLocations.map((location) => (
            <button
              key={location}
              onClick={() => {
                const newLocations = filters.locations.includes(location)
                  ? filters.locations.filter(l => l !== location)
                  : [...filters.locations, location];
                onChange({ ...filters, locations: newLocations });
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.locations.includes(location)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {location}
              <span className="ml-1 text-xs opacity-75">
                ({locationCounts[location] || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <FavoriteFilter
          value={filters.showFavorites}
          onChange={(showFavorites) => onChange({ ...filters, showFavorites })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Statut
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prix
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
      </div>
    </div>
  );
}