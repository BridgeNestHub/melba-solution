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




    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            
            // Add loading state
            if (submitBtn && btnText) {
                submitBtn.classList.add('btn--loading');
                btnText.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
            
            // Get form data as URL encoded
            const formData = new FormData(this);
            const urlEncodedData = new URLSearchParams(formData).toString();
            
            // Submit via fetch
            fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: urlEncodedData
            })
            .then(response => {
                if (response.ok) {
                    // Success - redirect to success page
                    window.location.href = '/contact?success=contact';
                } else {
                    return response.text();
                }
            })
            .then(html => {
                if (html) {
                    document.open();
                    document.write(html);
                    document.close();
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showErrorModal('Sorry, there was an error sending your message. Please try again.');
            })
            .finally(() => {
                // Reset button state
                if (submitBtn && btnText) {
                    submitBtn.classList.remove('btn--loading');
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
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

    // Show error modal function
    function showErrorModal(message) {
        const modalHTML = `
            <div class="message-overlay" id="errorOverlay">
                <div class="error-message-modal">
                    <div class="message-content">
                        <div class="message-icon error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="message-text">
                            <h3>Error</h3>
                            <p>${message}</p>
                        </div>
                        <button class="close-btn" onclick="closeErrorModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeErrorModal();
        }, 5000);
    }

    // Close error modal function
    window.closeErrorModal = function() {
        const overlay = document.getElementById('errorOverlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 300);
        }
    };

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

    // Hero Image Preloader - Add to your main.js
    // Works with your existing CSS - no CSS changes needed!
    
    // Preload all hero images immediately when page loads
    const heroImages = [
        '../images/digitalNetwork.jpg',
        '../images/about1.jpg', 
        '/images/portfolio.jpg',
        '/images/contact.jpg',
        '../images/testimonials.jpg'
    ];
    
    // Remove duplicates
    const uniqueImages = [...new Set(heroImages)];
    
    // Preload images in background
    uniqueImages.forEach(imageSrc => {
        const img = new Image();
        img.src = imageSrc;
        // Optional: Log when each image is loaded
        img.onload = () => console.log(`Preloaded: ${imageSrc}`);
        img.onerror = () => console.warn(`Failed to preload: ${imageSrc}`);
    });
    
    // Enhanced navigation preloading for instant page switches
    const preloadedPages = new Set();
    
    navItems.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const href = e.target.getAttribute('href') || '';
            
            // Preload specific images based on page
            let imagesToPreload = [];
            
            if (href.includes('about') && !preloadedPages.has('about')) {
                imagesToPreload = ['../images/about1.jpg'];
                preloadedPages.add('about');
            } else if (href.includes('services') && !preloadedPages.has('services')) {
                imagesToPreload = ['/images/portfolio.jpg'];
                preloadedPages.add('services');
            } else if (href.includes('portfolio') && !preloadedPages.has('portfolio')) {
                imagesToPreload = ['/images/portfolio.jpg'];
                preloadedPages.add('portfolio');
            } else if (href.includes('contact') && !preloadedPages.has('contact')) {
                imagesToPreload = ['/images/contact.jpg'];
                preloadedPages.add('contact');
            } else if (href.includes('testimonials') && !preloadedPages.has('testimonials')) {
                imagesToPreload = ['../images/testimonials.jpg'];
                preloadedPages.add('testimonials');
            }
            
            // Preload images for faster page transitions
            imagesToPreload.forEach(imageSrc => {
                const img = new Image();
                img.src = imageSrc;
            });
        });
    });
    
    // Optional: Preload images when user scrolls near bottom (for multi-page sites)
    let hasPreloadedOnScroll = false;
    
    window.addEventListener('scroll', () => {
        if (!hasPreloadedOnScroll && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            hasPreloadedOnScroll = true;
            
            // Preload remaining images when user is engaged
            const remainingImages = [
                '/images/contact.jpg',
                '../images/testimonials.jpg'
            ];
            
            remainingImages.forEach(imageSrc => {
                const img = new Image();
                img.src = imageSrc;
            });
        }
    });
    
    // Priority loading: Load most common images first
    const priorityImages = [
        '../images/digitalNetwork.jpg', // Home page hero
        '/images/portfolio.jpg'         // Used in services and portfolio
    ];
    
    // Load priority images with higher priority
    priorityImages.forEach(imageSrc => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageSrc;
        document.head.appendChild(link);
    });
});