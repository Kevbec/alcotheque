import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Bottle, BottleConsumptionStatus } from '../../types/bottle';
import BottleSwipeCard from './BottleSwipeCard';
import { useBottleStore } from '../../store/useBottleStore';

interface BottleTrackingListProps {
  bottles: Bottle[];
}

export default function BottleTrackingList({
  bottles,
}: BottleTrackingListProps) {
  const [items, setItems] = useState(bottles);
  const updateBottle = useBottleStore((state) => state.updateBottle);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleStatusChange = (
    bottleId: string,
    status: BottleConsumptionStatus
  ) => {
    console.log('handleStatusChange triggered in BottleTrackingList.tsx:', {
      bottleId,
      statusChange,
    });
    const updates: Partial<Bottle> = {
      consumptionStatus: status,
    };

    if (status === 'ouverte') {
      updates.openedDate = new Date();
    } else if (status === 'terminee') {
      updates.finishedDate = new Date();
    }

    updateBottle(bottleId, updates);

    // Update local state
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bottleId ? { ...item, ...updates } : item
      )
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map((bottle) => (
            <BottleSwipeCard
              key={bottle.id}
              bottle={bottle}
              onStatusChange={(status) => handleStatusChange(bottle.id, status)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
