import { SpiritType } from '../../types/bottle';

// Synchroniser avec les types disponibles dans AddBottleModal
const VALID_TYPES = [
  'rhum', 'whisky', 'gin', 'vodka', 'tequila', 'cognac', 'armagnac',
  'calvados', 'eau_de_vie', 'absinthe', 'liqueurs', 'pastis', 'schnaps',
  'grappa', 'chartreuse', 'vin_rouge', 'vin_blanc', 'vin_rose',
  'vin_petillant', 'champagne', 'prosecco', 'cava', 'biere', 'cidre',
  'hydromel', 'sake', 'bitter', 'ratafia', 'limoncello'
];

export const BOTTLE_RECOGNITION_PROMPT = `Analyse cette image de bouteille et retourne UNIQUEMENT un objet JSON avec exactement cette structure:
{
  "name": "nom exact de la bouteille",
  "type": "type de spiritueux",
  "year": "YYYY",
  "estimatedValue": valeur estimée en euros (nombre)
}

IMPORTANT:
- Le champ "type" doit être EXACTEMENT une de ces valeurs: ${VALID_TYPES.join(', ')}
- Le champ "name" est obligatoire et doit être une chaîne non vide
- Le champ "type" est obligatoire et doit correspondre exactement à une des valeurs listées ('rhum',
'whisky','gin','vodka','tequila','cognac','armagnac','calvados','eau_de_vie','absinthe','liqueurs','pastis','schnaps','grappa','chartreuse','vin_rouge','vin_blanc','vin_rose','vin_petillant','champagne','prosecco','cava','biere','cidre','hydromel','sake','bitter','ratafia','limoncello',)
- Les champs "year" et "estimatedValue" sont optionnels
- L'année doit être au format YYYY (4 chiffres)
- La valeur estimée doit être un nombre entier positif
- Ne pas inclure de champs supplémentaires
- Retourner UNIQUEMENT l'objet JSON valide, sans texte avant ou après
- Si un champ optionnel est incertain, ne pas l'inclure
- Le champ "estimatedValue" est basé sur :
  - La marque et le type identifiés.
  - Une recherche approximative des prix moyens sur le marché pour ce type ou marque.
  - Si la marque ou le modèle n'est pas identifiable, estimez la valeur moyenne pour ce type de spiritueux.

### Plages de prix de référence pour estimer la valeur :
- Gin : entre 20€ et 70€
- Whisky : entre 30€ et 200€
- Rhum : entre 15€ et 100€
- Cognac : entre 40€ et 300€
- Champagne : entre 30€ et 150€
- Bières : entre 5€ et 20€
- Liqueurs : entre 20€ et 80€

### En cas d'incertitude :
- Si la marque n'est pas identifiable, utilisez les plages ci-dessus en fonction du type et des éléments visuels de la bouteille.
- Si l'image est trop floue ou manque d'informations essentielles, omettez le champ "estimatedValue".

Retourner UNIQUEMENT l'objet JSON valide, sans texte avant ou après.


Exemple de réponse valide:
{"name":"Johnnie Walker Black Label","type":"whisky","year":"2020","estimatedValue":45}`;


export const VALID_SPIRIT_TYPES = VALID_TYPES;