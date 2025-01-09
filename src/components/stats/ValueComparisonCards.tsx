import { TrendingUp, TrendingDown, CircleDollarSign, Scale } from 'lucide-react';
import { useBottleStore } from '../../store/useBottleStore';

export default function ValueComparisonCards() {
  const bottles = useBottleStore((state) => state.bottles);

  const getTotals = () => {
    return bottles.reduce(
      (acc, bottle) => {
        let quantity = 0;
        if (bottle.status === 'en_stock') {
          quantity = bottle.quantity || 0;
        } else if (bottle.status === 'ouverte') {
          quantity = bottle.quantityOpened || 0;
        }

        // Ne pas calculer si la quantité est 0
        if (quantity === 0) {
          return acc;
        }

        const purchasePrice = bottle.purchasePrice || 0;
        const estimatedValue = bottle.estimatedValue || purchasePrice;
        
        return {
          totalPurchase: acc.totalPurchase + (purchasePrice * quantity),
          totalValue: acc.totalValue + (estimatedValue * quantity),
        };
      },
      { totalPurchase: 0, totalValue: 0 }
    );
  };

  const { totalPurchase, totalValue } = getTotals();
  const difference = totalValue - totalPurchase;
  const percentageGain = totalPurchase ? ((difference / totalPurchase) * 100) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Investissement */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <CircleDollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-medium text-blue-900 dark:text-blue-100">Investissement</h4>
        </div>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(totalPurchase)}
        </p>
        <p className="text-sm text-blue-600/60 dark:text-blue-400/60 mt-1">
          Prix d'achat total
        </p>
      </div>

      {/* Valeur Actuelle */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
            <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-medium text-purple-900 dark:text-purple-100">Valeur Actuelle</h4>
        </div>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {formatCurrency(totalValue)}
        </p>
        <p className="text-sm text-purple-600/60 dark:text-purple-400/60 mt-1">
          Valeur estimée totale
        </p>
      </div>

      {/* Plus-Value */}
      <div className={`bg-gradient-to-br ${
        difference >= 0 
          ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' 
          : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
      } rounded-xl p-6 shadow-sm`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${
            difference >= 0 
              ? 'bg-green-100 dark:bg-green-900/50' 
              : 'bg-red-100 dark:bg-red-900/50'
          } rounded-lg`}>
            {difference >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
          </div>
          <h4 className={`font-medium ${
            difference >= 0 
              ? 'text-green-900 dark:text-green-100' 
              : 'text-red-900 dark:text-red-100'
          }`}>Plus-Value</h4>
        </div>
        <div className="flex items-baseline gap-3">
          <p className={`text-2xl font-bold ${
            difference >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(difference)}
          </p>
          <p className={`text-lg font-semibold ${
            difference >= 0 
              ? 'text-green-500/70 dark:text-green-400/70' 
              : 'text-red-500/70 dark:text-red-400/70'
          }`}>
            {percentageGain.toFixed(1)}%
          </p>
        </div>
        <p className={`text-sm ${
          difference >= 0 
            ? 'text-green-600/60 dark:text-green-400/60' 
            : 'text-red-600/60 dark:text-red-400/60'
        } mt-1`}>
          {difference >= 0 ? 'Gain total' : 'Perte totale'}
        </p>
      </div>
    </div>
  );
}