const express = require('express');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// In-memory storage for now (replace with MongoDB in production)
const sessions = {};
const messageHistory = {};

// Create or get session
router.post('/session', async (req, res) => {
  try {
    const { clientId } = req.client;
    const sessionId = uuidv4();
    
    sessions[sessionId] = {
      clientId,
      threadId: null,
      createdAt: new Date()
    };
    
    // Create OpenAI thread for this session
    const thread = await openai.beta.threads.create();
    sessions[sessionId].threadId = thread.id;
    
    res.json({
      sessionId,
      threadId: thread.id
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ 
      error: 'Error al crear sesión' 
    });
  }
});

// Send message to assistant
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const { clientId, assistantId } = req.client;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        error: 'sessionId y message son requeridos' 
      });
    }
    
    const session = sessions[sessionId];
    if (!session || session.clientId !== clientId) {
      return res.status(404).json({ 
        error: 'Sesión no encontrada' 
      });
    }
    
    // Add message to thread
    await openai.beta.threads.messages.create(session.threadId, {
      role: 'user',
      content: message
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(session.threadId, {
      assistant_id: assistantId
    });
    
    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(
      session.threadId,
      run.id
    );
    
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        session.threadId,
        run.id
      );
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }
    
    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(session.threadId);
    const lastMessage = messages.data[0];
    
    // Store message history for analytics
    if (!messageHistory[clientId]) {
      messageHistory[clientId] = [];
    }
    
    messageHistory[clientId].push({
      sessionId,
      userMessage: message,
      assistantMessage: lastMessage.content[0].text.value,
      timestamp: new Date()
    });
    
    res.json({
      message: lastMessage.content[0].text.value,
      messageId: lastMessage.id
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      error: 'Error al procesar mensaje' 
    });
  }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { clientId } = req.client;
    
    const session = sessions[sessionId];
    if (!session || session.clientId !== clientId) {
      return res.status(404).json({ 
        error: 'Sesión no encontrada' 
      });
    }
    
    const messages = await openai.beta.threads.messages.list(session.threadId);
    
    res.json({
      messages: messages.data.reverse().map(msg => ({
        role: msg.role,
        content: msg.content[0].text.value,
        timestamp: msg.created_at
      }))
    });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ 
      error: 'Error al obtener historial' 
    });
  }
});

module.exports = router;