import { openAIConfig } from './config';
import { ImageAnalysisRequest } from './types';

async function cloneResponse(response: Response) {
  const clonedResponse = response.clone();
  return {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: await clonedResponse.text()
  };
}

export async function makeOpenAIRequest(requestData: ImageAnalysisRequest) {
  console.group('🌐 OpenAI API Request');
  console.log('Request Data:', {
    model: requestData.model,
    messages: requestData.messages.map(m => ({
      role: m.role,
      content: m.content.map(c => ({
        type: c.type,
        ...(c.text && { text: c.text.substring(0, 50) + '...' })
      }))
    })),
    max_tokens: requestData.max_tokens
  });

  const response = await fetch(openAIConfig.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIConfig.apiKey}`,
      ...(openAIConfig.orgId && { 'OpenAI-Organization': openAIConfig.orgId })
    },
    body: JSON.stringify(requestData)
  });

  // Clone la réponse avant de la consommer
  const clonedResponseData = await cloneResponse(response);
  console.group('📥 API Response');
  console.log('Status:', response.status);
  console.log('Headers:', clonedResponseData.headers);

  if (!response.ok) {
    console.error('Erreur API détaillée :', {
      status: clonedResponseData.status,
      statusText: clonedResponseData.statusText,
      body: clonedResponseData.body
    });
    throw new Error(`Erreur API (${response.status}): ${response.statusText}`);
  }

  const responseData = JSON.parse(clonedResponseData.body);
  console.log('Raw Response:', JSON.stringify(responseData, null, 2));

  // Vérification et nettoyage de la réponse
  if (!responseData.choices?.[0]?.message?.content) {
    console.error('❌ Invalid API Response Structure:', responseData);
    throw new Error('La structure de la réponse API est invalide');
  }

  const content = responseData.choices[0].message.content.trim();
  console.log('📝 Cleaned Response Content:', content);
  console.log('✅ Processed Response:', {
    model: responseData.model,
    usage: responseData.usage,
    content: responseData.choices?.[0]?.message?.content
  });
  console.groupEnd();

  return responseData;
}