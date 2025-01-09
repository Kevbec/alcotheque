export function formatTypeLabel(type: string): string {
  const typeLabels: Record<string, string> = {
    rhum: 'Rhum',
    whisky: 'Whisky',
    gin: 'Gin',
    vodka: 'Vodka',
    tequila: 'Tequila',
    cognac: 'Cognac',
    armagnac: 'Armagnac',
    calvados: 'Calvados',
    eau_de_vie: 'Eau de Vie',
    absinthe: 'Absinthe',
    liqueurs: 'Liqueurs',
    pastis: 'Pastis',
    schnaps: 'Schnaps',
    grappa: 'Grappa',
    chartreuse: 'Chartreuse',
    vin_rouge: 'Vin Rouge',
    vin_blanc: 'Vin Blanc',
    vin_rose: 'Vin Rosé',
    vin_petillant: 'Vin Pétillant',
    champagne: 'Champagne',
    prosecco: 'Prosecco',
    cava: 'Cava',
    biere: 'Bière',
    cidre: 'Cidre',
    hydromel: 'Hydromel',
    sake: 'Saké',
    bitter: 'Bitter',
    ratafia: 'Ratafia',
    limoncello: 'Limoncello'
  };

  return typeLabels[type] || type;
}