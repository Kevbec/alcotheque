import React from 'react';
import { useBottleStore } from '../store/useBottleStore';

export default function Analytics() {
  const bottles = useBottleStore((state) => state.bottles);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analyses</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Répartition par type</h3>
          {/* Chart will be implemented here */}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Évolution de la collection</h3>
          {/* Chart will be implemented here */}
        </div>
      </div>
    </div>
  );
}