export interface ChatMessage {
  id: string;
  sender: 'user' | 'bella';
  text: string;
  timestamp: string;
}

export interface ApiHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

const BELLA_API_URL = 'https://dani-qi3i.onrender.com/api/bot/chat';

/**
 * Sends a message to the Bella AI agent endpoint.
 * Handles Render.com free-tier wake-up delays and potential timeouts.
 */
export async function sendBellaMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout for cold start

  // Prepare clean history for the API (last 6 messages to keep context concise)
  const apiHistory: ApiHistoryItem[] = history
    .slice(-6)
    .map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));

  try {
    const response = await fetch(BELLA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        message,
        history: apiHistory,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na resposta da Bella (Status: ${response.status})`);
    }

    const data = await response.json();

    if (data && typeof data.reply === 'string' && data.reply.trim().length > 0) {
      return data.reply.trim();
    }

    return 'Desculpe, tive uma oscilação momentânea. Pode repetir sua pergunta, por favor? 🌸';
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      return 'O servidor demorou um pouquinho para responder. Por favor, tente enviar novamente em alguns instantes! 🌸✨';
    }
    console.error('Erro ao comunicar com a Bella:', error);
    return 'Desculpe, não consegui me conectar no momento. Você também pode falar diretamente com nossa equipe pelo WhatsApp! 💖';
  }
}
