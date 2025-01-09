import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(date: string | Date | undefined): string {
  if (!date) return '-';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(parsedDate)) {
      console.warn('Date invalide:', date);
      return '-';
    }
    
    return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return '-';
  }
}

export function ensureValidDate(date: string | Date | undefined): Date | null {
  if (!date) return null;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? parsedDate : null;
  } catch {
    return null;
  }
}