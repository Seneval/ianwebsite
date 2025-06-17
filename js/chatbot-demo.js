// Chatbot demo functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (!chatMessages || !userInput || !sendButton) return;

    // Conversation state
    let lastUserMessageTime = Date.now();
    let conversationActive = false;
    let inactivityTimer = null;

    // Bot responses based on keywords
    const responses = {
        precio: [
            'Nuestros chatbots cuestan $3,000/mes para sitios web y $5,000/mes para e-commerce. Con un ROI promedio del 300% en 6 meses, la inversión se paga sola. ¿Qué tipo de negocio tienes?',
            'La inversión es de $3,000 mensuales (sitios web) o $5,000 (e-commerce). Incluye conversaciones ilimitadas, soporte 24/7 y actualizaciones constantes. ¿Te gustaría ver cómo funcionaría en tu sitio?'
        ],
        costo: [
            'Manejamos dos planes simples: $3,000/mes para sitios web y $5,000/mes para tiendas online. La mayoría de nuestros clientes recuperan la inversión en el primer mes. ¿Cuántos visitantes recibes al mes?',
            'La inversión depende del tipo de sitio: $3,000/mes (servicios) o $5,000/mes (e-commerce). Considerando que aumentamos las ventas un 87% en promedio, es una inversión muy rentable. ¿Te interesaría una demo personalizada?'
        ],
        tiempo: [
            '¡En solo 3 días tu chatbot estará vendiendo! Día 1: analizamos tu sitio y productos. Día 2: entrenamos la IA con tu información. Día 3: lo integramos y empieza a convertir. ¿Cuándo te gustaría empezar?',
            'El proceso completo toma 3 días: análisis, entrenamiento e integración. Es súper rápido porque usamos IA avanzada que aprende de tu sitio. ¿Ya tienes fecha en mente para lanzarlo?'
        ],
        funciona: [
            'Nuestro chatbot analiza tu sitio web, aprende sobre tus productos/servicios y mantiene conversaciones naturales con tus visitantes. Sin menús robóticos, solo conversación fluida que convierte. ¿Te muestro un ejemplo con tu industria?',
            'Funciona con IA conversacional: entiende preguntas complejas, recuerda el contexto, sugiere productos y cierra ventas automáticamente. Todo sin frustrantes menús predefinidos. ¿Qué tipo de preguntas recibes más en tu negocio?'
        ],
        demo: [
            '¡Me encantaría mostrarte una demo personalizada! En 30 minutos verás exactamente cómo aumentaría tus ventas. ¿Prefieres agendar por WhatsApp (811 250 0801) o te contactamos por el formulario?',
            'Claro, podemos hacer una demo específica para tu negocio. Verás en vivo cómo el chatbot maneja objeciones y cierra ventas. ¿Cuál es tu sitio web? Así preparo ejemplos reales.'
        ],
        contacto: [
            'Perfecto, tienes dos opciones rápidas: 1) WhatsApp al 811 250 0801 para respuesta inmediata, o 2) Llena el formulario abajo y te contactamos en menos de 2 horas. ¿Cuál prefieres?',
            '¡Excelente decisión! Puedes escribirnos al WhatsApp 811 250 0801 ahora mismo, o si prefieres, deja tus datos en el formulario. Nuestro equipo está listo para aumentar tus ventas. ¿Qué método te resulta más cómodo?'
        ],
        beneficios: [
            'Los beneficios principales son: ✅ 87% más conversiones ✅ Atención 24/7 sin descanso ✅ 0 frustración (sin menús) ✅ Califica leads automáticamente ✅ ROI del 300%. ¿Cuál te llama más la atención?',
            'Imagina esto: mientras duermes, tu chatbot está cerrando ventas. Nuestros clientes ven +87% en conversiones, -80% en consultas repetitivas y clientes 95% más satisfechos. ¿Qué problema específico quieres resolver?'
        ],
        diferencia: [
            'La diferencia es ENORME: otros chatbots frustran con menús tipo "Presiona 1 para...". El nuestro conversa naturalmente, entiende contexto y se enfoca 100% en vender. Es como tener a tu mejor vendedor trabajando 24/7. ¿Has tenido malas experiencias con chatbots?',
            'Simple: chatbots tradicionales = menús robóticos que espantan clientes. Nuestro chatbot = conversaciones naturales que venden. Entrenado específicamente con TU información para cerrar TUS ventas. ¿Qué tan personalizado necesitas que sea?'
        ],
        ecommerce: [
            'Para e-commerce es ESPECTACULAR: recomienda productos complementarios (+45% ticket promedio), recupera carritos abandonados, resuelve dudas de envío al instante y hace upselling inteligente. ¿Cuántos carritos abandonados tienes al mes?',
            'Tu tienda online necesita esto: el chatbot actúa como personal shopper 24/7, sugiere tallas, informa sobre stock, calcula envíos y cierra ventas automáticamente. ¿Qué plataforma de e-commerce usas?'
        ],
        resultados: [
            'Los números son impresionantes: 87% más ventas en promedio, ROI del 300% en 6 meses, 80% menos carga en soporte. Un cliente de muebles pasó de 10 a 47 ventas mensuales. ¿Te gustaría ver casos de tu industria?',
            'Resultados reales: ClienteX aumentó conversiones 134%, ClienteY redujo costo por lead 67%, ClienteZ automatizó 89% de su soporte. Todos recuperaron la inversión en 30 días. ¿Qué métrica es más importante para ti?'
        ],
        proceso: [
            'El proceso es simple: 1) Analizamos tu sitio y objetivos, 2) Entrenamos la IA con tu información, 3) Integramos en tu web, 4) ¡Empieza a vender! Todo en 3 días. ¿Tienes alguna pregunta sobre el proceso?',
            'Día 1: Estudiamos tu negocio y productos. Día 2: Configuramos y entrenamos la IA. Día 3: Lo integramos y optimizamos. Después, soporte continuo para maximizar resultados. ¿Listo para empezar?'
        ],
        implementacion: [
            'La implementación es súper sencilla: solo agregamos un pequeño código a tu sitio (como Google Analytics). No afecta velocidad ni SEO. Funciona con cualquier plataforma: WordPress, Shopify, sitios custom, etc. ¿Qué plataforma usas?',
            'Implementar es facilísimo: 1 línea de código y listo. Compatible con TODAS las plataformas. No requiere cambios en tu sitio. Tu equipo no necesita hacer nada. ¿Prefieres que nos encarguemos de todo?'
        ],
        empresa: [
            'iAN (Inteligencia Artificial para Negocios) somos expertos en chatbots que venden. Nuestro equipo combina IA avanzada con psicología de ventas para crear conversaciones que convierten. ¿Te gustaría conocer casos de éxito?',
            'Somos iAN, especializados en IA conversacional para ventas. Nuestros chatbots no son herramientas de soporte, son máquinas de vender entrenadas específicamente para TU negocio. ¿Qué te gustaría saber de nosotros?'
        ],
        negocio: [
            'Cuéntame más sobre tu negocio. ¿Vendes productos o servicios? ¿B2B o B2C? Con esa información puedo mostrarte exactamente cómo un chatbot multiplicaría tus ventas.',
            '¡Me encantaría conocer tu negocio! ¿Qué vendes? ¿Cuál es tu cliente ideal? ¿Qué preguntas te hacen más seguido? Así puedo explicarte específicamente cómo te ayudaríamos.'
        ],
        dudas: [
            'Entiendo que tengas dudas, es una decisión importante. ¿Qué te preocupa específicamente? ¿El costo? ¿La implementación? ¿Los resultados? Déjame aclarar cualquier inquietud.',
            'Es normal tener preguntas antes de invertir. ¿Qué necesitas saber para tomar la mejor decisión? Puedo mostrarte garantías, casos de éxito, o agendar una llamada sin compromiso.'
        ],
        garantia: [
            'Ofrecemos 30 días de prueba. Si no ves resultados, te devolvemos tu dinero. Así de seguros estamos. Además, incluimos soporte y optimizaciones continuas. ¿Qué más necesitas para sentirte seguro?',
            'Tu inversión está protegida: garantía de satisfacción, soporte incluido, sin contratos largos. Puedes cancelar cuando quieras. Nuestro éxito depende del tuyo. ¿Listo para probarlo sin riesgo?'
        ],
        competencia: [
            'La mayoría usa chatbots genéricos con menús frustrantes. Nosotros creamos IA conversacional entrenada ESPECÍFICAMENTE para tu negocio. Es la diferencia entre un robot y un súper vendedor. ¿Has probado otros chatbots antes?',
            'Otros chatbots: menús, respuestas genéricas, cero personalización. iAN: conversación natural, entrenado con TU información, 100% enfocado en vender. ¿Prefieres cantidad o calidad en tus ventas?'
        ],
        urgencia: [
            '¿Sabías que cada día sin chatbot pierdes ventas las 24 horas? Mientras lo piensas, tus competidores ya están vendiendo automáticamente. ¿Cuándo te gustaría empezar a recuperar esas ventas perdidas?',
            'El mejor momento para implementar fue ayer, el segundo mejor es HOY. En 3 días podrías estar vendiendo 24/7. ¿Qué te detiene para empezar ahora mismo?'
        ],
        objeciones: [
            'Entiendo tu preocupación. ¿Es por el precio? Recuerda que el ROI promedio es 300%. ¿La tecnología? Es tan simple como copiar y pegar. ¿Los resultados? Tenemos garantía de 30 días. ¿Qué te preocupa exactamente?',
            'Las objeciones más comunes: "Es caro" (se paga solo), "Es complicado" (3 días y listo), "No funcionará en mi nicho" (funciona en TODOS). ¿Cuál es tu mayor duda?'
        ],
        servicios: [
            'Para empresas de servicios es IDEAL: califica leads automáticamente, agenda citas 24/7, responde FAQs al instante y pre-vende tus servicios. ¿Cuánto tiempo pierdes en consultas que no compran?',
            'Si ofreces servicios, imagina: el chatbot filtra clientes potenciales, agenda consultas solo con interesados reales, y los prepara antes de hablar contigo. ¿No sería genial enfocarte solo en cerrar?'
        ],
        soporte: [
            'El soporte está incluido: actualizaciones mensuales, optimizaciones continuas, reentrenamiento según resultados. Nuestro equipo asegura que tu chatbot mejore constantemente. ¿Qué tipo de soporte valoras más?',
            'No te dejamos solo: soporte prioritario, dashboard con métricas, sugerencias de mejora mensuales. Es como tener un consultor de ventas dedicado. ¿Te gustaría ver cómo funciona el soporte?'
        ],
        default: [
            'Excelente pregunta. Soy un ejemplo de cómo tu negocio podría estar vendiendo 24/7. ¿Te gustaría saber sobre precios, ver resultados reales o agendar una demo personalizada?',
            'Gracias por tu interés. Puedo explicarte cómo aumentar tus ventas 87%, mostrarte casos de éxito o ayudarte a calcular tu ROI. ¿Qué información te sería más útil?',
            'Interesante punto. Como chatbot de iAN, puedo conversar naturalmente sobre cualquier tema. ¿Prefieres que te cuente sobre beneficios, proceso de implementación o casos de tu industria?'
        ]
    };

    // Find best response based on user input
    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Check each keyword category with priority order
        const keywordPriority = [
            'contacto', 'demo', 'precio', 'costo', 'tiempo', 'implementacion',
            'funciona', 'beneficios', 'resultados', 'diferencia', 'garantia',
            'ecommerce', 'servicios', 'proceso', 'empresa', 'negocio',
            'dudas', 'objeciones', 'competencia', 'soporte', 'urgencia'
        ];
        
        for (const keyword of keywordPriority) {
            if (lowerInput.includes(keyword) && responses[keyword]) {
                return responses[keyword][Math.floor(Math.random() * responses[keyword].length)];
            }
        }
        
        // More specific patterns
        if (lowerInput.includes('cuanto') || lowerInput.includes('cuánto') || lowerInput.includes('precio') || lowerInput.includes('costo')) {
            return responses.precio[Math.floor(Math.random() * responses.precio.length)];
        }
        
        if (lowerInput.includes('cuando') || lowerInput.includes('cuándo') || lowerInput.includes('dias') || lowerInput.includes('días')) {
            return responses.tiempo[Math.floor(Math.random() * responses.tiempo.length)];
        }
        
        if (lowerInput.includes('whatsapp') || lowerInput.includes('llamar') || lowerInput.includes('contactar') || lowerInput.includes('hablar')) {
            return responses.contacto[Math.floor(Math.random() * responses.contacto.length)];
        }
        
        if (lowerInput.includes('como funciona') || lowerInput.includes('cómo funciona') || lowerInput.includes('que hace')) {
            return responses.funciona[Math.floor(Math.random() * responses.funciona.length)];
        }
        
        if (lowerInput.includes('hola') || lowerInput.includes('hi') || lowerInput.includes('buenos') || lowerInput.includes('buen dia')) {
            return '¡Hola! 👋 Soy un chatbot de iAN, especializado en convertir visitantes en clientes. Puedo ayudarte a entender cómo aumentar tus ventas 87% con IA conversacional. ¿Qué te gustaría saber?';
        }
        
        if (lowerInput.includes('gracias') || lowerInput.includes('perfecto') || lowerInput.includes('genial')) {
            return '¡Me alegra poder ayudarte! Si quieres ver cómo un chatbot como yo puede transformar tu negocio, contáctanos al 811 250 0801 o llena el formulario. ¡Tu competencia ya está vendiendo 24/7! 🚀';
        }
        
        if (lowerInput.includes('no se') || lowerInput.includes('no sé') || lowerInput.includes('ayuda')) {
            return 'No te preocupes, estoy aquí para ayudarte. Puedo contarte sobre: 1) Cómo aumentar tus ventas con IA, 2) Nuestros precios y garantías, 3) Ver una demo personalizada. ¿Qué prefieres?';
        }
        
        if (lowerInput.includes('si') && lowerInput.length < 5) {
            return '¡Excelente! ¿En qué más puedo ayudarte? Recuerda que puedes agendar una demo gratuita por WhatsApp (811 250 0801) para ver exactamente cómo funcionaría en tu negocio.';
        }
        
        if (lowerInput.includes('no') && lowerInput.length < 5) {
            return 'Entiendo. ¿Hay algo específico que te preocupe? Nuestros chatbots tienen garantía de 30 días y el ROI promedio es del 300%. ¿Qué necesitas saber para tomar la mejor decisión?';
        }
        
        // Default response
        return responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    // Add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        if (!isUser) {
            // Show typing indicator first
            messageDiv.innerHTML = `
                <div class="message-content typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Replace with actual message after delay
            setTimeout(() => {
                messageDiv.innerHTML = `
                    <div class="message-content">
                        ${text}
                    </div>
                `;
                messageDiv.classList.add('fade-in');
                
                // Add bounce animation to last message
                const allMessages = chatMessages.querySelectorAll('.message');
                const lastMessage = allMessages[allMessages.length - 1];
                if (lastMessage) {
                    lastMessage.style.animation = 'slideInBottom 0.5s ease';
                }
            }, 1000 + Math.random() * 1000);
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    ${text}
                </div>
            `;
            messageDiv.classList.add('fade-in');
            chatMessages.appendChild(messageDiv);
        }
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Update conversation state
        lastUserMessageTime = Date.now();
        conversationActive = true;
        
        // Clear any inactivity timer
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
        
        // Add user message
        addMessage(message, true);
        
        // Clear input
        userInput.value = '';
        
        // Get and add bot response
        const response = getBotResponse(message);
        addMessage(response);
        
        // No inactivity timer to avoid interruptions
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Focus effect on input
    userInput.addEventListener('focus', () => {
        userInput.parentElement.style.boxShadow = '0 0 0 3px rgba(107, 70, 193, 0.2)';
    });

    userInput.addEventListener('blur', () => {
        userInput.parentElement.style.boxShadow = 'none';
    });

    // Animate bot avatar
    const botAvatar = document.querySelector('.bot-avatar.animated');
    if (botAvatar) {
        setInterval(() => {
            botAvatar.style.transform = 'scale(1.1)';
            setTimeout(() => {
                botAvatar.style.transform = 'scale(1)';
            }, 500);
        }, 5000);
    }

    // No quick replies to maintain natural conversation flow
});