# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

iAN (Inteligencia Artificial para Negocios) is a multi-component project consisting of:
1. A static marketing website (deployed via GitHub Pages)
2. A Node.js backend API for AI chatbot services
3. A JavaScript widget for embedding chatbots on client websites

### Services Offered
- AI Chatbots for businesses (powered by OpenAI Assistants API)
- Digital prospecting with AI (Facebook Ads, Instagram Ads, Google Ads)
- Traditional web development services
- AI courses

## Project Structure

```
/
├── index.html              # Main static website files
├── desarrollo-web.html
├── prospeccion-ia.html
├── cursos-ia.html
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── api/          # API routes
│   │   └── middleware/   # Auth middleware
│   └── package.json
└── widget/               # Embeddable chat widget
    ├── src/
    └── build/
```

## Development Commands

### Backend Development
```bash
cd backend
npm install              # Install dependencies
npm run dev             # Run with hot-reload (uses nodemon)
npm start               # Run in production mode
```

### Widget Development
```bash
cd widget
npm install             # Install dependencies
npm run build           # Build widget
npm run watch           # Watch and rebuild on changes
```

### Frontend (Static Site)
No build process required. Open `index.html` directly in a browser.

## Backend Architecture

### Technology Stack
- Node.js >= 18.0.0
- Express.js
- OpenAI SDK v5.7.0
- JWT for authentication
- MongoDB (planned, currently in-memory)

### Key API Endpoints
- `/api/auth/*` - Client and admin authentication
- `/api/chat/*` - Chat session management and messaging
- `/api/analytics/*` - Usage analytics and insights
- `/test-assistant` - Test page for OpenAI integration
- `/demo.html` - Chat widget demo page

### Environment Configuration
Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
PORT=3000
```

## Critical OpenAI Assistant API Integration

### IMPORTANT: Correct API Call Format
When using the OpenAI SDK v5.7.0 to retrieve run status, the correct format is:

```javascript
// CORRECT - thread_id must be passed in params object
const runStatus = await openai.beta.threads.runs.retrieve(runId, { thread_id: threadId });

// INCORRECT - These will fail with "Invalid 'thread_id': 'undefined'"
const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
const runStatus = await openai.beta.threads.runs.retrieve(runId);
```

### Assistant Flow
1. Create a thread: `openai.beta.threads.create()`
2. Add message to thread: `openai.beta.threads.messages.create(threadId, {...})`
3. Create run: `openai.beta.threads.runs.create(threadId, { assistant_id })`
4. Poll for completion: `openai.beta.threads.runs.retrieve(runId, { thread_id: threadId })`
5. Retrieve messages: `openai.beta.threads.messages.list(threadId)`

## Widget Integration

### Embedding the Widget
```html
<script>
  window.CHATBOT_API_URL = 'http://localhost:3000/api'; // or production URL
  window.CHATBOT_DEMO_MODE = false; // Set to true for demo mode
  
  (function() {
    var script = document.createElement('script');
    script.src = '/widget.js'; // or full URL in production
    script.setAttribute('data-client-token', 'YOUR_CLIENT_TOKEN');
    script.setAttribute('data-position', 'bottom-right');
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
```

### Widget Build Process
The widget is built using Terser for minification. Source files in `widget/src/` are combined and minified to `widget/build/widget.js` and `widget/build/widget.min.js`.

## Authentication System

### Multi-Tenant Architecture
- Each client gets a unique JWT token
- Tokens include `clientId` and `assistantId`
- Middleware validates tokens for all chat endpoints

### Token Structure
```javascript
{
  clientId: "uuid",
  businessName: "Client Name",
  assistantId: "asst_xxxxx", // OpenAI Assistant ID
  iat: timestamp,
  exp: timestamp
}
```

## Frontend (Static Site)

### CSS Variables
```css
--primary: #4F46E5 (Indigo)
--secondary: #7C3AED (Purple)
--white: #FFFFFF
--gray-900: #111827
```

### Key Integrations
- Web3Forms API for contact forms (access key: `cdc4bf5e-a398-4dbd-8f38-b6628968434a`)
- Intersection Observer for scroll animations
- Mobile-first responsive design (breakpoints: 768px, 1024px)

### Deployment
GitHub Pages deployment:
```bash
git add .
git commit -m "Your commit message"
git push origin main
git push origin main:gh-pages --force
```

## Service Pricing
- Chatbots: $29,000 - $89,000 MXN
- Web Development: $8,500 - $35,000 MXN
- Digital Prospecting: $8,000 - $12,000/month MXN
- AI Courses: $3,990 - $12,990 MXN

## Important Notes
- The web development service offers traditional websites only (no AI features)
- Case studies currently use placeholder examples
- Backend designed for Vercel deployment
- Rate limiting: 30 requests/minute per IP