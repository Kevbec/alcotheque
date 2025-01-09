const handleStatusChange = async (
  newStatus: Bottle['status'],
  data?: { quantity?: number; giftInfo?: { to: string }; sourceStatus?: 'en_stock' | 'ouverte' }
) => {
  if (!currentBottle) return;

  try {
    const historyEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      newStatus,
      previousStatus: data?.sourceStatus || currentBottle.status,
      quantity: data?.quantity || 0,
      giftInfo: data?.giftInfo
    };

    const updates = {
      status: newStatus,
      statusHistory: [...(currentBottle.statusHistory || []), historyEntry]
    };

    if (data?.quantity) {
      const quantityUpdates = updateBottleQuantities(currentBottle, historyEntry);
      Object.assign(updates, quantityUpdates);
    }

    await updateBottle(currentBottle.id, updates);
    setCurrentBottle(prev => ({
      ...prev,
      ...updates,
    }));
  } catch (error) {
    console.error('Error updating bottle status:', error);
    throw error;
  }
};