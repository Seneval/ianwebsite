# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

iAN (Inteligencia Artificial para Negocios) is a static website for a business offering AI-powered services, specifically:
- AI Chatbots for businesses
- Digital prospecting with AI (Facebook Ads, Instagram Ads, Google Ads)
- Traditional web development services
- AI courses

The site is deployed using GitHub Pages at inteligenciaartificialparanegocios.com.

## Development Environment

This is a static HTML/CSS/JavaScript website with no build process or dependencies. Development is done directly on the HTML, CSS, and JavaScript files.

### Running Locally
Simply open `index.html` in a web browser. Note that links use relative paths (e.g., `desarrollo-web.html` instead of `/desarrollo-web.html`) to work locally.

### Deployment
The site is deployed automatically via GitHub Pages:
```bash
git add .
git commit -m "Your commit message"
git push origin main
git push origin main:gh-pages --force
```

## Architecture

### Page Structure
- `index.html` - Main landing page for AI chatbot services
- `desarrollo-web.html` - Web development services page
- `prospeccion-ia.html` - Digital prospecting with AI services
- `cursos-ia.html` - AI courses page

### Component Organization
- `css/styles.css` - Main stylesheet with CSS variables and responsive design
- `css/animations.css` - Animation utilities
- `js/main.js` - Core functionality (navigation, mobile menu, form handling)
- `js/*-animations.js` - Page-specific animations
- `components/whatsapp-button.js` - WhatsApp floating button component

### Key Technical Details

1. **Form Integration**: All forms use Web3Forms API with the access key: `cdc4bf5e-a398-4dbd-8f38-b6628968434a`

2. **Navigation Structure**: 
   - Desktop: Dropdown menu under "Otros Servicios"
   - Mobile: Hamburger menu with slide-in navigation

3. **CSS Variables**:
   ```css
   --primary: #4F46E5 (Indigo)
   --secondary: #7C3AED (Purple)
   --white: #FFFFFF
   --gray-900: #111827
   ```

4. **Animation Patterns**: 
   - Uses Intersection Observer for scroll animations
   - CSS transitions for hover states
   - JavaScript-driven metric animations

## Important Considerations

1. **No AI in Web Development**: The web development service offers traditional websites only - no AI features or personalization.

2. **Service Pricing**:
   - Chatbots: $29,000 - $89,000 MXN
   - Web Development: $8,500 - $35,000 MXN
   - Digital Prospecting: $8,000 - $12,000/month MXN
   - AI Courses: $3,990 - $12,990 MXN

3. **Case Studies**: Currently uses placeholder examples (Inmobiliaria, Eventos, Maquinaria Industrial)

4. **Mobile-First Design**: All styles prioritize mobile responsiveness with breakpoints at 768px and 1024px.