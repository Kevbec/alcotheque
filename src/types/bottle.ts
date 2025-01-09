// Status and Origin types
export type BottleStatus = 'en_stock' | 'ouverte' | 'consommee' | 'offerte';
export type BottleOrigin = 'achat' | 'cadeau_recu';
export type SortField = 'name' | 'type' | 'location' | 'price' | 'date';

// Spirit type enum
export enum SpiritType {
  Rhum = 'rhum',
  Whisky = 'whisky',
  Gin = 'gin',
  Vodka = 'vodka',
  Tequila = 'tequila',
  Cognac = 'cognac',
  Armagnac = 'armagnac',
  Calvados = 'calvados',
  EauDeVie = 'eau_de_vie',
  Absinthe = 'absinthe',
  Liqueurs = 'liqueurs',
  Pastis = 'pastis',
  Schnaps = 'schnaps',
  Grappa = 'grappa',
  Chartreuse = 'chartreuse',
  VinRouge = 'vin_rouge',
  VinBlanc = 'vin_blanc',
  VinRose = 'vin_rose',
  VinPetillant = 'vin_petillant',
  Champagne = 'champagne',
  Prosecco = 'prosecco',
  Cava = 'cava',
  Biere = 'biere',
  Cidre = 'cidre',
  Hydromel = 'hydromel',
  Sake = 'sake',
  Bitter = 'bitter',
  Ratafia = 'ratafia',
  Limoncello = 'limoncello'
}

// Interfaces
export interface GiftInfo {
  from?: string;
  to?: string;
  date?: Date;
}

export interface StatusHistoryEntry {
  id: string;
  date: string;
  newStatus: BottleStatus;
  previousStatus: BottleStatus | null;
  quantity?: number;
  rating?: number;
  comments?: string;
  giftInfo?: GiftInfo;
}

export interface Bottle {
  id: string;
  name: string;
  type: SpiritType;
  quantity: number;
  year?: string;
  location: string;
  purchasePrice?: number;
  estimatedValue?: number;
  notes?: string;
  comments?: string;
  origin: BottleOrigin;
  status: BottleStatus;
  giftInfo?: GiftInfo;
  photo?: string;
  acquisitionDate: string;
  openedDate?: Date;
  finishedDate?: Date;
  lastUpdated?: Date;
  rating?: number;
  isFavorite?: boolean;
  statusHistory?: StatusHistoryEntry[];
  quantityOpened?: number;
  quantityConsumed?: number;
  quantityGifted?: number;
}