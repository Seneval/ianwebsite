// Chatbot demo functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (!chatMessages || !userInput || !sendButton) return;

    // Bot responses based on keywords
    const responses = {
        precio: [
            'Nuestros chatbots tienen un precio de $3,000/mes para sitios web estándar y $5,000/mes para e-commerce. ¿Te gustaría saber más detalles?',
            'Los precios varían según la complejidad: $3,000/mes para sitios normales, $5,000/mes para tiendas online. Incluye conversaciones ilimitadas y soporte 24/7.'
        ],
        costo: [
            'La inversión es de $3,000 mensuales para sitios web y $5,000 para e-commerce. El retorno de inversión promedio es del 300% en 6 meses.',
            'Manejamos dos planes: $3,000/mes (sitios web) y $5,000/mes (e-commerce). Ambos incluyen entrenamiento personalizado y actualizaciones.'
        ],
        tiempo: [
            '¡Tu chatbot estará listo en solo 3 días! Día 1: analizamos tu sitio, Día 2: entrenamos la IA, Día 3: ¡ya está vendiendo!',
            'El proceso es súper rápido: 3 días desde que iniciamos hasta que tu chatbot está activo convirtiendo visitantes en clientes.'
        ],
        funciona: [
            'Nuestros chatbots usan IA avanzada para mantener conversaciones naturales, entender las necesidades del cliente y guiarlos hacia la compra.',
            'A diferencia de chatbots tradicionales, el nuestro conversa de forma natural, aprende de cada interacción y está 100% enfocado en cerrar ventas.'
        ],
        demo: [
            '¡Claro! Puedo mostrarte cómo funcionaría en tu negocio. ¿Qué tipo de productos o servicios ofreces?',
            'Me encantaría darte una demo personalizada. ¿Cuál es tu sitio web? Así puedo mostrarte ejemplos específicos.'
        ],
        contacto: [
            'Puedes contactarnos por WhatsApp al 811 250 0801 o llenar el formulario abajo. Te respondemos en menos de 2 horas.',
            '¡Excelente decisión! Contáctanos al 811 250 0801 o deja tus datos en el formulario. Un experto te contactará pronto.'
        ],
        beneficios: [
            'Los principales beneficios son: ✅ Aumento del 87% en conversiones ✅ Atención 24/7 ✅ Respuestas instantáneas ✅ Calificación automática de leads',
            'Con nuestros chatbots obtienes: ventas automatizadas 24/7, mejor experiencia al cliente, reducción de costos de soporte y datos valiosos de tus clientes.'
        ],
        diferencia: [
            'La gran diferencia es que nuestros chatbots conversan naturalmente, no usan menús predefinidos. Entienden el contexto y se adaptan a cada cliente.',
            'Mientras otros chatbots frustran con menús rígidos, el nuestro mantiene conversaciones fluidas y personalizadas que realmente venden.'
        ],
        ecommerce: [
            'Para e-commerce ofrecemos: recomendaciones personalizadas, recuperación de carritos abandonados, seguimiento de pedidos y upselling inteligente.',
            '¡Perfecto para tiendas online! El chatbot sugiere productos, resuelve dudas de envío, recupera ventas perdidas y aumenta el ticket promedio 45%.'
        ],
        resultados: [
            'Nuestros clientes reportan: 87% más conversiones, 300% ROI en 6 meses, 80% menos consultas repetitivas y clientes 95% más satisfechos.',
            'Los números hablan solos: aumento promedio del 87% en ventas, reducción del 80% en tiempo de respuesta y satisfacción del cliente del 95%.'
        ],
        default: [
            'Interesante pregunta. ¿Te gustaría saber sobre precios, beneficios o ver una demo de cómo funcionaría en tu negocio?',
            'Gracias por tu interés. Puedo contarte sobre costos, tiempos de implementación o mostrarte ejemplos. ¿Qué te gustaría saber?',
            '¡Hola! Soy un ejemplo de lo que tu negocio podría tener. ¿Quieres saber cómo aumentar tus ventas con un chatbot como yo?'
        ]
    };

    // Find best response based on user input
    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Check each keyword category
        for (const [keyword, responseArray] of Object.entries(responses)) {
            if (keyword !== 'default' && lowerInput.includes(keyword)) {
                return responseArray[Math.floor(Math.random() * responseArray.length)];
            }
        }
        
        // Check for specific patterns
        if (lowerInput.includes('cuanto') || lowerInput.includes('cuánto')) {
            return responses.precio[Math.floor(Math.random() * responses.precio.length)];
        }
        
        if (lowerInput.includes('hola') || lowerInput.includes('hi') || lowerInput.includes('buenos')) {
            return '¡Hola! 👋 Soy un ejemplo de chatbot con IA. Puedo responder preguntas sobre precios, beneficios, o mostrarte cómo funcionaría en tu negocio. ¿En qué te puedo ayudar?';
        }
        
        if (lowerInput.includes('gracias')) {
            return '¡De nada! Si tienes más preguntas o quieres implementar un chatbot como yo en tu sitio, contáctanos al 811 250 0801. ¡Estaré encantado de ayudarte a vender más!';
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
        
        // Add user message
        addMessage(message, true);
        
        // Clear input
        userInput.value = '';
        
        // Get and add bot response
        const response = getBotResponse(message);
        addMessage(response);
        
        // Add follow-up suggestion after some responses
        if (Math.random() > 0.5) {
            setTimeout(() => {
                const suggestions = [
                    '¿Te gustaría agendar una demo gratuita?',
                    '¿Quieres ver casos de éxito de otros clientes?',
                    '¿Te interesa saber más sobre el proceso de implementación?'
                ];
                addMessage(suggestions[Math.floor(Math.random() * suggestions.length)]);
            }, 3000);
        }
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

    // Quick replies
    const quickReplies = [
        '¿Cuánto cuesta?',
        'Quiero una demo',
        '¿Cómo funciona?',
        'Beneficios principales'
    ];

    // Add quick reply buttons occasionally
    let messageCount = 0;
    const originalAddMessage = addMessage;
    addMessage = function(text, isUser = false) {
        originalAddMessage(text, isUser);
        
        if (!isUser) {
            messageCount++;
            if (messageCount % 3 === 0) {
                setTimeout(() => {
                    const quickReplyDiv = document.createElement('div');
                    quickReplyDiv.className = 'quick-replies fade-in';
                    quickReplyDiv.style.cssText = `
                        display: flex;
                        gap: 10px;
                        margin: 15px 0;
                        flex-wrap: wrap;
                    `;
                    
                    quickReplies.forEach(reply => {
                        const button = document.createElement('button');
                        button.textContent = reply;
                        button.style.cssText = `
                            padding: 8px 16px;
                            border: 2px solid var(--primary-purple);
                            background: transparent;
                            color: var(--primary-purple);
                            border-radius: 20px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        `;
                        
                        button.addEventListener('mouseenter', () => {
                            button.style.background = 'var(--primary-purple)';
                            button.style.color = 'white';
                        });
                        
                        button.addEventListener('mouseleave', () => {
                            button.style.background = 'transparent';
                            button.style.color = 'var(--primary-purple)';
                        });
                        
                        button.addEventListener('click', () => {
                            userInput.value = reply;
                            sendMessage();
                            quickReplyDiv.remove();
                        });
                        
                        quickReplyDiv.appendChild(button);
                    });
                    
                    chatMessages.appendChild(quickReplyDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 2000);
            }
        }
    };
});