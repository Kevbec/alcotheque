import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBottleStore } from '../../store/useBottleStore';
import { Bottle } from '../../types/bottle';
import { useWindowSize } from '../../hooks/useWindowSize';

type ChartMode = 'quantity' | 'price' | 'value';

interface DataPoint {
  date: string;
  total: number;
  totalPrice?: number;
  totalValue?: number;
}

export default function EvolutionChart() {
  const [mode, setMode] = useState<ChartMode>('quantity');
  const bottles = useBottleStore((state) => state.bottles);
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const getData = (): DataPoint[] => {
    const sortedBottles = [...bottles].sort(
      (a, b) => new Date(a.acquisitionDate).getTime() - new Date(b.acquisitionDate).getTime()
    );

    return sortedBottles.reduce((acc: DataPoint[], bottle: Bottle) => {
      const date = bottle.acquisitionDate.split('T')[0];
      const lastEntry = acc[acc.length - 1];
      
      // Calculer les quantités en fonction du statut
      let quantity = 0;
      if (bottle.status === 'en_stock') {
        quantity = bottle.quantity || 0;
      } else if (bottle.status === 'ouverte') {
        quantity = bottle.quantityOpened || 0;
      }

      // Ne pas ajouter si la quantité est 0
      if (quantity === 0) {
        return acc;
      }

      const purchasePrice = bottle.purchasePrice || 0;
      const estimatedValue = bottle.estimatedValue || purchasePrice;
      
      const newEntry = {
        date,
        total: (lastEntry?.total || 0) + quantity,
        totalPrice: (lastEntry?.totalPrice || 0) + (purchasePrice * quantity),
        totalValue: (lastEntry?.totalValue || 0) + (estimatedValue * quantity)
      };

      if (!lastEntry || lastEntry.date !== date) {
        acc.push(newEntry);
      } else {
        acc[acc.length - 1] = newEntry;
      }
      
      return acc;
    }, []);
  };

  const formatValue = (value: number) => {
    if (mode === 'quantity') {
      return value;
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-sm mb-1">
            {format(parseISO(label), 'dd MMMM yyyy', { locale: fr })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === 'quantity' 
              ? `${value} unité${value > 1 ? 's' : ''}`
              : formatValue(value)
            }
          </p>
        </div>
      );
    }
    return null;
  };

  const getDataKey = () => {
    switch (mode) {
      case 'price':
        return 'totalPrice';
      case 'value':
        return 'totalValue';
      default:
        return 'total';
    }
  };

  const getGradientColors = () => {
    switch (mode) {
      case 'price':
        return { start: '#3B82F6', end: '#1D4ED8' };
      case 'value':
        return { start: '#8B5CF6', end: '#6D28D9' };
      default:
        return { start: '#2563EB', end: '#1E40AF' };
    }
  };

  const colors = getGradientColors();
  const chartData = getData();

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setMode('quantity')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === 'quantity'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Quantité
        </button>
        <button
          onClick={() => setMode('price')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === 'price'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Prix d'Achat
        </button>
        <button
          onClick={() => setMode('value')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === 'value'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Valeur Estimée
        </button>
      </div>

      <div style={{ height: isMobile ? '250px' : '300px', width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.start} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={colors.end} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200 dark:stroke-gray-700" 
            />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'd MMM yyyy', { locale: fr })}
              className="text-gray-600 dark:text-gray-400"
              minTickGap={30}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
            />
            <YAxis
              tickFormatter={(value) => 
                mode === 'quantity' 
                  ? value 
                  : `${new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                      notation: 'compact'
                    }).format(value)}`
              }
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 50 : 60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={getDataKey()}
              stroke={colors.start}
              strokeWidth={2}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}