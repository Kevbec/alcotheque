import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBottleStore } from '../../store/useBottleStore';
import { Bottle } from '../../types/bottle';

interface DataPoint {
  date: string;
  purchasePrice: number;
  estimatedValue: number;
  difference: number;
}

export default function ComparisonChart() {
  const bottles = useBottleStore((state) => state.bottles);

  const getData = (): DataPoint[] => {
    const sortedBottles = [...bottles].sort(
      (a, b) => new Date(a.acquisitionDate).getTime() - new Date(b.acquisitionDate).getTime()
    );

    return sortedBottles.reduce((acc: DataPoint[], bottle: Bottle) => {
      const date = bottle.acquisitionDate.split('T')[0];
      const lastEntry = acc[acc.length - 1];
      
      const purchasePrice = (lastEntry?.purchasePrice || 0) + (bottle.purchasePrice || 0);
      const estimatedValue = (lastEntry?.estimatedValue || 0) + (bottle.estimatedValue || bottle.purchasePrice || 0);
      
      const newEntry = {
        date,
        purchasePrice,
        estimatedValue,
        difference: estimatedValue - purchasePrice
      };

      if (!lastEntry || lastEntry.date !== date) {
        acc.push(newEntry);
      } else {
        acc[acc.length - 1] = newEntry;
      }
      
      return acc;
    }, []);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-sm mb-2">
            {format(parseISO(label), 'dd MMMM yyyy', { locale: fr })}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index} 
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name === 'purchasePrice' ? 'Prix d\'achat : ' :
               entry.name === 'estimatedValue' ? 'Valeur estimée : ' :
               'Plus-value : '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={getData()}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(parseISO(date), 'd MMM', { locale: fr })}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis
            tickFormatter={(value) => `${Math.round(value / 100)}€`}
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => 
              value === 'purchasePrice' ? 'Prix d\'achat' :
              value === 'estimatedValue' ? 'Valeur estimée' :
              'Plus-value'
            }
          />
          <Line
            type="monotone"
            dataKey="purchasePrice"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            name="purchasePrice"
          />
          <Line
            type="monotone"
            dataKey="estimatedValue"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
            name="estimatedValue"
          />
          <Line
            type="monotone"
            dataKey="difference"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            name="difference"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}