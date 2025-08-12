// chat.js - Chat Widget Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Chat Widget
    const chatButton = document.querySelector('.chat-button');
    let chatWindow = null;

    if (chatButton) {
        chatButton.addEventListener('click', () => {
            if (!chatWindow) {
                createChatWindow();
            }
            // Always toggle after creation
            chatWindow.classList.toggle('active');
        });
    }

    // Smart Chat System with Context
    let chatContext = {
        userInfo: {},
        currentTopic: null,
        conversationStage: 'initial',
        transferRequested: false,
        messageCount: 0,
        awaitingContact: false,
        productType: null,
        contactProvided: false
    };

    const chatResponses = {
        greetings: [
            "Hello! Welcome to MelbaSolution Digital Agency. How can we assist you today?",
            "Hi there! Thanks for reaching out. What brings you to our site today?",
            "Welcome! We're here to help with your digital needs. What can we do for you?"
        ]
    };

    // Modified createChatWindow function
    function createChatWindow() {
        if (chatWindow) {
            chatWindow.remove();
        }

        chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window active';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="header-left">
                    <h3>Chat with us</h3>
                    <span class="online-indicator"></span>
                </div>
                <button class="close-chat">&times;</button>
            </div>
            <div class="chat-messages">
                <div class="message received">
                    <div class="message-content">
                        <p>${getRandomResponse('greetings')}</p>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                </div>
            </div>
            <div class="quick-replies">
                <button class="quick-reply" data-reply-type="services">Our Services</button>
                <button class="quick-reply" data-reply-type="contact">Contact Sales</button>
            </div>
            <div class="chat-input">
                <textarea placeholder="Type your message..." id="chatMessage" rows="1"></textarea>
                <button class="send-message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            
            <style>
            .chat-window {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                z-index: 1000;
            }
            .chat-window.active { display: flex; }
            .chat-header {
                background: linear-gradient(135deg, #2f5fda, #1e3ea8);
                color: white;
                padding: 15px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-header h3 { margin: 0; font-size: 16px; }
            .online-indicator {
                width: 8px;
                height: 8px;
                background: #4caf50;
                border-radius: 50%;
                margin-left: 8px;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            .close-chat {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s;
            }
            .close-chat:hover { background: rgba(255,255,255,0.2); }
            .chat-messages {
                flex: 1;
                padding: 20px 16px;
                overflow-y: auto;
                max-height: 300px;
                background: linear-gradient(to bottom, #ffffff, #fafbfc);
                scroll-behavior: smooth;
            }
            .chat-messages::-webkit-scrollbar {
                width: 4px;
            }
            .chat-messages::-webkit-scrollbar-track {
                background: transparent;
            }
            .chat-messages::-webkit-scrollbar-thumb {
                background: #cbd5e0;
                border-radius: 2px;
            }
            .chat-messages::-webkit-scrollbar-thumb:hover {
                background: #a0aec0;
            }
            .message {
                margin-bottom: 16px;
                display: flex;
                align-items: flex-end;
            }
            .message.sent { 
                justify-content: flex-end; 
            }
            .message-content {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                position: relative;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                animation: messageSlide 0.3s ease-out;
            }
            @keyframes messageSlide {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .message.received .message-content {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                color: #2c3e50;
                border-bottom-left-radius: 6px;
                border: 1px solid #e9ecef;
            }
            .message.sent .message-content {
                background: #f8f9fa;
                color: #2d3748;
                border-bottom-right-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border: 1px solid #e2e8f0;
            }
            .message-content p {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
                word-wrap: break-word;
                font-weight: 400;
            }
            .message-content a {
                color: inherit;
                text-decoration: underline;
                font-weight: 500;
            }
            .message.received .message-content a {
                color: #2f5fda;
            }
            .message-time {
                font-size: 11px;
                opacity: 0.6;
                display: block;
                margin-top: 6px;
                font-weight: 500;
                text-align: right;
            }
            .message.received .message-time {
                text-align: left;
            }
            
            /* Chat Message Lists */
            .message-content ol,
            .message-content ul {
                margin: 8px 0;
                padding-left: 20px;
                text-align: left;
            }
            .message-content li {
                margin: 4px 0;
                line-height: 1.4;
                font-size: 13px;
            }
            .message-content ol {
                counter-reset: item;
            }
            .message-content ol li {
                display: block;
                margin-bottom: 6px;
                position: relative;
            }
            .message-content ol li:before {
                content: counter(item) ". ";
                counter-increment: item;
                font-weight: 500;
                color: #2f5fda;
            }
            .message.sent .message-content ol li:before {
                color: rgba(255,255,255,0.9);
            }
            .message-content ul li {
                position: relative;
                padding-left: 4px;
            }
            .message-content ul li:before {
                content: "•";
                color: #2f5fda;
                font-weight: 500;
                position: absolute;
                left: -16px;
            }
            .message.sent .message-content ul li:before {
                color: rgba(255,255,255,0.9);
            }
            .quick-replies {
                padding: 10px 15px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 6px;
                justify-content: space-between;
            }
            .quick-reply {
                background: linear-gradient(135deg, #2f5fda, #1e3ea8);
                color: white;
                border: none;
                padding: 8px 10px;
                border-radius: 15px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.3s;
                flex: 1;
                text-align: center;
                font-weight: 500;
                box-shadow: 0 2px 8px rgba(47, 95, 218, 0.3);
            }
            .quick-reply:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(47, 95, 218, 0.4);
                background: linear-gradient(135deg, #1e3ea8, #0f2557);
                color: #ffffff;
            }
            .chat-input {
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }
            .chat-input textarea {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 24px;
                outline: none;
                font-size: 14px;
                resize: none;
                min-height: 20px;
                max-height: 100px;
                overflow-y: auto;
                line-height: 1.4;
                font-family: inherit;
                background: #ffffff;
                color: #2d3748;
                transition: all 0.3s ease;
            }
            .chat-input textarea:focus {
                border-color: #2f5fda;
                box-shadow: 0 0 0 3px rgba(47, 95, 218, 0.1);
                background: #ffffff;
            }
            .chat-input textarea::placeholder {
                color: #a0aec0;
                opacity: 1;
            }
            .send-message {
                background: #2f5fda;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
            }
            .send-message:hover { background: #1e3ea8; }
            
            /* Typing Indicator */
            .typing-dots {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 8px 0;
            }
            .typing-dots span {
                width: 6px;
                height: 6px;
                background: #94a3b8;
                border-radius: 50%;
                animation: typingBounce 1.4s infinite ease-in-out;
            }
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            .typing-dots span:nth-child(3) { animation-delay: 0s; }
            @keyframes typingBounce {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
            </style>
        `;
        
        document.body.appendChild(chatWindow);

        // Close chat functionality
        const closeBtn = chatWindow.querySelector('.close-chat');
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        // Quick reply buttons
        const quickReplies = chatWindow.querySelectorAll('.quick-reply');
        quickReplies.forEach(reply => {
            reply.addEventListener('click', (e) => {
                const replyType = e.target.getAttribute('data-reply-type');
                handleQuickReply(replyType);
            });
        });

        // Send message functionality
        const sendBtn = chatWindow.querySelector('.send-message');
        const chatInput = chatWindow.querySelector('#chatMessage');
        const messagesContainer = chatWindow.querySelector('.chat-messages');
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                addMessage(message, 'sent');
                
                // Clear input
                chatInput.value = '';
                
                // Show typing indicator and respond
                showTypingIndicator();
                setTimeout(() => {
                    hideTypingIndicator();
                    const response = generateResponse(message);
                    addMessage(response, 'received');
                }, 1500);
            }
        }

        function addMessage(content, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${content}</p>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
            `;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message received typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTypingIndicator() {
            const typingIndicator = messagesContainer.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        function handleQuickReply(replyType) {
            let response = "";
            switch(replyType) {
                case 'services':
                    response = "Our digital solutions:<ol><li>Web Development ($2,500-$15,000+)</li><li>Branding & Design ($500-$2,000)</li><li>Digital Marketing ($1,000-$5,000/month)</li><li>E-commerce Solutions ($2,000-$8,000)</li></ol>Which interests you most?";
                    break;
                // case 'portfolio':
                //     response = "You can view our portfolio by <a href='/portfolio' target='_blank' style='color: #2f5fda; text-decoration: underline;'>clicking here</a>. We've helped clients achieve 300%+ traffic growth, 250% sales increases, and 98% client satisfaction. Recent projects include e-commerce stores, SaaS platforms, and corporate websites. What industry is your business in so I can share relevant case studies?";
                //     break;
                case 'contact':
                    response = "Perfect! Here are the best ways to reach us: 📧 Email: contact@melbasolution.com (2-hour response), 📞 Phone: +1 (206) 240-9455 (9 AM-6 PM EST), 📅 Or visit our <a href='/contact' target='_blank' style='color: #2f5fda; text-decoration: underline;'>contact page</a> for a free consultation form. What's your preferred contact method?";
                    break;
                default:
                    response = "I'm here to help! I can assist with: service information, pricing estimates, project timelines, portfolio examples, or connecting you directly with our specialists. What would be most helpful for you right now?";
            }
            
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                addMessage(response, 'received');
            }, 1200);
        }

        function generateResponse(userInput) {
            const input = userInput.toLowerCase().trim();
            chatContext.messageCount++;
            
            // Agent transfer requests
            if (input.includes('agent') || input.includes('human') || input.includes('transfer') || input.includes('speak to someone') || input.includes('representative') || input.includes('connect me')) {
                chatContext.transferRequested = true;
                chatContext.awaitingContact = true;
                return "I understand you'd like to speak with a human agent. I'm connecting you now. Please provide your email or phone number, and our team will contact you within 15 minutes during business hours (9 AM - 6 PM EST).";
            }
            
            // Handle contact information when awaiting
            if (chatContext.awaitingContact && (input.includes('@') || /\d{10,}/.test(input.replace(/\D/g, '')))) {
                chatContext.contactProvided = true;
                chatContext.awaitingContact = false;
                return "Perfect! I've received your contact information. Our specialist will reach out to you within 15 minutes during business hours (9 AM - 6 PM EST) to discuss your e-commerce project. Thank you for choosing MelbaSolution!";
            }
            
            // Handle very short or unclear messages
            if (input.length < 2 || /^[^a-zA-Z0-9\s]*$/.test(input)) {
                return "I didn't quite catch that. Could you please tell me how I can help you today?";
            }
            
            // Greetings and how are you
            if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(input) || input.includes('how are you')) {
                if (chatContext.messageCount === 1) {
                    return "Hello! I'm doing great, thank you for asking! I'm here to help you with your digital transformation needs. Are you looking for web development, branding, digital marketing, or something else?";
                }
                return "I'm doing well, thanks! How can I continue helping you with your project today?";
            }
            
            // Handle product types when e-commerce topic is active
            if (chatContext.currentTopic === 'ecommerce' && (input.includes('clothes') || input.includes('jeans') || input.includes('fashion') || input.includes('apparel'))) {
                chatContext.productType = 'clothing';
                return "Excellent! A clothing e-commerce store is a great business. For fashion/apparel sites, we typically include:<ul><li>Product galleries with zoom</li><li>Size charts and filters</li><li>Inventory management</li><li>Mobile-optimized checkout</li><li>Social media integration</li></ul>Would you like a quote or prefer to schedule a consultation?";
            }
            
            // Context-aware website development
            if (input.includes('website') || input.includes('web') || input.includes('site') || input.includes('create') && (input.includes('site') || input.includes('web'))) {
                chatContext.currentTopic = 'website';
                
                if (input.includes('language') || input.includes('technology') || input.includes('tech')) {
                    return "Great question! We use modern technologies like React, Node.js, and WordPress depending on your needs. For most business websites, we recommend WordPress or custom HTML/CSS/JavaScript. For complex web apps, we use React or Vue.js. What type of website functionality do you need?";
                }
                
                if (input.includes('create') || input.includes('build') || input.includes('new')) {
                    chatContext.userInfo.projectType = 'new_website';
                    return "Perfect! To recommend the best solution:<ol><li>Business type</li><li>E-commerce needed?</li><li>Budget range</li></ol>";
                }
                
                if (input.includes('cost') || input.includes('price') || input.includes('budget')) {
                    return "Website costs depend on complexity: Basic business sites ($2,500-$5,000), Professional sites with CMS ($5,000-$15,000), E-commerce sites ($8,000-$25,000), Custom web applications ($15,000+). What features do you need?";
                }
                
                return "Excellent! We specialize in custom website development. Are you looking for a business website, e-commerce store, or web application? Also, what industry is your business in?";
            }
            
            // Context-aware help responses
            if (input.includes('help') || input.includes('assist') || input.includes('support')) {
                if (chatContext.currentTopic === 'website') {
                    return "I'm here to help with your website project! I can assist with: technology recommendations, pricing estimates, timeline planning, feature suggestions, and connecting you with our development team. What specific aspect would you like to know more about?";
                }
                return "I'm here to help! I can assist you with: Web Development, Branding & Design, Digital Marketing, E-commerce Solutions, pricing information, project timelines, and connecting you with our specialists. What interests you most?";
            }
            
            // Handle consultation requests
            if (input.includes('consultation') || input.includes('schedule') || input.includes('discuss')) {
                return "Contact options:<ol><li>Email: contact@melbasolution.com</li><li>Call: +1 (206) 240-9455</li><li>Free consultation</li></ol>We respond within 2 hours. Preferred method?";
            }
            
            // Handle affirmative responses with context
            if (/^(yes|yeah|yep|sure|ok|okay|i am|i do)\b/i.test(input)) {
                if (chatContext.currentTopic === 'ecommerce' && chatContext.productType) {
                    return "Great! For your clothing store, would you like:<ol><li>Get a detailed quote</li><li>Schedule a consultation call</li><li>See similar portfolio examples</li></ol>";
                }
                if (chatContext.currentTopic === 'website') {
                    return "To create your website, I need:<ol><li>Business type/industry</li><li>Existing branding (logo, colors)</li><li>Required features</li><li>Target launch date</li></ol>";
                }
                if (chatContext.transferRequested && !chatContext.contactProvided) {
                    chatContext.awaitingContact = true;
                    return "Perfect! Please provide your email or phone number, and our team will contact you within 15 minutes during business hours.";
                }
                return "Wonderful! To better assist you, could you tell me which service interests you most: Web Development, Branding, Digital Marketing, or E-commerce? Or would you prefer to schedule a free consultation to discuss your specific needs?";
            }
            
            // Services inquiry
            if (input.includes('service') || input.includes('offer') || input.includes('do')) {
                return "Our digital solutions:<ol><li>Web Development ($2,500-$15,000+)</li><li>Branding & Design ($500-$2,000)</li><li>Digital Marketing ($1,000-$5,000/month)</li><li>E-commerce Solutions ($2,000-$8,000)</li></ol>Which interests you most?";
            }
            
            // Branding
            if (input.includes('brand') || input.includes('logo') || input.includes('design')) {
                chatContext.currentTopic = 'branding';
                return "Excellent choice! Our branding services include logo design, brand identity, color schemes, typography, business cards, and brand guidelines. Are you starting a new business or rebranding an existing one? What industry are you in?";
            }
            
            // Marketing
            if (input.includes('marketing') || input.includes('seo') || input.includes('social') || input.includes('ads')) {
                chatContext.currentTopic = 'marketing';
                return "Digital marketing services:<ul><li>SEO - Improve Google rankings</li><li>Google Ads - Immediate traffic</li><li>Social Media - Facebook, Instagram, LinkedIn</li><li>Content Marketing</li><li>Email Campaigns</li></ul>What's your main goal?";
            }
            
            // E-commerce
            if (input.includes('ecommerce') || input.includes('e-commerce') || input.includes('shop') || input.includes('store') || input.includes('sell online')) {
                chatContext.currentTopic = 'ecommerce';
                return "Perfect! We build custom e-commerce solutions with secure payment processing, inventory management, mobile optimization, and SEO. Are you starting a new online store or improving an existing one? What products will you be selling?";
            }
            
            // Pricing inquiries
            if (input.includes('price') || input.includes('cost') || input.includes('budget') || input.includes('quote')) {
                return "I'd be happy to provide pricing information! Our services range from $500 (basic branding) to $25,000+ (complex websites). For an accurate quote, I need to understand your specific needs. Would you prefer a quick 15-minute consultation call to discuss your project and get exact pricing?";
            }
            
            // Timeline questions
            if (input.includes('time') || input.includes('long') || input.includes('when') || input.includes('duration')) {
                return "Project timelines:<ul><li>Logo design: 3-5 days</li><li>Basic websites: 2-3 weeks</li><li>Professional websites: 4-6 weeks</li><li>E-commerce sites: 6-8 weeks</li><li>Complex web apps: 8-12 weeks</li></ul>What's your ideal timeline?";
            }
            
            // Contact/meeting requests
            if (input.includes('contact') || input.includes('call') || input.includes('meet') || input.includes('talk') || input.includes('discuss')) {
                return "Contact options:<ol><li>Email: contact@melbasolution.com</li><li>Call: +1 (206) 240-9455</li><li>Free consultation</li></ol>We respond within 2 hours. Preferred method?";
            }
            
            // Portfolio/examples
            if (input.includes('portfolio') || input.includes('example') || input.includes('work') || input.includes('previous')) {
                return "We've helped clients achieve: 300%+ traffic increases, 250% sales growth, 98% client satisfaction rate. Recent projects include e-commerce stores, SaaS platforms, and corporate websites. What industry is your business in so I can show relevant examples?";
            }
            
            // About company
            if (input.includes('about') || input.includes('company') || input.includes('who are you')) {
                return "MelbaSolution is a full-service digital agency founded to help local businesses become global brands. We've completed 200+ projects, serve clients in 25+ countries, maintain 98% client satisfaction, and have a team of 15+ certified professionals. How can we help transform your business?";
            }
            
            // Process questions
            if (input.includes('process') || input.includes('how') || input.includes('work')) {
                return "Our process:<ol><li>Discovery (1-2 days)</li><li>Strategy (2-3 days)</li><li>Implementation (2-12 weeks)</li><li>Optimization (ongoing)</li></ol>Questions about any step?";
            }
            
            // Handle test/unclear responses
            if (input === 'test' || input === 'info' || (input.length < 4 && !/[a-zA-Z]/.test(input))) {
                if (chatContext.currentTopic === 'ecommerce') {
                    return "I'm here to help with your e-commerce project! What specific information do you need about building your online store?";
                }
                return "I'm here to help! What specific information are you looking for? I can assist with services, pricing, timelines, or connect you with our team.";
            }
            
            // Handle unclear responses after multiple messages
            if (chatContext.messageCount > 3 && (input.length < 5 || !/[a-zA-Z]/.test(input))) {
                return "I want to make sure I'm giving you the most helpful information. Would you prefer to speak with one of our specialists directly? I can arrange a quick call, or you can email us at contact@melbasolution.com with your questions.";
            }
            
            // Default contextual response
            if (chatContext.currentTopic) {
                return `I'd love to help you with your ${chatContext.currentTopic} project! Could you share more specific details about what you're looking for? Or would you prefer to schedule a free consultation to discuss your needs in detail?`;
            }
            
            return "I want to give you the most relevant information. Are you interested in: Web Development, Branding, Digital Marketing, or E-commerce? Or would you prefer to speak directly with one of our specialists?";
        }

        // Add event listeners
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        chatInput.focus();
        
        // Auto-resize textarea
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }

    function getRandomResponse(type) {
        const responses = chatResponses[type] || chatResponses.fallback;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
});