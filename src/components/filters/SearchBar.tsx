import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Rechercher",
  className = ''
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
      <input
        type="text"
        className="w-full h-12 pl-11 pr-9 text-base border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder:text-gray-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}