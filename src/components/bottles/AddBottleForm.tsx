import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { useLocationStore } from '../../store/useLocationStore';
import { useBottleStore } from '../../store/useBottleStore';
import { Bottle, BottleOrigin, SpiritType } from '../../types/bottle';
import { SPIRIT_TYPES } from '../../utils/constants';
import QuantityInput from '../inputs/QuantityInput';

interface AddBottleFormProps {
  initialPhoto?: string;
  recognitionData?: {
    name?: string;
    type?: string;
    year?: string;
    estimatedValue?: number;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBottleForm({ 
  initialPhoto,
  recognitionData,
  onClose,
  onSuccess
}: AddBottleFormProps) {
  const { locations, fetchLocations } = useLocationStore();
  const addBottle = useBottleStore((state) => state.addBottle);
  const [photo, setPhoto] = useState<string | undefined>(initialPhoto);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: SpiritType.Whisky,
    quantity: 1,
    year: '',
    location: '',
    purchasePrice: '',
    estimatedValue: '',
    notes: '',
    origin: 'achat' as BottleOrigin,
    status: 'en_stock' as Bottle['status'],
    giftInfo: {
      from: ''
    }
  });

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (locations.length > 0 && !formData.location) {
      setFormData(prev => ({ ...prev, location: locations[0].name }));
    }
  }, [locations]);

  useEffect(() => {
    if (recognitionData) {
      setFormData(prev => ({
        ...prev,
        name: recognitionData.name?.trim() || '',
        type: recognitionData.type?.toLowerCase() as SpiritType || SpiritType.Whisky,
        year: recognitionData.year?.toString() || '',
        estimatedValue: recognitionData.estimatedValue?.toString() || '',
        purchasePrice: recognitionData.estimatedValue?.toString() || ''
      }));
      setPhoto(initialPhoto);
    }
  }, [recognitionData, initialPhoto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const acquisitionDate = new Date().toISOString();
      
      const initialHistoryEntry = {
        id: crypto.randomUUID(),
        date: acquisitionDate,
        newStatus: 'en_stock' as const,
        previousStatus: null,
        quantity: formData.quantity
      };

      const newBottle: Omit<Bottle, 'id'> = {
        name: formData.name,
        type: formData.type,
        quantity: formData.quantity,
        year: formData.year || undefined,
        location: formData.location,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined,
        estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined,
        notes: formData.notes || undefined,
        origin: formData.origin,
        status: 'en_stock',
        acquisitionDate,
        photo,
        giftInfo: formData.origin === 'cadeau_recu' ? {
          from: formData.giftInfo.from
        } : undefined,
        statusHistory: [initialHistoryEntry]
      };
      
      await addBottle(newBottle);
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Photo
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Aperçu"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setPhoto(undefined)}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="photo-upload"
                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>Télécharger une photo</span>
                    <input
                      id="photo-upload"
                      name="photo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const imageData = e.target?.result as string;
                            setPhoto(imageData);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de la bouteille
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as SpiritType }))}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            >
              {SPIRIT_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <QuantityInput
              value={formData.quantity}
              onChange={(quantity) => setFormData(prev => ({ ...prev, quantity }))}
              min={1}
              max={99}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Année
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                pattern="\d{4}"
                title="L'année doit être au format YYYY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emplacement
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              >
                <option value="">Sélectionner un emplacement</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix d'achat (€)
              </label>
              <input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valeur estimée (€)
              </label>
              <input
                type="number"
                value={formData.estimatedValue}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Origine
            </label>
            <select
              value={formData.origin}
              onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value as BottleOrigin }))}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            >
              <option value="achat">Achat</option>
              <option value="cadeau_recu">Cadeau reçu</option>
            </select>
          </div>

          {formData.origin === 'cadeau_recu' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                De la part de
              </label>
              <input
                type="text"
                value={formData.giftInfo?.from || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  giftInfo: { ...prev.giftInfo, from: e.target.value }
                }))}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="Nom de la personne"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 resize-none"
              placeholder="Ajouter des notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
}