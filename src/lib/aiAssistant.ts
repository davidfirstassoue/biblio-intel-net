import axios from 'axios';

// TA CLÉ API OpenRouter :
const API_KEY = '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';

export const askAI = async (userMessage: string) => {
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };

    const body = {
        model: "mistral/mistral-small", 
        messages: [
            { role: "system", content: "Tu es un assistant bibliothèque. Tu aides à proposer des livres et des cours aux utilisateurs." },
            { role: "user", content: userMessage }
        ]
    };

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', body, { headers });

        // Sécurité : vérifier que le contenu existe avant de l'utiliser
        if (response.data && response.data.choices && response.data.choices[0]) {
            return response.data.choices[0].message.content;
        } else {
            return "Je n'ai pas pu obtenir de réponse.";
        }

    } catch (error: any) {
        console.error('Erreur IA :', error?.response?.data || error.message);
        return "Je suis désolé, je ne peux pas répondre pour le moment.";
    }
};
