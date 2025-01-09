import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useBottleStore } from '../../store/useBottleStore';
import { ChartDataPoint } from './types';

const COLORS = [
  '#0D4B8C', // Bleu marine
  '#0F5DA3', // Bleu océan
  '#1170BA', // Bleu royal
  '#1382D1', // Bleu azur
  '#1595E8', // Bleu ciel
  '#17A7FF', // Bleu électrique
];

export default function LocationChart() {
  const bottles = useBottleStore((state) => state.bottles);

  const data: ChartDataPoint[] = Object.entries(
    bottles.reduce((acc, bottle) => {
      acc[bottle.location] = (acc[bottle.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
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
                key={entry.name} 
                fill={COLORS[index % COLORS.length]}
                className="stroke-white dark:stroke-gray-800"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}