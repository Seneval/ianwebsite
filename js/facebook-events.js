/**
 * Facebook Pixel Events Tracking
 * Sistema completo de tracking para iAN (Inteligencia Artificial para Negocios)
 */

// Función para trackear eventos de forma segura
function trackFacebookEvent(eventName, parameters = {}) {
    if (typeof fbq !== 'undefined') {
        try {
            fbq('track', eventName, parameters);
            console.log(`✅ Facebook Event: ${eventName}`, parameters);
        } catch (error) {
            console.error('❌ Error tracking Facebook event:', error);
        }
    } else {
        console.warn('⚠️ Facebook Pixel not loaded');
    }
}

// Función para trackear eventos personalizados
function trackCustomEvent(eventName, parameters = {}) {
    if (typeof fbq !== 'undefined') {
        try {
            fbq('trackCustom', eventName, parameters);
            console.log(`✅ Custom Facebook Event: ${eventName}`, parameters);
        } catch (error) {
            console.error('❌ Error tracking custom Facebook event:', error);
        }
    } else {
        console.warn('⚠️ Facebook Pixel not loaded');
    }
}

// EVENTOS ESTÁNDAR DE FACEBOOK

// 1. Evento Lead (formularios completados)
function trackLead(serviceType = 'general', value = 0) {
    trackFacebookEvent('Lead', {
        content_name: `Lead ${serviceType}`,
        content_category: serviceType,
        value: value,
        currency: 'MXN'
    });
}

// 2. Evento Contact (WhatsApp, teléfono)
function trackContact(contactType = 'general', serviceType = 'general') {
    trackFacebookEvent('Contact', {
        content_name: `Contact via ${contactType}`,
        content_category: serviceType,
        contact_method: contactType
    });
}

// 3. Evento InitiateCheckout (iniciar formulario)
function trackInitiateCheckout(serviceType = 'general', value = 0) {
    trackFacebookEvent('InitiateCheckout', {
        content_name: `Form Start ${serviceType}`,
        content_category: serviceType,
        value: value,
        currency: 'MXN'
    });
}

// 4. Evento CompleteRegistration (para cursos)
function trackCompleteRegistration(courseType = 'general') {
    trackFacebookEvent('CompleteRegistration', {
        content_name: `Course Registration ${courseType}`,
        content_category: 'ai_courses',
        value: 5000,
        currency: 'MXN'
    });
}

// EVENTOS PERSONALIZADOS

// 1. WhatsApp Click
function trackWhatsAppClick(serviceType = 'general', message = '') {
    trackCustomEvent('WhatsAppClick', {
        service_type: serviceType,
        contact_method: 'whatsapp',
        message_type: message.includes('chatbot') ? 'chatbot' : 
                     message.includes('prospección') ? 'prospeccion' : 
                     message.includes('desarrollo') ? 'desarrollo' : 
                     message.includes('curso') ? 'cursos' : 'general'
    });
    
    // También trackear evento estándar Contact
    trackContact('whatsapp', serviceType);
}

// 2. Phone Click
function trackPhoneClick(serviceType = 'general') {
    trackCustomEvent('PhoneClick', {
        service_type: serviceType,
        contact_method: 'phone',
        phone_number: '+528112500801'
    });
    
    // También trackear evento estándar Contact
    trackContact('phone', serviceType);
}

// 3. CTA Button Clicks
function trackCTAClick(ctaText, serviceType = 'general', value = 0) {
    trackCustomEvent('CTAClick', {
        cta_text: ctaText,
        service_type: serviceType,
        value: value,
        currency: 'MXN'
    });
}

// 4. Form Start (cuando empiezan a llenar formulario)
function trackFormStart(serviceType = 'general') {
    trackCustomEvent('FormStart', {
        service_type: serviceType,
        form_type: 'contact_form'
    });
    
    // También trackear evento estándar InitiateCheckout
    trackInitiateCheckout(serviceType, getServiceValue(serviceType));
}

