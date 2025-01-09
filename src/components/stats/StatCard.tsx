import { Trash2, Gift } from 'lucide-react';
import { FullBottleIcon, HalfBottleIcon } from '../icons/BottleIcons';

interface StatCardProps {
  type: 'total' | 'stock' | 'opened' | 'consumed' | 'gifted';
  value: number;
  quantity: number;
}

const statConfig = {
  total: {
    label: 'Total Alcothèque',
    icon: FullBottleIcon,
    color: 'text-indigo-600 dark:text-indigo-400'
  },
  stock: {
    label: 'En Stock',
    icon: FullBottleIcon,
    color: 'text-indigo-500 dark:text-indigo-400'
  },
  opened: {
    label: 'Ouvertes',
    icon: HalfBottleIcon,
    color: 'text-indigo-400 dark:text-indigo-300'
  },
  consumed: {
    label: 'Finies',
    icon: Trash2,
    color: 'text-indigo-300 dark:text-indigo-200'
  },
  gifted: {
    label: 'Offertes',
    icon: Gift,
    color: 'text-indigo-200 dark:text-indigo-100'
  }
};

export default function StatCard({ type, value, quantity }: StatCardProps) {
  const config = statConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 md:flex-col md:items-start">
      <div className={`flex-shrink-0 ${config.color}`}>
        <Icon className="w-6 h-6 md:w-8 md:h-8" />
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 md:mt-2">
          {config.label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-lg md:text-2xl font-semibold mt-0.5 md:mt-1">
            {quantity}
          </p>
          {type !== 'total' && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ({value} réf.)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}