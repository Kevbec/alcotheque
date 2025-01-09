import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useBottleStore } from '../../store/useBottleStore';
import { ChartDataPoint } from './types';

const COLORS = [
  '#1E40AF', // Bleu foncé
  '#2563EB', // Bleu
  '#3B82F6', // Bleu clair
  '#60A5FA', // Bleu plus clair
  '#93C5FD', // Bleu très clair
  '#BFDBFE', // Bleu pâle
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

export default function BottleTypeChart() {
  const bottles = useBottleStore((state) => state.bottles);

  const data: ChartDataPoint[] = Object.entries(
    bottles.reduce((acc, bottle) => {
      acc[bottle.type] = (acc[bottle.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ 
      name: TYPE_LABELS[name] || name,
      value,
      rawName: name 
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600 dark:text-gray-400">
            {payload[0].value} bouteille{payload[0].value > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={entry.rawName} 
                fill={COLORS[index % COLORS.length]} 
                className="stroke-white dark:stroke-gray-800"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => TYPE_LABELS[value] || value}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}