// 5. Service Interest (interacciones específicas por servicio)
function trackServiceInterest(serviceType, interactionType = 'view') {
    trackCustomEvent('ServiceInterest', {
        service_type: serviceType,
        interaction_type: interactionType,
        value: getServiceValue(serviceType),
        currency: 'MXN'
    });
}

// 6. Scroll Depth Tracking
function trackScrollDepth(percentage, serviceType = 'general') {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
        trackCustomEvent('ScrollDepth', {
            scroll_percentage: percentage,
            service_type: serviceType,
            page_url: window.location.pathname
        });
    }
}

// FUNCIONES AUXILIARES

// Obtener valor estimado por tipo de servicio
function getServiceValue(serviceType) {
    const serviceValues = {
        'chatbot_ia': 29000,
        'main_service': 29000,
        'prospeccion_ia': 8000,
        'prospection_service': 8000,
        'desarrollo_web': 15000,
        'web_development': 15000,
        'cursos_ia': 5000,
        'ai_courses': 5000,
        'general': 15000
    };
    return serviceValues[serviceType] || 15000;
}

// Detectar tipo de servicio por URL
function getServiceTypeFromURL() {
    const pathname = window.location.pathname;
    if (pathname.includes('prospeccion')) return 'prospeccion_ia';
    if (pathname.includes('desarrollo')) return 'desarrollo_web';
    if (pathname.includes('cursos')) return 'cursos_ia';
    if (pathname.includes('index') || pathname === '/') return 'chatbot_ia';
    return 'general';
}

// INICIALIZACIÓN AUTOMÁTICA

document.addEventListener('DOMContentLoaded', function() {
    const serviceType = getServiceTypeFromURL();
    
    // 1. Trackear WhatsApp clicks
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], .whatsapp-float');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const message = href.includes('text=') ? decodeURIComponent(href.split('text=')[1]) : '';
            trackWhatsAppClick(serviceType, message);
        });
    });
    
    // 2. Trackear phone clicks
    const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
    phoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackPhoneClick(serviceType);
        });
    });
    
    // 3. Trackear CTA buttons
    const ctaButtons = document.querySelectorAll('.primary-button, .cta-button, .pricing-cta, .submit-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ctaText = this.textContent.trim();
            const value = getServiceValue(serviceType);
            trackCTAClick(ctaText, serviceType, value);
        });
    });
    
    // 4. Trackear form starts (cuando hacen focus en primer input)
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
        const firstInput = form.querySelector('input, textarea, select');
        if (firstInput) {
            let formStarted = false;
            firstInput.addEventListener('focus', function() {
                if (!formStarted) {
                    formStarted = true;
                    trackFormStart(serviceType);
                }
            });
        }
    });
    
    // 5. Trackear form submissions (Lead)
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const value = getServiceValue(serviceType);
            trackLead(serviceType, value);
        });
    });
    
    // 6. Scroll depth tracking
    let scrollDepthTracked = {25: false, 50: false, 75: false, 100: false};
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        Object.keys(scrollDepthTracked).forEach(depth => {
            if (scrollPercent >= parseInt(depth) && !scrollDepthTracked[depth]) {
                scrollDepthTracked[depth] = true;
                trackScrollDepth(parseInt(depth), serviceType);
            }
        });
    });
    
    // 7. Trackear service interest después de 30 segundos en página
    setTimeout(() => {
        trackServiceInterest(serviceType, 'engaged_view');
    }, 30000);
    
    console.log('🚀 Facebook Events Tracking initialized for service:', serviceType);
});

// Funciones globales para uso manual
window.trackFacebookEvent = trackFacebookEvent;
window.trackCustomEvent = trackCustomEvent;
window.trackWhatsAppClick = trackWhatsAppClick;
window.trackPhoneClick = trackPhoneClick;
window.trackCTAClick = trackCTAClick;
window.trackLead = trackLead;
window.trackServiceInterest = trackServiceInterest;