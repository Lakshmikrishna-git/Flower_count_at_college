import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client if key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'VAST Floradex Campus Census Bureau',
    hasGemini: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Hilarious fallback verdicts for offline/no-key situations
const FALLBACK_VERDICTS = [
  {
    botanicalIdentity: 'Red Hibiscus (Sembaruthi / Chembarathi)',
    scientificName: 'Hibiscus procrastinatus var. bunking',
    estimatedPetals: 5,
    verdict: 'Officially registered as an unpluckable collegiate sacred asset. The stamen is pointed defiantly towards the Dean’s office.',
    campusRiskLevel: 'Watchman Whistle Risk: 85% (High vigilance)',
    academicEquivalent: 'Engineering Chemistry: 100% organic, 0% lab manual completion',
    uselessFunFact: 'Has witnessed approximately 1,240 students pretending to study while actually discussing canteen beef roast/cutlets.',
  },
  {
    botanicalIdentity: 'Campus Wall Bougainvillea',
    scientificName: 'Bougainvillea attendance-deficitus',
    estimatedPetals: 3,
    verdict: 'Technically paper bracts, not true petals! However, in our useless census protocol, bracts count as full diplomatic flowers.',
    campusRiskLevel: 'Thorn Resistance: High | Procrastination Index: 98%',
    academicEquivalent: 'Structural Mechanics: Capable of surviving monsoons, exams, and football kicks',
    uselessFunFact: 'Grows 2.4x faster during semester study holidays than during regular instruction weeks.',
  },
  {
    botanicalIdentity: 'Canteen Path Golden Marigold',
    scientificName: 'Tagetes chai-splatterus',
    estimatedPetals: 48,
    verdict: 'Radiant composite blossom. Has absorbed ambient canteen parotta aromatics and tea vapor.',
    campusRiskLevel: 'Bee Air Traffic Control: Active | Canteen Crow Hazard: Moderate',
    academicEquivalent: 'Applied Thermodynamics: Radiates yellow heat equivalent to 0.0003 Watts',
    uselessFunFact: 'Campus dogs consider this flower neutral territory during afternoon naps.',
  },
  {
    botanicalIdentity: 'Courtyard Touch-Me-Not (Mimosa Pudica)',
    scientificName: 'Mimosa social-anxietus',
    estimatedPetals: 16,
    verdict: 'Collapses instantly upon physical contact, mirroring an engineering student being asked for their seminar PPT.',
    campusRiskLevel: 'Vulnerability: Extreme | Drama: Maximum',
    academicEquivalent: 'Control Systems: Negative feedback loop with 0.1s step response',
    uselessFunFact: 'Shuts leaves faster than a student closes Instagram when the HOD walks into the computer lab.',
  }
];

// Flower AI Examination & Census Identification Endpoint
app.post('/api/examine-flower', async (req, res) => {
  try {
    const { imageBase64, flowerName, zoneName, notes, collegeName = 'Vidya Academy of Science & Technology' } = req.body;

    if (ai) {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      if (imageBase64 && typeof imageBase64 === 'string') {
        const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }

      const promptText = `You are the Chief Botanical Inspector for the "Officially Unofficial College Flower Census Bureau" at ${collegeName}.
The student is conducting a deliberately useless yet mathematically precise census to count every single flower on their campus.
Analyze this flower specimen:
- Zone/Location: ${zoneName || 'Somewhere on campus'}
- Student Note / Initial Name: ${flowerName || notes || 'Unidentified campus bloom'}

Respond with JSON adhering to this structure:
{
  "botanicalIdentity": "Common name or identified flower name",
  "scientificName": "A clever, humorous pseudo-botanical Latin binomial (e.g. Hibiscus procrastinatus, Rosa bunkeria)",
  "estimatedPetals": (number: estimate petal count, e.g. 5, 24, 60),
  "verdict": "A witty, deadpan 1-2 sentence official botanical census verdict about this specimen on a college campus",
  "campusRiskLevel": "A funny rating like 'Watchman whistle risk: 75%' or 'Stray bee collision rate: Moderate'",
  "academicEquivalent": "What engineering/college subject or student behavior this flower mirrors",
  "uselessFunFact": "A hilarious, hyper-specific useless statistic or campus lore about this blossom"
}`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      } catch (parseErr) {
        console.error('JSON parse error from Gemini response:', parseErr, responseText);
      }
    }

    // Fallback if AI is unconfigured or failed
    const randomIndex = Math.floor(Math.random() * FALLBACK_VERDICTS.length);
    const chosenFallback = { ...FALLBACK_VERDICTS[randomIndex] };
    if (flowerName && flowerName.trim()) {
      chosenFallback.botanicalIdentity = flowerName.trim();
    }
    return res.json({ success: true, data: chosenFallback, engine: 'campus-bureau-local' });
  } catch (error: any) {
    console.error('Error in /api/examine-flower:', error);
    const randomIndex = Math.floor(Math.random() * FALLBACK_VERDICTS.length);
    return res.json({
      success: true,
      data: FALLBACK_VERDICTS[randomIndex],
      engine: 'campus-bureau-fallback',
      warning: error?.message,
    });
  }
});

// Setup dev server with Vite middlewares or production static serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🌸 VAST Floradex Server running on http://localhost:${port}`);
  });
}

startServer();
