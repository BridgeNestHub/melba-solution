// main.js - Extended Version

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
        });
    }

    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('open');
        });
    });

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

    // Enhanced Chat System for main.js
const chatResponses = {
    greetings: [
        "Hello! Welcome to MelbaSolution Digital Agency. How can we assist you today?",
        "Hi there! Thanks for reaching out. What brings you to our site today?",
        "Welcome! We're here to help with your digital needs. What can we do for you?"
    ],
    general: [
        "I'd be happy to help with that. Could you share more details about your project?",
        "That's one of our specialties! Let me connect you with the right team member.",
        "Great question! Our typical process for that involves [brief description]. Would you like more details?"
    ],
    services: [
        "We offer web design, branding, and digital marketing services. Which area interests you most?",
        "For that, our [service name] team would be perfect. Would you like me to share some examples of our work?",
        "We've helped many clients with similar needs. Would you like to see some case studies?"
    ],
    contact: [
        "We can have a specialist contact you. What's the best email or phone number to reach you?",
        "I'll connect you with our team. When would be a good time for a consultation?",
        "Let's schedule a call. Are you available [suggest time frame]?"
    ],
    closing: [
        "Thanks for chatting with us! A team member will follow up shortly.",
        "We appreciate your interest! Someone will contact you within 24 hours.",
        "Thank you for your time! Watch your inbox for our response."
    ],
    fallback: [
        "I'm not sure I understand. Could you rephrase that?",
        "Let me connect you with a human specialist who can better assist you.",
        "Could you provide more details about what you're looking for?"
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
            <button class="quick-reply" data-reply-type="portfolio">View Portfolio</button>
            <button class="quick-reply" data-reply-type="contact">Contact Sales</button>
        </div>
        <div class="chat-input">
            <input type="text" placeholder="Type your message..." id="chatMessage">
            <button class="send-message">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
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
            
            // Analyze message and respond
            setTimeout(() => {
                const response = generateResponse(message);
                addMessage(response, 'received');
            }, 1000);
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

    function handleQuickReply(replyType) {
        let response = "";
        switch(replyType) {
            case 'services':
                response = getRandomResponse('services');
                break;
            case 'portfolio':
                response = "Here's a link to our portfolio: <a href='../html/portfolio.html' style='color: #4361ee;'>View Our Work</a>. What type of project are you considering?";
                break;
            case 'contact':
                response = getRandomResponse('contact');
                break;
            default:
                response = getRandomResponse('general');
        }
        addMessage(response, 'received');
    }

    function generateResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Service-related queries
        if (input.includes('service') || input.includes('offer') || input.includes('do')) {
            return getRandomResponse('services');
        }
        
        // Contact requests
        if (input.includes('contact') || input.includes('call') || input.includes('email') || input.includes('meet')) {
            return getRandomResponse('contact');
        }
        
        // Project-specific
        if (input.includes('project') || input.includes('website') || input.includes('brand')) {
            return "For " + input + " projects, we typically [process]. Would you like to schedule a consultation?";
        }
        
        // Pricing
        if (input.includes('price') || input.includes('cost') || input.includes('budget')) {
            return "Our pricing depends on project scope. Could you share more details about your needs?";
        }
        
        // Default response
        return getRandomResponse('general');
    }

    // Add event listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    chatInput.focus();
}

