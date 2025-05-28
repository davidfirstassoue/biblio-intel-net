import axios from 'axios';

// This would be a Supabase Edge Function in production
const CLAUDE_API_ENDPOINT = '/api/ai/chat';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function generateAiResponse(messages: Message[]) {
  try {
    // In a real implementation, this would call a Supabase Edge Function
    // that securely handles the OpenRouter API key
    const response = await axios.post(CLAUDE_API_ENDPOINT, {
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant de bibliothèque intelligent et expert. Tu aides les utilisateurs à trouver des livres, des ressources éducatives, et à répondre à leurs questions sur divers sujets. Ton objectif est de fournir des recommandations de livres précises et pertinentes basées sur les intérêts de l'utilisateur. Sois concis, informatif et amical. N'invente pas de titres de livres qui n'existent pas. Si tu ne connais pas la réponse, propose de rechercher dans notre catalogue.`,
        },
        ...messages,
      ],
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
    });

    return response.data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback response in case the API is unavailable
    return {
      message: {
        role: 'assistant',
        content: "Je suis désolé, je ne peux pas vous aider pour le moment. Veuillez réessayer plus tard ou contacter notre équipe d'assistance.",
      },
    };
  }
}

// Function to suggest books based on user query
export async function suggestBooks(query: string) {
  try {
    const messages: Message[] = [
      {
        role: 'user',
        content: `Peux-tu me suggérer quelques livres pertinents sur le sujet suivant: "${query}". Donne-moi 3 à 5 recommandations avec le titre, l'auteur et une courte description de chaque livre.`,
      },
    ];
    
    return await generateAiResponse(messages);
  } catch (error) {
    console.error('Error suggesting books:', error);
    throw error;
  }
}