import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBottleStore } from '../../store/useBottleStore';
import { format, parseISO, isDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeSeriesDataPoint } from './types';

export default function InventoryHistoryChart() {
  const bottles = useBottleStore((state) => state.bottles);

  const ensureDate = (date: Date | string): Date => {
    if (isDate(date)) return date;
    return new Date(date);
  };

  const data: TimeSeriesDataPoint[] = bottles
    .sort((a, b) => ensureDate(a.acquisitionDate).getTime() - ensureDate(b.acquisitionDate).getTime())
    .reduce((acc, bottle, index) => {
      const date = format(ensureDate(bottle.acquisitionDate), 'yyyy-MM-dd');
      const lastEntry = acc[acc.length - 1];
      
      if (!lastEntry || lastEntry.date !== date) {
        acc.push({ date, total: index + 1 });
      }
      
      return acc;
    }, [] as TimeSeriesDataPoint[]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(parseISO(date), 'd MMM', { locale: fr })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(date) => format(parseISO(date as string), 'dd MMMM yyyy', { locale: fr })}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#4F46E5" 
            fill="#4F46E5" 
            fillOpacity={0.2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}