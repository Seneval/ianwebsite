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

## Admin Dashboard

### Access
- URL: `/admin/` (e.g., http://localhost:3000/admin/)
- Default credentials: username: `admin`, password: `admin123`

### Features
- **Client Management**: Add, edit, delete clients
- **Widget Code Generation**: Instant widget code for clients
- **Usage Tracking**: Monitor messages and sessions per client
- **Token Management**: Regenerate client tokens
- **Payment Notes**: Track payment status in notes field

### Dashboard Structure
```
/admin/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── css/admin.css       # Styles
└── js/
    ├── auth.js         # Authentication logic
    ├── api.js          # API wrapper
    └── dashboard.js    # Dashboard functionality
```

## Facebook Pixel Implementation

### Current Setup
- **Pixel ID**: `1524862538485702` (iAN Mexico)
- **Domain Verification**: Meta tag added to all pages
- **Comprehensive Tracking**: `/js/facebook-events.js` handles all events

### Standard Events Configured
- **Lead**: Form completions with service-specific values
- **Contact**: WhatsApp/phone clicks with contact type
- **InitiateCheckout**: Form interactions and service interest
- **ViewContent**: Page views with service categorization

### Custom Events
- **WhatsAppClick**: Message type detection and tracking
- **CTAClick**: Button interactions across all pages
- **FormStart**: First input focus tracking
- **ServiceInterest**: 30-second page engagement
- **ScrollDepth**: 25%, 50%, 75%, 100% tracking

### Auto-Detection Features
```javascript
// Service type by URL detection
// Automatic event binding to forms, buttons, links
// Rate limiting to prevent duplicate events
// Value attribution by service type ($8K-$89K MXN)
```

## Google Search Console Integration

### MCP Server Configuration
- **Service Account**: `gsc-mcp-ian@gen-lang-client-0982248781.iam.gserviceaccount.com`
- **Credentials File**: `gen-lang-client-*.json` (local only, in .gitignore)
- **Permissions**: Full access to `sc-domain:inteligenciaartificialparanegocios.com`

### Available MCP Tools
```bash
# List configured sites
mcp__gsc__list_sites

# Get search analytics data
mcp__gsc__search_analytics --siteUrl="sc-domain:domain.com" --startDate="2025-07-01" --endDate="2025-07-17"

# Inspect URL indexation status
mcp__gsc__index_inspect --siteUrl="sc-domain:domain.com" --inspectionUrl="https://domain.com/page.html"

# Submit sitemaps
mcp__gsc__submit_sitemap --siteUrl="sc-domain:domain.com" --feedpath="https://domain.com/sitemap.xml"
```

### SEO Status (Last Updated: July 2025)
- **4 main pages indexed** (homepage, services pages)
- **Complete SEO optimization** applied (meta tags, structured data, internal linking)
- **Keywords targeted**: "chatbots IA mexico", "prospección IA", "desarrollo web mexico"
- **Automatic monitoring**: 24/7 search performance tracking available

## Dual Backend Architecture

### Main Backend (`/backend/`)
- **Full-featured**: Admin panel, MongoDB, analytics
- **OpenAI SDK**: v5.7.0 with complete Assistants API
- **Authentication**: Dual JWT system (client + admin)
- **Database**: MongoDB with Mongoose models (Client, Session, Message)

### Simple API (`/api/`)
- **Lightweight**: Vercel serverless function
- **OpenAI SDK**: v4.56.0 with chat completions only
- **Model**: GPT-4o-mini for cost efficiency
- **Use Case**: Basic chat without admin features

### API Development Commands
```bash
cd api
npm run dev          # Start Vercel dev server
npm run deploy       # Deploy to Vercel
```

## MongoDB Integration

### Environment Variables Required
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
OPENAI_API_KEY=sk-...
JWT_SECRET=your_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
```

### Data Models
- **Client**: Business info, assistant ID, payment status, message limits
- **Session**: Chat session tracking with analytics
- **Message**: Conversation history with performance metrics

## Security & Deployment

### Credentials Management
- **Google Cloud credentials**: Local only, excluded from git
- **API keys**: Environment variables only
- **JWT secrets**: Separate for client/admin access
- **Rate limiting**: 30 requests/minute per IP

### Deployment Pipeline
1. **Frontend**: GitHub Pages (automatic from main branch)
2. **Backend**: Vercel (manual deployment)
3. **Database**: MongoDB Atlas (cloud hosted)
4. **Domain**: `inteligenciaartificialparanegocios.com` with Facebook verification

## Important Notes
- **Facebook Pixel**: Tracks complete customer journey with MXN pricing
- **SEO**: 100% optimized with structured data and geo-targeting
- **Monitoring**: Automated SEO performance tracking via GSC MCP
- **Multi-tenant**: Each client isolated with unique assistant and token
- **Production ready**: Error handling, logging, graceful shutdowns