function getRandomResponse(type) {
    const responses = chatResponses[type] || chatResponses.fallback;
    return responses[Math.floor(Math.random() * responses.length)];
}
    // function createChatWindow() {
    //     if (chatWindow) {
    //         chatWindow.remove(); // Clean up existing window if any
    //     }

    //     chatWindow = document.createElement('div');
    //     chatWindow.className = 'chat-window active'; // Start as active
    //     chatWindow.innerHTML = `
    //         <div class="chat-header">
    //             <div class="header-left">
    //                 <h3>Chat with us</h3>
    //                 <span class="online-indicator"></span>
    //             </div>
    //             <button class="close-chat">&times;</button>
    //         </div>
    //         <div class="chat-messages">
    //             <div class="message received">
    //                 <div class="message-content">
    //                     <p>Hello! Thanks for reaching out. How can we help you today?</p>
    //                     <span class="message-time">${getCurrentTime()}</span>
    //                 </div>
    //             </div>
    //         </div>
    //         <div class="chat-input">
    //             <input type="text" placeholder="Type your message..." id="chatMessage">
    //             <button class="send-message">
    //                 <i class="fas fa-paper-plane"></i>
    //             </button>
    //         </div>
    //     `;
    //     document.body.appendChild(chatWindow);

    //     // Close chat functionality
    //     const closeBtn = chatWindow.querySelector('.close-chat');
    //     closeBtn.addEventListener('click', () => {
    //         chatWindow.classList.remove('active');
    //     });

    //     // Send message functionality
    //     const sendBtn = chatWindow.querySelector('.send-message');
    //     const chatInput = chatWindow.querySelector('#chatMessage');
    //     const messagesContainer = chatWindow.querySelector('.chat-messages');
        
    //     function sendMessage() {
    //         const message = chatInput.value.trim();
    //         if (message) {
    //             // Add user message
    //             const userMessage = document.createElement('div');
    //             userMessage.className = 'message sent';
    //             userMessage.innerHTML = `
    //                 <div class="message-content">
    //                     <p>${message}</p>
    //                     <span class="message-time">${getCurrentTime()}</span>
    //                 </div>
    //             `;
    //             messagesContainer.appendChild(userMessage);
                
    //             // Clear input
    //             chatInput.value = '';
                
    //             // Scroll to bottom
    //             messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
    //             // Get appropriate response based on user input
    //             const response = getResponseForMessage(message.toLowerCase());
                
    //             // Simulate reply after 1-2 seconds
    //             setTimeout(() => {
    //                 const replyMessage = document.createElement('div');
    //                 replyMessage.className = 'message received';
    //                 replyMessage.innerHTML = `
    //                     <div class="message-content">
    //                         <p>${response}</p>
    //                         <span class="message-time">${getCurrentTime()}</span>
    //                     </div>
    //                 `;
    //                 messagesContainer.appendChild(replyMessage);
                    
    //                 // Scroll to bottom
    //                 messagesContainer.scrollTop = messagesContainer.scrollHeight;
    //             }, 1000 + Math.random() * 1000);
    //         }
    //     }

    //     function getResponseForMessage(message) {
    //         // Common greetings
    //         if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/i)) {
    //             return "Hello! How can I assist you today? Are you interested in our web development, digital marketing, or branding services?";
    //         }

    //         // Questions about services
    //         if (message.includes('service') || message.includes('offer')) {
    //             return "We offer a range of services including: \n1. Web Development\n2. Digital Marketing\n3. Branding\n4. E-commerce Solutions\nWhich service are you interested in learning more about?";
    //         }

    //         // Web Development inquiries
    //         if (message.includes('web') || message.includes('website') || message.includes('development')) {
    //             return "Our web development services include custom website design, web applications, and responsive development. Would you like to discuss your specific project requirements?";
    //         }

    //         // Digital Marketing inquiries
    //         if (message.includes('marketing') || message.includes('digital') || message.includes('seo') || message.includes('social media')) {
    //             return "Our digital marketing team specializes in SEO, social media marketing, content strategy, and PPC campaigns. What specific marketing goals do you have in mind?";
    //         }

    //         // Pricing inquiries
    //         if (message.includes('price') || message.includes('cost') || message.includes('quote') || message.includes('pricing')) {
    //             return "Pricing varies based on project requirements. Could you share more details about your project so I can provide you with an accurate quote?";
    //         }

    //         // Timeline inquiries
    //         if (message.includes('time') || message.includes('long') || message.includes('duration') || message.includes('when')) {
    //             return "Project timelines vary depending on scope and requirements. Typically, we can provide an estimate after a brief consultation. Would you like to schedule a call to discuss your timeline?";
    //         }

    //         // Contact information request
    //         if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('call')) {
    //             return "You can reach our team at contact@example.com or call us at (206) 240-9455. When would be the best time for us to contact you?";
    //         }

    //         // Questions about experience/portfolio
    //         if (message.includes('portfolio') || message.includes('example') || message.includes('work') || message.includes('previous')) {
    //             return "We've worked with various clients across different industries. You can view our portfolio at example.com/portfolio. Would you like me to share some specific examples related to your industry?";
    //         }

    //         // Help or support
    //         if (message.includes('help') || message.includes('support') || message.includes('assist')) {
    //             return "I'd be happy to help! Could you please specify what kind of assistance you're looking for? We offer support in web development, digital marketing, and branding.";
    //         }

    //         // Questions
    //         if (message.includes('?')) {
    //             return "That's a great question! To provide you with the most accurate information, could you share a bit more context about your project or requirements?";
    //         }

    //         // Short/unclear messages
    //         if (message.length < 5) {
    //             return "I'd love to help you better. Could you please provide more details about what you're looking for?";
    //         }

    //         // Default responses for unrecognized inputs
    //         const defaultResponses = [
    //             "Thank you for your message. Could you please provide more details about your project requirements?",
    //             "I'd be happy to help you with that. Could you share more specific information about what you're looking for?",
    //             "Let's discuss your project in more detail. What specific aspects are you most interested in?",
    //             "I understand you're interested in our services. Could you tell me more about your goals?",
    //             "Thanks for reaching out! To better assist you, could you share more details about your needs?"
    //         ];
            
    //         return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    //     }

    //     // Add event listeners for sending messages
    //     sendBtn.addEventListener('click', sendMessage);
    //     chatInput.addEventListener('keypress', (e) => {
    //         if (e.key === 'Enter') {
    //             sendMessage();
    //         }
    //     });

    //     // Focus input when chat opens
    //     chatInput.focus();
    // }

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Don't prevent default - let the form submit normally to the server
            // The server will handle validation and redirect back with success/error messages
            
            // Just add loading state to the submit button
            const submitBtn = this.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            
            if (submitBtn && btnText) {
                submitBtn.classList.add('btn--loading');
                btnText.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
            
            // Let the form submit normally - don't prevent default
            // The server will handle the rest and show our modal on the response page
        });
    }

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length && portfolioItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Service Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceContents = document.querySelectorAll('.service-content');

    if (tabButtons.length && serviceContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                serviceContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding content
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                question.classList.toggle('active');
                const answer = question.nextElementSibling;
                
                if (question.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = 0;
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                navbar.style.background = 'rgba(255,255,255,0.98)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.background = 'var(--white)';
            }
        });
    }

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .value-card, .team-member, .portfolio-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Set initial state for animated elements
    document.querySelectorAll('.service-card, .value-card, .team-member, .portfolio-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});