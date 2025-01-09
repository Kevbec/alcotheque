export async function processImageForAPI(imageData: string): Promise<string> {
  const base64Data = imageData.includes('data:image')
    ? imageData.split(',')[1]
    : imageData;
    
  try {
    // Optimiser l'image avant la conversion en base64
    const optimizedBase64 = await optimizeImage(base64Data);
    
    // Vérifier que le base64 est valide
    if (!isValidBase64(optimizedBase64)) {
      throw new Error('Format base64 invalide');
    }
    return optimizedBase64;
  } catch (error) {
    console.error('Erreur lors de l\'optimisation de l\'image:', error);
    throw new Error('Erreur lors de l\'optimisation de l\'image');
  }
}

async function optimizeImage(base64Data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        // Calculer les nouvelles dimensions
        let { width, height } = calculateOptimizedDimensions(img.width, img.height);

        // Configurer le canvas
        canvas.width = width;
        canvas.height = height;

        // Appliquer un fond blanc pour les images PNG avec transparence
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // Dessiner l'image redimensionnée
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir en JPEG avec qualité réduite
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(optimizedBase64.split(',')[1]);
        } else {
          reject(new Error('Impossible de créer le contexte canvas'));
        }
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
    img.src = `data:image/jpeg;base64,${base64Data}`;
  });
}

function calculateOptimizedDimensions(width: number, height: number): { width: number; height: number } {
  const MAX_DIMENSION = 800;
  const MAX_PIXELS = 640000; // environ 800x800

  let newWidth = width;
  let newHeight = height;

  // Réduire si une dimension dépasse le maximum
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      newWidth = MAX_DIMENSION;
      newHeight = Math.round((height * MAX_DIMENSION) / width);
    } else {
      newHeight = MAX_DIMENSION;
      newWidth = Math.round((width * MAX_DIMENSION) / height);
    }
  }

  // Vérifier si le nombre total de pixels dépasse encore le maximum
  const totalPixels = newWidth * newHeight;
  if (totalPixels > MAX_PIXELS) {
    const scale = Math.sqrt(MAX_PIXELS / totalPixels);
    newWidth = Math.round(newWidth * scale);
    newHeight = Math.round(newHeight * scale);
  }

  return { width: newWidth, height: newHeight };
}

function isValidBase64(str: string): boolean {
  try {
    // Vérifier le format base64
    const regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    if (!regex.test(str)) {
      return false;
    }
    // Vérifier que c'est une image valide
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    // Vérifier les premiers octets pour s'assurer que c'est une image
    const header = bytes.slice(0, 4);
    const isJPEG = header[0] === 0xFF && header[1] === 0xD8;
    const isPNG = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
    return isJPEG || isPNG;
  } catch (e) {
    return false;
  }
}

export function cleanJSONResponse(response: string): string {
  // Supprime tous les blocs de code markdown et les backticks
  let cleaned = response.replace(/```[\s\S]*?```/g, '').replace(/`/g, '');
  
  // Supprime les espaces et sauts de ligne en début et fin
  cleaned = cleaned.trim();
  
  // Trouve le premier objet JSON valide dans le texte
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Aucun objet JSON trouvé dans la réponse');
  }
  
  const jsonCandidate = cleaned.slice(firstBrace, lastBrace + 1);
  
  // Vérifie que c'est un JSON valide
  try {
    JSON.parse(jsonCandidate);
    return jsonCandidate;
  } catch (e) {
    throw new Error('Le texte extrait n\'est pas un JSON valide');
  }
}