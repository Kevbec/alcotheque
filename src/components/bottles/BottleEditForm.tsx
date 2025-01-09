import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { useLocationStore } from '../../store/useLocationStore';
import { Bottle, BottleOrigin, SpiritType } from '../../types/bottle';
import { SPIRIT_TYPES } from '../../utils/constants';
import StarRating from '../inputs/StarRating';
import QuantityInput from '../inputs/QuantityInput';

interface BottleEditFormProps {
  bottle: Bottle;
  onSave: (updatedBottle: Partial<Bottle>) => void;
  onCancel: () => void;
}

const inputClasses = `
  w-full h-12 px-4 rounded-lg border border-gray-300 
  focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 
  transition-colors
`;

export default function BottleEditForm({ bottle, onSave, onCancel }: BottleEditFormProps) {
  const { locations, fetchLocations } = useLocationStore();
  const [formData, setFormData] = useState({ ...bottle });
  const [photo, setPhoto] = useState<string | undefined>(bottle.photo);
  const [quantities, setQuantities] = useState({
    stock: bottle.quantity || 0,
    opened: bottle.quantityOpened || 0,
    consumed: bottle.quantityConsumed || 0
  });

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPhoto(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Partial<Bottle> = {
      ...formData,
      photo,
      quantity: quantities.stock,
      quantityOpened: quantities.opened,
      quantityConsumed: quantities.consumed
    };

    // Déterminer le statut en fonction des quantités
    if (quantities.stock > 0) {
      updates.status = 'en_stock';
    } else if (quantities.opened > 0) {
      updates.status = 'ouverte';
    } else if (quantities.consumed > 0) {
      updates.status = 'consommee';
    }

    onSave(updates);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nom de la bouteille
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={inputClasses}
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
          className={inputClasses}
          required
        >
          {SPIRIT_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Quantities */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quantités
        </h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              En stock
            </label>
            <QuantityInput
              value={quantities.stock}
              onChange={(value) => setQuantities(prev => ({ ...prev, stock: value }))}
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Ouvertes
            </label>
            <QuantityInput
              value={quantities.opened}
              onChange={(value) => setQuantities(prev => ({ ...prev, opened: value }))}
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Consommées
            </label>
            <QuantityInput
              value={quantities.consumed}
              onChange={(value) => setQuantities(prev => ({ ...prev, consumed: value }))}
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Année
          </label>
          <input
            type="text"
            value={formData.year || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
            className={inputClasses}
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
            className={inputClasses}
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

      {/* Price Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prix d'achat (€)
          </label>
          <input
            type="number"
            value={formData.purchasePrice || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))}
            className={inputClasses}
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
            value={formData.estimatedValue || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: Number(e.target.value) }))}
            className={inputClasses}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Origin Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Origine
        </label>
        <select
          value={formData.origin}
          onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value as BottleOrigin }))}
          className={inputClasses}
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
            className={inputClasses}
            placeholder="Nom de la personne"
          />
        </div>
      )}

      {/* Rating Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Note
        </label>
        <StarRating
          value={formData.rating || 0}
          onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
        />
      </div>

      {/* Comments Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Commentaires
        </label>
        <textarea
          value={formData.comments || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
          rows={4}
          className={`${inputClasses} h-auto min-h-[120px] resize-none leading-relaxed`}
          placeholder="Ajouter des commentaires..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}