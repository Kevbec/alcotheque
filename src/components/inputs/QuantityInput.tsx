import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
}

export default function QuantityInput({ 
  value, 
  onChange, 
  min = 1, 
  max = 99,
  disabled = false,
  label
}: QuantityInputProps) {
  const handleChange = (newValue: number) => {
    if (disabled) return;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <div className={`inline-flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg h-10 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}>
        <button
          type="button"
          onClick={() => handleChange(value - 1)}
          disabled={value <= min || disabled}
          className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Diminuer"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className={`w-12 text-center font-medium ${
          disabled ? 'text-gray-500 dark:text-gray-400' : 'text-blue-900 dark:text-blue-100'
        }`}>
          {value}
        </div>
        
        <button
          type="button"
          onClick={() => handleChange(value + 1)}
          disabled={value >= max || disabled}
          className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Augmenter"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}