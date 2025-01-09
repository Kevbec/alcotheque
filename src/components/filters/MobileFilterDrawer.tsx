import { X, Star } from 'lucide-react';
import { useLocationStore } from '../../store/useLocationStore';
import { useBottleStore } from '../../store/useBottleStore';
import { SPIRIT_TYPES } from '../../utils/constants';
import { FilterState, initialFilterState } from './types';
import { formatTypeLabel } from '../../utils/formatters';

interface MobileFilterDrawerProps {
  isOpen: boolean;
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

export default function MobileFilterDrawer({ isOpen, filters, onChange, onClose }: MobileFilterDrawerProps) {
  const bottles = useBottleStore((state) => state.bottles);
  
  // Récupérer uniquement les types présents dans l'inventaire
  const availableTypes = Array.from(new Set(bottles.map(b => b.type))).sort();
  const filteredTypes = SPIRIT_TYPES.filter(type => availableTypes.includes(type.value));

  // Récupérer uniquement les emplacements utilisés
  const usedLocations = Array.from(new Set(bottles.map(b => b.location)));
  
  // Calculer le nombre de bouteilles par emplacement
  const locationCounts = bottles.reduce((acc, bottle) => {
    acc[bottle.location] = (acc[bottle.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Filtres</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Statut */}
          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...filters, status: value })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filters.status === value
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Types */}
          <div>
            <label className="block text-sm font-medium mb-2">Types d'alcool</label>
            <div className="grid grid-cols-2 gap-2">
              {filteredTypes.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    const newTypes = filters.types.includes(value)
                      ? filters.types.filter(t => t !== value)
                      : [...filters.types, value];
                    onChange({ ...filters, types: newTypes });
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filters.types.includes(value)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {formatTypeLabel(value)}
                  <span className="ml-1 text-xs opacity-75">
                    ({bottles.filter(b => b.type === value).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Emplacements */}
          <div>
            <label className="block text-sm font-medium mb-2">Emplacements</label>
            <div className="grid grid-cols-2 gap-2">
              {usedLocations.map(location => (
                <button
                  key={location}
                  onClick={() => {
                    const newLocations = filters.locations.includes(location)
                      ? filters.locations.filter(l => l !== location)
                      : [...filters.locations, location];
                    onChange({ ...filters, locations: newLocations });
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filters.locations.includes(location)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
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

          {/* Favoris */}
          <div>
            <button
              onClick={() => onChange({ ...filters, showFavorites: !filters.showFavorites })}
              className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                filters.showFavorites
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Star className={`w-4 h-4 ${filters.showFavorites ? 'fill-yellow-400' : ''}`} />
              Favoris uniquement
            </button>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium mb-2">Prix</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            onClick={() => onChange(initialFilterState)}
            className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            Réinitialiser les filtres
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
}