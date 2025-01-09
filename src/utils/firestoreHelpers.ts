import { Timestamp } from 'firebase/firestore';

// Convert JavaScript Date objects to Firestore Timestamps
export function toFirestoreData(data: any): any {
  if (!data) return data;
  
  const result: any = {};

  Object.entries(data).forEach(([key, value]) => {
    // Skip undefined values
    if (value === undefined) return;

    // Convert Date objects to Firestore Timestamps
    if (value instanceof Date) {
      result[key] = Timestamp.fromDate(value);
    }
    // Handle arrays (e.g. statusHistory)
    else if (Array.isArray(value)) {
      result[key] = value.map(item => 
        typeof item === 'object' ? toFirestoreData(item) : item
      );
    }
    // Handle nested objects
    else if (value && typeof value === 'object') {
      result[key] = toFirestoreData(value);
    }
    // Keep other values as is
    else {
      result[key] = value;
    }
  });

  return result;
}

// Validate data before sending to Firestore
export function validateFirestoreData(data: any): boolean {
  try {
    // Check for circular references
    JSON.stringify(data);
    return true;
  } catch (error) {
    console.error('Invalid Firestore data:', error);
    return false;
  }
}