import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useBottleStore } from '../../store/useBottleStore';
import { ChartDataPoint } from './types';
import { useWindowSize } from '../../hooks/useWindowSize';

const COLORS = [
  '#1E3A8A', // Bleu très foncé
  '#1E40AF',
  '#1D4ED8',
  '#2563EB',
  '#3B82F6',
  '#60A5FA',
  '#93C5FD',
  '#BFDBFE',
  '#2B4C9B',
  '#2D5AC7',
  '#3670E5',
  '#4B83F0',
  '#6B9EF5',
  '#8BB8FA',
  '#ADC9FF',
  '#1B365D',
  '#234584',
  '#2C57AA',
  '#3569D0',
  '#4A7DE6',
  '#6495F3',
  '#7EABFF'
];

const TYPE_LABELS: Record<string, string> = {
  'rhum': 'Rhum',
  'whisky': 'Whisky',
  'gin': 'Gin',
  'vodka': 'Vodka',
  'tequila': 'Tequila',
  'cognac': 'Cognac',
  'armagnac': 'Armagnac',
  'calvados': 'Calvados',
  'eau_de_vie': 'Eau de Vie',
  'absinthe': 'Absinthe',
  'liqueurs': 'Liqueurs',
  'pastis': 'Pastis',
  'schnaps': 'Schnaps',
  'grappa': 'Grappa',
  'chartreuse': 'Chartreuse',
  'vin_rouge': 'Vin Rouge',
  'vin_blanc': 'Vin Blanc',
  'vin_rose': 'Vin Rosé',
  'vin_petillant': 'Vin Pétillant',
  'champagne': 'Champagne',
  'prosecco': 'Prosecco',
  'cava': 'Cava',
  'biere': 'Bière',
  'cidre': 'Cidre',
  'hydromel': 'Hydromel',
  'sake': 'Saké',
  'bitter': 'Bitter',
  'ratafia': 'Ratafia',
  'limoncello': 'Limoncello'
};

type DistributionMode = 'type' | 'location';

export default function DistributionChart() {
  const [mode, setMode] = useState<DistributionMode>('type');
  const bottles = useBottleStore((state) => state.bottles);
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const getData = (): ChartDataPoint[] => {
    // Créer un dictionnaire pour stocker les quantités par type/emplacement
    const quantities: Record<string, number> = {};

    // Parcourir toutes les bouteilles et ajouter les quantités en stock et ouvertes
    bottles.forEach(bottle => {
      const key = mode === 'type' ? bottle.type : bottle.location;
      
      // Initialiser la quantité si nécessaire
      if (!quantities[key]) {
        quantities[key] = 0;
      }

      // Ajouter la quantité en stock si elle existe
      if (bottle.status === 'en_stock' && bottle.quantity > 0) {
        quantities[key] += bottle.quantity;
      }

      // Ajouter la quantité ouverte si elle existe
      if (bottle.status === 'ouverte' && bottle.quantityOpened) {
        quantities[key] += bottle.quantityOpened;
      }
    });

    // Convertir le dictionnaire en tableau de points de données
    return Object.entries(quantities)
      .map(([key, value]) => ({
        name: mode === 'type' ? TYPE_LABELS[key] || key : key,
        value,
        rawName: key
      }))
      .filter(entry => entry.value > 0) // Ne garder que les entrées avec une quantité positive
      .sort((a, b) => b.value - a.value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600 dark:text-gray-400">
            {payload[0].value} unité{payload[0].value > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;

    return (
      <div className={`
        ${isMobile ? 'mt-4 grid grid-cols-2 gap-2' : 'space-y-2'} 
        max-h-[300px] overflow-y-auto pr-2
      `}>
        {payload.map((entry: any, index: number) => (
          <div 
            key={entry.value} 
            className="flex items-center gap-2"
          >
            <div 
              className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: entry.color }}
            >
              {entry.payload.value}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const chartData = getData();

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setMode('type')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === 'type'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Par Type
        </button>
        <button
          onClick={() => setMode('location')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === 'location'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Par Emplacement
        </button>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4 gap-4'}`}>
        <div className={`relative ${isMobile ? 'h-[200px]' : 'h-[300px] col-span-2'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isMobile ? 70 : 100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={entry.rawName || entry.name} 
                    fill={COLORS[index % COLORS.length]} 
                    className="stroke-white dark:stroke-gray-800"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${isMobile ? '' : 'col-span-2'}`}>
          <CustomLegend 
            payload={chartData.map((entry, index) => ({
              value: entry.name,
              color: COLORS[index % COLORS.length],
              payload: entry
            }))}
          />
        </div>
      </div>
    </div>
  );
}