import { SpiritType } from '../../types/bottle';
import { RecognitionResult } from './types';
import { VALID_SPIRIT_TYPES } from './prompts';

interface ValidationError extends Error {
  field?: string;
  value?: any;
}

export function validateBottleData(data: any): RecognitionResult {
  console.log('Validation des données reçues:', data);

  if (!data || typeof data !== 'object') {
    throw createValidationError('format', 'Les données reçues ne sont pas un objet valide', data);
  }

  // Nettoyage et validation des données
  const cleanedData = {
    name: data.name?.trim(),
    type: data.type?.toLowerCase().trim(),
    year: data.year?.toString().trim(),
    estimatedValue: data.estimatedValue ? Number(data.estimatedValue) : undefined
  };

  if (!cleanedData.name) {
    throw createValidationError('name', 'Le nom de la bouteille est requis', cleanedData.name);
  }

  if (!cleanedData.type) {
    throw createValidationError('type', 'Le type de spiritueux est requis', cleanedData.type);
  }
  
  if (!VALID_SPIRIT_TYPES.includes(cleanedData.type)) {
    throw createValidationError('type', 
      `Type de spiritueux invalide. Valeurs acceptées: ${VALID_SPIRIT_TYPES.join(', ')}`,
      cleanedData.type
    );
  }

  // Validation de l'année si présente
  if (cleanedData.year) {
    if (!/^\d{4}$/.test(cleanedData.year) || parseInt(cleanedData.year) > new Date().getFullYear()) {
      throw createValidationError('year', 'L\'année doit être au format YYYY et ne pas être future', cleanedData.year);
    }
  }

  // Validation de la valeur estimée si présente
  if (cleanedData.estimatedValue !== undefined) {
    if (isNaN(cleanedData.estimatedValue) || cleanedData.estimatedValue <= 0) {
      throw createValidationError('estimatedValue', 'La valeur estimée doit être un nombre positif', cleanedData.estimatedValue);
    }
  }

  const result: RecognitionResult = {
    name: cleanedData.name,
    type: cleanedData.type as SpiritType,
    ...(cleanedData.year && { year: cleanedData.year }),
    ...(cleanedData.estimatedValue && { estimatedValue: Math.round(cleanedData.estimatedValue) })
  };

  console.log('✅ Données validées avec succès:', result);
  return result;
}

function createValidationError(field: string, message: string, value?: any): ValidationError {
  const error = new Error(message) as ValidationError;
  error.field = field;
  error.value = value;
  console.error(`❌ Erreur de validation [${field}]:`, { message, value });
  return error;
}