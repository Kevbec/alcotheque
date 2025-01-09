import { Bottle } from '../types/bottle';

interface PriceHistory {
  date: string;
  price: number;
}

interface PriceEstimation {
  currentPrice: number;
  priceHistory: PriceHistory[];
  lastUpdated: string;
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
}

// Simule une base de données de prix
const priceDatabase: Record<string, PriceEstimation> = {};

// Fonction utilitaire pour calculer la tendance
function calculateTrend(history: PriceHistory[]): 'up' | 'down' | 'stable' {
  if (history.length < 2) return 'stable';
  
  const prices = history.map(h => h.price);
  const lastPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  
  if (lastPrice > previousPrice * 1.05) return 'up';
  if (lastPrice < previousPrice * 0.95) return 'down';
  return 'stable';
}

// Fonction pour estimer le prix actuel d'une bouteille
export async function estimateBottlePrice(bottle: Bottle): Promise<PriceEstimation> {
  // Vérifie si une estimation récente existe
  const cachedEstimation = priceDatabase[bottle.id];
  if (cachedEstimation && isEstimationValid(cachedEstimation)) {
    return cachedEstimation;
  }

  try {
    // Simule un appel API externe
    const basePrice = bottle.purchasePrice || 0;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Génère un historique de prix simulé
    const priceHistory = generatePriceHistory(basePrice);
    
    // Calcule le prix actuel estimé
    const currentPrice = calculateCurrentPrice(basePrice, bottle);
    
    const estimation: PriceEstimation = {
      currentPrice,
      priceHistory,
      lastUpdated: currentDate,
      confidence: getConfidenceLevel(bottle),
      trend: calculateTrend(priceHistory)
    };

    // Met en cache l'estimation
    priceDatabase[bottle.id] = estimation;

    return estimation;
  } catch (error) {
    console.error('Erreur lors de l\'estimation du prix:', error);
    throw error;
  }
}

// Vérifie si l'estimation est toujours valide (moins de 24h)
function isEstimationValid(estimation: PriceEstimation): boolean {
  const lastUpdate = new Date(estimation.lastUpdated);
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  return hoursSinceUpdate < 24;
}

// Génère un historique de prix simulé
function generatePriceHistory(basePrice: number): PriceHistory[] {
  const history: PriceHistory[] = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  for (let i = 0; i < 6; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    // Simule une variation de prix aléatoire (-5% à +5%)
    const variation = 1 + (Math.random() * 0.1 - 0.05);
    const price = basePrice * variation;

    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }

  return history;
}

// Calcule le prix actuel estimé
function calculateCurrentPrice(basePrice: number, bottle: Bottle): number {
  let price = basePrice;

  // Facteurs d'ajustement
  const ageFactor = bottle.year ? getAgeFactor(bottle.year) : 1;
  const typeFactor = getTypeFactor(bottle.type);
  const marketFactor = getMarketFactor();

  price = price * ageFactor * typeFactor * marketFactor;
  return Math.round(price * 100) / 100;
}

// Calcule le facteur d'âge
function getAgeFactor(year: string): number {
  const age = new Date().getFullYear() - parseInt(year);
  if (age <= 0) return 1;
  return 1 + (age * 0.02); // +2% par année d'âge
}

// Facteur basé sur le type de spiritueux
function getTypeFactor(type: string): number {
  const factors: Record<string, number> = {
    whisky: 1.1,
    rhum: 1.05,
    gin: 1.02,
    vodka: 1.01,
    cognac: 1.15,
    armagnac: 1.12,
    calvados: 1.08,
    eau_de_vie: 1.03,
    absinthe: 1.15,
    liqueurs: 1.02,
    pastis: 1.01,
    schnaps: 1.02,
    grappa: 1.05,
    chartreuse: 1.2,
    vin_rouge: 1.05,
    vin_blanc: 1.05,
    vin_rose: 1.03,
    vin_petillant: 1.08,
    champagne: 1.25,
    prosecco: 1.1,
    cava: 1.08,
    biere: 1.01,
    cidre: 1.01,
    hydromel: 1.05,
    sake: 1.08,
    bitter: 1.03,
    ratafia: 1.05,
    limoncello: 1.02
  };
  return factors[type] || 1;
}

// Simule les conditions du marché
function getMarketFactor(): number {
  return 1 + (Math.random() * 0.1 - 0.05); // ±5%
}

// Détermine le niveau de confiance de l'estimation
function getConfidenceLevel(bottle: Bottle): 'high' | 'medium' | 'low' {
  if (bottle.purchasePrice && bottle.year) return 'high';
  if (bottle.purchasePrice || bottle.year) return 'medium';
  return 'low';
}