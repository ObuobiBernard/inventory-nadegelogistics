import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Initialize Google Gen AI client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Chat API endpoint for OB (NADEGE Logistics Assistant)
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body; // Array of { role: 'user' | 'model', content: string }
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
      }

      // Format history for @google/genai chats
      // We want to use gemini-3.8-flash for general task as requested
      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: `You are OB, the friendly, professional, and knowledgeable AI assistant for NADEGE Logistics, an event equipment rental and logistics company based in Ghana. 
You assist clients on the catalog page with:
- Explaining event equipment items (tents, chairs, audio/visual gear, stage setups, decor, etc.)
- Providing pricing in Ghanaian Cedis (GH₵)
- Helping clients understand how to select items, add them to their booking selection, choose payment terms (full payment, part payment deposit, or pay later to receive a proforma invoice), and create accounts.
- Answering questions about logistics, rental terms, and receipts.
Always be polite, concise, and helpful. Format currency in GH₵.`,
        },
      });

      const reply = response.text || 'Hello! I am OB, your assistant at NADEGE Logistics. How can I help you with your event equipment needs today?';

      res.json({ reply });
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate response from OB.' });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
