import { useBottleStore } from '../../store/useBottleStore';
import { exportToExcel } from '../../services/exportService';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function DataSettings() {
  const { bottles } = useBottleStore();
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    try {
      if (bottles.length === 0) {
        setError('Aucune bouteille dans l\'inventaire');
        return;
      }
      exportToExcel(bottles);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'export');
      console.error('Export error:', err);
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium mb-6">Gestion des Données</h3>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-medium">Exporter les Données</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Téléchargez une sauvegarde de votre collection au format Excel
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exporter en Excel
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-medium">Importer des Données</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Importez une sauvegarde précédente de votre collection
                </p>
              </div>
            </div>

            <input
              type="file"
              accept=".xlsx,.xls"
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700
                file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}