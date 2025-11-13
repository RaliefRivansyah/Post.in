const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = {
  async generateResponse(prompt, context = {}) {
    const modelNames = ['gemini-2.5-flash-lite']; // fallback order
    const fallbackResponses = [
      "I'm having trouble thinking right now. Try again later.",
      'AI service is busy. Please retry in a few seconds.',
      "Sorry, I'm having a short technical hiccup.",
    ];

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const fullPrompt = `
Kamu adalah "AI Bot", asisten di platform sosial bernama Post.in.
Kamu hanya membalas jika disebut (@ai, @bot, dll).
Gunakan bahasa **Indonesia alami**, sopan, dan ringkas (maksimal 2 kalimat).
Tulis dengan gaya santai tapi tidak berlebihan, tanpa emoji kecuali jika konteksnya benar-benar sesuai.

Konteks:
- Judul post: ${context.postTitle || 'N/A'}
- Isi post: ${context.postContent || 'N/A'}
- Komentar sebelumnya: ${context.previousComments || 'Tidak ada komentar sebelumnya'}

Komentar user: ${prompt}

Balasan AI (dalam bahasa Indonesia):
`;

        const result = await model.generateContent(fullPrompt);
        return result.response.text().trim();
      } catch (error) {
        console.error(`AI Service Error with ${modelName}:`, error.status || error.message);

        // Retry only for overload or network failure
        if (error.status === 503 || error.message.includes('fetch')) {
          await new Promise((r) => setTimeout(r, 1500));
          continue; // try next model or retry
        }
      }
    }

    // Return fallback text if all retries fail
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  },

  isBotMentioned(content) {
    const mentions = ['@bot', '@ai', '@aibot', '@assistant'];
    return mentions.some((m) => content.toLowerCase().includes(m));
  },

  extractPrompt(content) {
    return content.replace(/@(bot|ai|aibot|assistant)/gi, '').trim();
  },
};
