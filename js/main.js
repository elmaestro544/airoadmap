// AI Services Hub - Main JavaScript
// Enhanced bilingual support with RTL functionality

class AIServicesHub {
    constructor() {
        this.currentLang = 'en';
        this.translations = {
            en: {},
            ar: {}
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLanguageSwitcher();
        this.setupMobileMenu();
        this.setupServiceFilter();
        this.setupAuthModals();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.loadStoredLanguage();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Language switcher buttons
        document.querySelectorAll('.lang-btn, .footer-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang) {
                    this.switchLanguage(lang);
                }
            });
        });

        // Auth buttons
        const authButtons = [
            '#loginBtn', '#signupBtn', '#mobileLoginBtn', '#mobileSignupBtn',
            '#heroGetStarted', '.pricing-btn'
        ];
        
        authButtons.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (selector.includes('signup') || selector.includes('GetStarted')) {
                        this.showAuthModal('signup');
                    } else if (selector.includes('login')) {
                        this.showAuthModal('login');
                    } else if (selector.includes('pricing-btn')) {
                        const card = e.target.closest('.pricing-card');
                        if (card && !card.querySelector('.pricing-header h3').textContent.toLowerCase().includes('starter')) {
                            this.showAuthModal('signup');
                        } else {
                            this.showAuthModal('signup');
                        }
                    }
                });
            });
        });

        // Explore services button
        document.getElementById('heroExplore')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    // Language Switching
    setupLanguageSwitcher() {
        this.collectTranslations();
    }

    collectTranslations() {
        // Collect all data-en and data-ar attributes
        document.querySelectorAll('[data-en]').forEach(element => {
            const key = element.dataset.en;
            const arText = element.dataset.ar;
            
            if (key && arText) {
                this.translations.en[key] = key;
                this.translations.ar[key] = arText;
            }
        });
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update all translatable elements
        document.querySelectorAll('[data-en]').forEach(element => {
            const key = element.dataset.en;
            const translation = lang === 'ar' ? element.dataset.ar : element.dataset.en;
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type !== 'button' && element.type !== 'submit') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update title and meta description
        const title = document.querySelector('title');
        const metaDesc = document.querySelector('meta[name="description"]');
        
        if (title) {
            const titleText = lang === 'ar' ? title.dataset.ar : title.dataset.en;
            if (titleText) title.textContent = titleText;
        }
        
        if (metaDesc) {
            const descText = lang === 'ar' ? metaDesc.dataset.ar : metaDesc.dataset.en;
            if (descText) metaDesc.content = descText;
        }
        
        // Update language switcher states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Store language preference
        localStorage.setItem('preferred-language', lang);
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    loadStoredLanguage() {
        const stored = localStorage.getItem('preferred-language');
        if (stored && (stored === 'en' || stored === 'ar')) {
            this.switchLanguage(stored);
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.mobile-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', () => {
            const isOpen = menu.style.display === 'flex';
            menu.style.display = isOpen ? 'none' : 'flex';
            toggle.classList.toggle('active');
            
            // Animate toggle
            const spans = toggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (toggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    else if (index === 1) span.style.opacity = '0';
                    else if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
        
        // Close menu when clicking links
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.style.display = 'none';
                toggle.classList.remove('active');
                const spans = toggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });
        
        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menu.style.display = 'none';
                toggle.classList.remove('active');
            }
        });
    }

    // Service Filter
    setupServiceFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const serviceCards = document.querySelectorAll('.service-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards
                serviceCards.forEach(card => {
                    const category = card.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;
                    
                    card.style.display = shouldShow ? 'block' : 'none';
                    
                    // Animate
                    if (shouldShow) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }
                });
            });
        });
    }

    // Authentication Modals
    setupAuthModals() {
        const modal = document.getElementById('authModal');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const showSignupBtn = document.getElementById('showSignup');
        const showLoginBtn = document.getElementById('showLogin');
        const closeBtn = document.querySelector('.close');
        
        if (!modal) return;
        
        // Show signup form
        showSignupBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('signup');
        });
        
        // Show login form
        showLoginBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('login');
        });
        
        // Close modal
        closeBtn?.addEventListener('click', () => {
            this.closeAuthModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeAuthModal();
            }
        });
        
        // Handle form submissions
        this.setupFormHandlers();
    }

    showAuthModal(type = 'login') {
        const modal = document.getElementById('authModal');
        if (!modal) return;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        this.switchAuthForm(type);
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('.auth-form.active input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    switchAuthForm(type) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (!loginForm || !signupForm) return;
        
        if (type === 'signup') {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
        } else {
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
        }
    }

    setupFormHandlers() {
        // Login form
        const loginForm = document.querySelector('#loginForm form');
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });
        
        // Signup form
        const signupForm = document.querySelector('#signupForm form');
        signupForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup(e.target);
        });
    }

    handleLogin(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        // Simulate login process
        console.log('Login attempt:', { email });
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = this.currentLang === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Close modal and show success
            this.closeAuthModal();
            this.showNotification(
                this.currentLang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!',
                'success'
            );
        }, 2000);
    }

    handleSignup(form) {
        const formData = new FormData(form);
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
        
        // Basic validation
        if (password !== confirmPassword) {
            this.showNotification(
                this.currentLang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
                'error'
            );
            return;
        }
        
        // Simulate signup process
        console.log('Signup attempt:', { name, email });
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = this.currentLang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Close modal and show success
            this.closeAuthModal();
            this.showNotification(
                this.currentLang === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!',
                'success'
            );
        }, 2000);
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offset = 80; // Account for fixed navbar
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.service-card, .pricing-card, .demo-card').forEach(el => {
            observer.observe(el);
        });
        
        // Add CSS for animations
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .service-card,
            .pricing-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }
            
            .service-card.animate-in,
            .pricing-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .service-card {
                transition-delay: 0.1s;
            }
            
            .service-card:nth-child(2) {
                transition-delay: 0.2s;
            }
            
            .service-card:nth-child(3) {
                transition-delay: 0.3s;
            }
        `;
        document.head.appendChild(style);
    }

    // Scroll Effects
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const scrolled = window.scrollY > 50;
        navbar.style.backgroundColor = scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = scrolled 
            ? '0 2px 20px rgba(0, 0, 0, 0.1)' 
            : 'none';
    }

    // Responsive handling
    handleResize() {
        const mobile = window.innerWidth <= 768;
        
        // Close mobile menu on resize to desktop
        if (!mobile) {
            const menu = document.querySelector('.mobile-menu');
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (menu) menu.style.display = 'none';
            if (toggle) toggle.classList.remove('active');
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Service Actions (actual implementation)
    handleServiceAction(serviceId, action) {
        console.log(`Service action: ${action} for service: ${serviceId}`);
        
        // Route to actual service pages
        const serviceRoutes = {
            'translator': 'translator.html',
            'data-analyzer': 'data-analyzer.html',
            'grammar-checker': 'grammar-checker.html',
            'prompt-generator': 'prompt-generator.html',
            'text-generator': 'text-generator.html',
            'image-creator': 'image-creator.html',
            'voice-studio': 'voice-studio.html',
            'code-assistant': 'code-assistant.html'
        };

        if (serviceRoutes[serviceId]) {
            window.location.href = serviceRoutes[serviceId];
        } else {
            // Fallback for services not yet implemented
            this.showNotification(
                this.currentLang === 'ar' 
                    ? `خدمة ${serviceId} قيد التطوير` 
                    : `Service ${serviceId} is under development`,
                'info'
            );
        }
    }

    // Payment Processing (placeholder)
    handlePayment(planId, amount) {
        console.log(`Payment initiated for plan: ${planId}, amount: $${amount}`);
        
        // In a real application, this would integrate with Stripe, PayPal, etc.
        this.showNotification(
            this.currentLang === 'ar' 
                ? 'تم توجيهك لبوابة الدفع' 
                : 'Redirecting to payment gateway...',
            'info'
        );
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.aiServicesHub = new AIServicesHub();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIServicesHub;
}