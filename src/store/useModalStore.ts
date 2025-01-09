import { create } from 'zustand';
import { Bottle } from '../types/bottle';

interface RecognitionData {
  name: string;
  type: string;
  year?: string;
  estimatedValue?: number;
}

interface ModalStore {
  isAddBottleModalOpen: boolean;
  isScanBottleModalOpen: boolean;
  scannedPhoto?: string;
  quickStatusBottle: { bottle: Bottle; action: 'open' | 'finish' } | null;
  selectedBottle: Bottle | null;
  bottleRecognitionData: RecognitionData | null;
  isEditMode: boolean;
  openAddBottleModal: () => void;
  closeAddBottleModal: () => void;
  openScanBottleModal: () => void;
  closeScanBottleModal: () => void;
  setScannedPhoto: (photo?: string) => void;
  openQuickStatusModal: (bottle: Bottle, action: 'open' | 'finish') => void;
  closeQuickStatusModal: () => void;
  openViewBottleModal: (bottle: Bottle) => void;
  closeViewBottleModal: () => void;
  setBottleRecognitionData: (data: RecognitionData | null) => void;
  setEditMode: (isEdit: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isAddBottleModalOpen: false,
  isScanBottleModalOpen: false,
  scannedPhoto: undefined,
  quickStatusBottle: null,
  selectedBottle: null,
  bottleRecognitionData: null,
  isEditMode: false,
  openAddBottleModal: () => set({ isAddBottleModalOpen: true }),
  closeAddBottleModal: () => set({ isAddBottleModalOpen: false, bottleRecognitionData: null, scannedPhoto: undefined }),
  openScanBottleModal: () => set({ isScanBottleModalOpen: true }),
  closeScanBottleModal: () => set({ isScanBottleModalOpen: false }),
  setScannedPhoto: (photo) => set({ scannedPhoto: photo }),
  openQuickStatusModal: (bottle, action) => set({ quickStatusBottle: { bottle, action } }),
  closeQuickStatusModal: () => set({ quickStatusBottle: null }),
  openViewBottleModal: (bottle) => set({ selectedBottle: bottle }),
  closeViewBottleModal: () => set({ selectedBottle: null, isEditMode: false }),
  setBottleRecognitionData: (data) => set({ bottleRecognitionData: data }),
  setEditMode: (isEdit) => set({ isEditMode: isEdit }),
}));