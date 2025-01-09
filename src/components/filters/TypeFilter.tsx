import { useBottleStore } from '../../store/useBottleStore';
import { SPIRIT_TYPES } from '../../utils/constants';
import { formatTypeLabel } from '../../utils/formatters';

interface TypeFilterProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export default function TypeFilter({ selectedTypes, onChange }: TypeFilterProps) {
  const bottles = useBottleStore((state) => state.bottles);
  
  // Récupérer uniquement les types présents dans l'inventaire
  const availableTypes = Array.from(new Set(bottles.map(b => b.type))).sort();
  
  // Filtrer les types constants pour n'afficher que ceux disponibles
  const filteredTypes = SPIRIT_TYPES.filter(type => 
    availableTypes.includes(type.value)
  );

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onChange(newTypes);
  };

  if (filteredTypes.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Types d'alcool
      </label>
      <div className="flex flex-wrap gap-2">
        {filteredTypes.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleTypeToggle(value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTypes.includes(value)
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
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
  );
}