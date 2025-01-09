import { openAIConfig } from './config';
import { makeOpenAIRequest } from './client';
import { processImageForAPI } from './imageProcessing';
import { cleanJSONResponse } from './imageProcessing';
import { validateBottleData } from './validation';
import { BOTTLE_RECOGNITION_PROMPT } from './prompts';
import { RecognitionResult } from './types';

export async function recognizeBottle(imageData: string): Promise<RecognitionResult> {
  if (!openAIConfig.apiKey) {
    throw new Error('Clé API OpenAI non configurée');
  }

  let rawResponse = ''; // Variable pour capturer la réponse brute de l'API
  console.group('🔍 Reconnaissance de bouteille');

  let responseData;
  try {
    const base64Image = await processImageForAPI(imageData);
    if (!base64Image || typeof base64Image !== 'string') {
      throw new Error('Image invalide ou corrompue');
    }

    console.log('🔍 Envoi de la requête à l\'API OpenAI...');

    responseData = await makeOpenAIRequest({
      model: openAIConfig.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: BOTTLE_RECOGNITION_PROMPT
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 150
    });
    
    console.log('Réponse brute de l\'API:', responseData);

    if (!responseData?.choices?.[0]?.message?.content) {
      throw new Error('La réponse de l\'API est invalide ou incomplète');
    }

    rawResponse = responseData.choices[0].message.content;

    console.group('📝 Analyse de la réponse');
    console.log('🔍 Réponse brute de l\'API:', rawResponse);

    const jsonText = cleanJSONResponse(rawResponse);
    console.log('🧹 JSON nettoyé:', jsonText);

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
      console.log('📊 Données parsées:', parsedData);      

      if (!parsedData.name || !parsedData.type) {
        throw new Error('Les champs name et type sont obligatoires');
      }
      
   } catch (e) {
      console.error('Erreur de validation:', e);
      console.error('Texte JSON invalide:', jsonText);
      throw new Error('La réponse de l\'API n\'est pas au format JSON valide');
    }

    // Valide et nettoie les données
    const validatedData = validateBottleData(parsedData);
    // Ajouter l'image originale aux données validées
    validatedData.photo = imageData;

    // Conserver la valeur estimée de l'API si elle existe
    const apiEstimatedValue = parsedData.estimatedValue;
    
    // Si l'API n'a pas fourni de valeur estimée, utiliser le service d'estimation local
    if (apiEstimatedValue === undefined || apiEstimatedValue === null) {
      console.log('💰 Pas de valeur estimée, utilisation du service d\'estimation...');
      try {
        const estimationService = await import('../priceEstimation');
        const estimation = await estimationService.estimateBottlePrice({
          id: crypto.randomUUID(),
          name: validatedData.name,
          type: validatedData.type,
          year: validatedData.year,
          status: 'en_stock',
          location: '',
          origin: 'achat',
          acquisitionDate: new Date().toISOString()
        });
        validatedData.estimatedValue = estimation.currentPrice;
        console.log('💰 Valeur estimée calculée:', validatedData.estimatedValue);
      } catch (error) {
        console.warn('⚠️ Erreur lors de l\'estimation du prix:', error);
      }
    }
    else {
      // Utiliser la valeur estimée fournie par l'API
      validatedData.estimatedValue = Math.round(apiEstimatedValue);
      console.log('💰 Utilisation de la valeur estimée par l\'API:', validatedData.estimatedValue);
    }

    console.log('Données validées:', validatedData);
    console.groupEnd();

    console.groupEnd(); // Ferme le groupe principal
    return validatedData;
  } catch (error) {
    console.group('❌ Erreur');
    console.error('Details:', error);
    console.error('Réponse brute qui a causé l\'erreur:', rawResponse || 'Aucune réponse brute reçue');
    console.groupEnd();
    console.groupEnd(); // Ferme le groupe principal
    throw error;
  }
}
