import React, { useEffect } from 'react';
import { useBottleStore } from '../store/useBottleStore';
import { useModalStore } from '../store/useModalStore';
import { useWindowSize } from '../hooks/useWindowSize';
import { PlusCircle, Camera } from 'lucide-react';
import StatCard from '../components/stats/StatCard';
import ValueComparisonCards from '../components/stats/ValueComparisonCards';
import ActionButton from '../components/buttons/ActionButton';
import DistributionChart from '../components/charts/DistributionChart';
import EvolutionChart from '../components/charts/EvolutionChart';
import AddBottleModal from '../components/modals/AddBottleModal';
import ScanBottleModal from '../components/modals/ScanBottleModal';
import QuickStatusModal from '../components/modals/QuickStatusModal';

export default function Dashboard() {
  const { bottles, fetchBottles, loading } = useBottleStore();
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const { 
    isAddBottleModalOpen, 
    openAddBottleModal, 
    closeAddBottleModal,
    isScanBottleModalOpen,
    openScanBottleModal,
    closeScanBottleModal,
    quickStatusBottle,
    closeQuickStatusModal,
    scannedPhoto
  } = useModalStore();

  useEffect(() => {
    fetchBottles();
  }, [fetchBottles]);

  const stats = {
    total: {
      count: bottles?.length || 0,
      quantity: bottles?.reduce((sum, b) => sum + (
        (b.quantity || 0) + 
        (b.quantityOpened || 0) + 
        (b.quantityConsumed || 0) + 
        (b.quantityGifted || 0)
      ), 0) || 0
    },
    stock: {
      count: bottles?.filter(b => b.quantity > 0).length || 0,
      quantity: bottles?.reduce((sum, b) => sum + (b.quantity || 0), 0) || 0
    },
    opened: {
      count: bottles?.filter(b => (b.quantityOpened || 0) > 0).length || 0,
      quantity: bottles?.reduce((sum, b) => sum + (b.quantityOpened || 0), 0) || 0
    },
    consumed: {
      count: bottles?.filter(b => (b.quantityConsumed || 0) > 0).length || 0,
      quantity: bottles?.reduce((sum, b) => sum + (b.quantityConsumed || 0), 0) || 0
    },
    gifted: {
      count: bottles?.filter(b => (b.quantityGifted || 0) > 0).length || 0,
      quantity: bottles?.reduce((sum, b) => sum + (b.quantityGifted || 0), 0) || 0
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 pb-20 md:pb-0 ${isMobile ? '-mt-6' : ''}`}>
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row items-start gap-6'}`}>
        <div className={`flex flex-col gap-4 ${isMobile ? 'w-full' : 'w-48'}`}>
          {!isMobile && <h2 className="text-2xl font-bold">Tableau de Bord</h2>}
          <div className={`flex ${isMobile ? 'justify-center gap-4' : 'flex-col gap-2'}`}>
            <ActionButton
              icon={Camera}
              label="Scanner"
              onClick={openScanBottleModal}
              variant="secondary"
              size="sm"
            />
            <ActionButton
              icon={PlusCircle}
              label="Ajouter"
              onClick={openAddBottleModal}
              size="sm"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20 rounded-t-lg">
              <StatCard 
                type="total" 
                value={stats.total.count} 
                quantity={stats.total.quantity} 
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6">
              <StatCard 
                type="stock" 
                value={stats.stock.count} 
                quantity={stats.stock.quantity} 
              />
              <StatCard 
                type="opened" 
                value={stats.opened.count} 
                quantity={stats.opened.quantity} 
              />
              <StatCard 
                type="consumed" 
                value={stats.consumed.count} 
                quantity={stats.consumed.quantity} 
              />
              <StatCard 
                type="gifted" 
                value={stats.gifted.count} 
                quantity={stats.gifted.quantity} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Répartition des Bouteilles</h3>
              <DistributionChart />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Evolution de l'alcothèque</h3>
              <EvolutionChart />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Comparaison Prix/Valeur</h3>
            <ValueComparisonCards />
          </div>
        </div>
      </div>

      <AddBottleModal 
        isOpen={isAddBottleModalOpen}
        onClose={closeAddBottleModal}
        initialPhoto={scannedPhoto}
      />

      <ScanBottleModal
        isOpen={isScanBottleModalOpen}
        onClose={closeScanBottleModal}
      />

      {quickStatusBottle && (
        <QuickStatusModal
          bottle={quickStatusBottle.bottle}
          action={quickStatusBottle.action}
          isOpen={true}
          onClose={closeQuickStatusModal}
        />
      )}
    </div>
  );
}