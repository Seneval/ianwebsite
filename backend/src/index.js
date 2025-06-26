require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import routes
const chatRoutes = require('./api/chat');
const analyticsRoutes = require('./api/analytics');
const authRoutes = require('./api/auth');

// Import middleware
const { validateClient } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, validate against allowed domains
    // For now, allow all origins in development
    callback(null, true);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Demasiadas solicitudes, intenta de nuevo más tarde.'
});

app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'iAN Chatbot API'
  });
});

// Routes
app.use('/api/chat', validateClient, chatRoutes);
app.use('/api/analytics', validateClient, analyticsRoutes);
app.use('/api/auth', authRoutes);

// Widget serving
app.get('/widget.js', (req, res) => {
  res.sendFile('widget.min.js', { root: '../widget/build' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor iAN Chatbot corriendo en puerto ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;