import React, { useState, useEffect } from 'react';
import { useBottleStore } from '../store/useBottleStore';
import { useModalStore } from '../store/useModalStore';
import { useWindowSize } from '../hooks/useWindowSize';
import ActionButton from '../components/buttons/ActionButton';
import AddBottleModal from '../components/modals/AddBottleModal';
import ScanBottleModal from '../components/modals/ScanBottleModal';
import ViewBottleModal from '../components/modals/ViewBottleModal';
import QuickStatusModal from '../components/modals/QuickStatusModal';
import BottleList from '../components/bottles/BottleList';
import { PlusCircle, Camera, Filter, LayoutGrid, List } from 'lucide-react';
import SearchBar from '../components/filters/SearchBar';
import MobileFilterDrawer from '../components/filters/MobileFilterDrawer';
import { FilterState, initialFilterState } from '../components/filters/types';

export default function Inventory() {
  const { bottles, fetchBottles, loading, error } = useBottleStore();
  const { width } = useWindowSize();
  const isMobile = width < 640;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { 
    isAddBottleModalOpen, 
    openAddBottleModal, 
    closeAddBottleModal,
    isScanBottleModalOpen,
    openScanBottleModal,
    closeScanBottleModal,
    selectedBottle,
    closeViewBottleModal,
    quickStatusBottle,
    closeQuickStatusModal,
    scannedPhoto
  } = useModalStore();

  useEffect(() => {
    fetchBottles();
  }, [fetchBottles]);

  // Filtrer les bouteilles
  const filteredBottles = bottles.filter(bottle => {
    // Filtre par recherche
    if (filters.search && !bottle.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Filtre par types
    if (filters.types.length > 0 && !filters.types.includes(bottle.type)) {
      return false;
    }

    // Filtre par emplacements
    if (filters.locations.length > 0 && !filters.locations.includes(bottle.location)) {
      return false;
    }

    // Filtre par favoris
    if (filters.showFavorites && !bottle.isFavorite) {
      return false;
    }

    // Filtre par statut
    if (filters.status !== 'all' && bottle.status !== filters.status) {
      return false;
    }

    // Filtre par prix
    if (filters.minPrice && bottle.purchasePrice && bottle.purchasePrice < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && bottle.purchasePrice && bottle.purchasePrice > Number(filters.maxPrice)) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {isMobile && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gray-50 dark:bg-gray-900 px-4 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters(prev => ({ ...prev, search }))}
              placeholder="Rechercher une bouteille..."
              className="flex-1"
            />
            <div className="flex gap-1">
              <ActionButton
                icon={Filter}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant={isFilterOpen ? 'primary' : 'secondary'}
                size="sm"
                iconOnly
                className="w-12 h-12"
              />
              <ActionButton
                icon={viewMode === 'list' ? LayoutGrid : List}
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                variant="secondary"
                size="sm"
                iconOnly
                className="w-12 h-12"
              />
              <ActionButton
                icon={Camera}
                onClick={openScanBottleModal}
                variant="secondary"
                size="sm"
                iconOnly
                className="w-12 h-12"
              />
              <ActionButton
                icon={PlusCircle}
                onClick={openAddBottleModal}
                size="sm"
                iconOnly
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>
      )}

      <div className={isMobile ? 'mt-20' : ''}>
        <BottleList
          bottles={filteredBottles}
          viewMode={viewMode}
        />
      </div>

      <MobileFilterDrawer
        isOpen={isFilterOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setIsFilterOpen(false)}
      />

      <AddBottleModal 
        isOpen={isAddBottleModalOpen}
        onClose={closeAddBottleModal}
        initialPhoto={scannedPhoto}
      />

      <ScanBottleModal
        isOpen={isScanBottleModalOpen}
        onClose={closeScanBottleModal}
      />

      {selectedBottle && (
        <ViewBottleModal
          bottle={selectedBottle}
          isOpen={true}
          onClose={closeViewBottleModal}
        />
      )}
      
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