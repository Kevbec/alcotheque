import { utils, writeFile } from 'xlsx';
import { Bottle } from '../types/bottle';
import { formatTypeLabel } from '../utils/formatters';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function exportToExcel(bottles: Bottle[]) {
  // Préparer les données pour l'export
  const data = bottles.map(bottle => ({
    'Nom': bottle.name,
    'Type': formatTypeLabel(bottle.type),
    'Année': bottle.year || '',
    'Statut': getStatusLabel(bottle.status),
    'Emplacement': bottle.location,
    'Prix d\'achat (€)': bottle.purchasePrice || '',
    'Valeur estimée (€)': bottle.estimatedValue || '',
    'Date d\'acquisition': format(new Date(bottle.acquisitionDate), 'dd/MM/yyyy', { locale: fr }),
    'Origine': bottle.origin === 'achat' ? 'Achat' : 'Cadeau reçu',
    'De la part de': bottle.origin === 'cadeau_recu' ? bottle.giftInfo?.from || '' : '',
    'Note': bottle.rating || '',
    'Commentaires': bottle.comments || '',
    'Favori': bottle.isFavorite ? 'Oui' : 'Non'
  }));

  // Créer un workbook et une worksheet
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Inventaire');

  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 30 }, // Nom
    { wch: 15 }, // Type
    { wch: 8 },  // Année
    { wch: 12 }, // Statut
    { wch: 15 }, // Emplacement
    { wch: 15 }, // Prix d'achat
    { wch: 15 }, // Valeur estimée
    { wch: 15 }, // Date d'acquisition
    { wch: 12 }, // Origine
    { wch: 20 }, // De la part de
    { wch: 8 },  // Note
    { wch: 40 }, // Commentaires
    { wch: 8 },  // Favori
  ];
  ws['!cols'] = colWidths;

  // Générer le fichier
  const fileName = `alcotheque_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  writeFile(wb, fileName);
}

function getStatusLabel(status: Bottle['status']): string {
  const labels: Record<string, string> = {
    'en_stock': 'En stock',
    'ouverte': 'Ouverte',
    'consommee': 'Finie',
    'offerte': 'Offerte'
  };
  return labels[status] || status;
}