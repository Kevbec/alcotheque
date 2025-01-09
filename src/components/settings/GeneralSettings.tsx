import { useState, useEffect } from 'react';
import { useLocationStore } from '../../store/useLocationStore';
import { PlusCircle, X } from 'lucide-react';

export default function GeneralSettings() {
  const { locations, fetchLocations, addLocation, removeLocation, loading, error } = useLocationStore();
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleAddLocation = async () => {
    if (newLocation.trim()) {
      try {
        await addLocation(newLocation.trim());
        setNewLocation('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLocation();
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium mb-6">Paramètres Généraux</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Emplacements de Stockage
          </label>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter un emplacement..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                disabled={loading}
              />
              <button
                onClick={handleAddLocation}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                <PlusCircle className="w-5 h-5" />
                Ajouter
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              {locations.map((location) => (
                <div 
                  key={location.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md group"
                >
                  <span>{location.name}</span>
                  <button
                    onClick={() => removeLocation(location.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    disabled={loading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {locations.length === 0 && !loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucun emplacement défini. Ajoutez-en un pour commencer !
                </p>
              )}
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}