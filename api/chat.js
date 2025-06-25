import OpenAI from 'openai';
import Cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize CORS middleware
const cors = Cors({
  origin: process.env.ALLOWED_ORIGIN || 'https://inteligenciaartificialparanegocios.com',
  methods: ['POST', 'OPTIONS'],
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper method to wait for middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// System prompt optimized for your AI chatbot sales service
const SYSTEM_PROMPT = `Eres un chatbot de ventas para iAN (Inteligencia Artificial para Negocios), especializado en chatbots conversacionales que aumentan ventas.

INFORMACIÓN CLAVE:
- Nuestros chatbots cuestan $29,000 - $89,000 MXN (pago único)
- Sin menús robóticos, solo conversación natural
- Aumentan conversiones 30-50%
- Implementación en 3 días
- Atención 24/7 automática
- WhatsApp: 811 250 0801

OBJETIVO: Convertir visitantes en clientes potenciales calificados.

ESTILO:
- Conversacional y amigable
- Enfocado en beneficios, no características
- Usa emojis moderadamente
- Respuestas concisas (máx 3-4 líneas)
- Crea urgencia sin ser agresivo

NUNCA:
- Menciones competidores
- Des precios exactos en la primera interacción
- Uses términos muy técnicos
- Respondas sobre temas no relacionados al negocio`;

// Rate limiting in-memory store
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userRecord = rateLimitStore.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Clean up old entries
  if (now > userRecord.resetTime) {
    userRecord.count = 0;
    userRecord.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userRecord.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  userRecord.count++;
  rateLimitStore.set(ip, userRecord);
  return true;
}

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Demasiadas solicitudes. Por favor, espera un momento.' });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Validate message length
    if (message.length > 500) {
      return res.status(400).json({ error: 'El mensaje es demasiado largo. Máximo 500 caracteres.' });
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.8,
      max_tokens: 250,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
    });

    const botResponse = completion.choices[0].message.content;

    // Return response
    res.status(200).json({
      response: botResponse,
      usage: {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens,
      }
    });

  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'El servicio está experimentando alta demanda. Por favor, intenta de nuevo en unos segundos.' 
      });
    }
    
    if (error.status === 401) {
      return res.status(500).json({ 
        error: 'Error de configuración del servicio. Por favor, contacta al administrador.' 
      });
    }

    // Generic error
    res.status(500).json({ 
      error: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.' 
    });
  }
}