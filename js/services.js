// Services Page JavaScript
// Handles service-specific functionality

class ServicesManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentSearchTerm = '';
        this.services = [];
        this.init();
    }

    init() {
        this.setupServiceSearch();
        this.setupCategoryFilters();
        this.setupServiceActions();
        this.loadServices();
        this.setupLoadMore();
    }

    // Service Search Functionality
    setupServiceSearch() {
        const searchInput = document.getElementById('serviceSearch');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentSearchTerm = e.target.value.toLowerCase();
                this.filterServices();
            }, 300);
        });
    }

    // Category Filter Setup
    setupCategoryFilters() {
        const categoryBtns = document.querySelectorAll('.category-filters .filter-btn');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active state
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.currentFilter = filter;
                this.filterServices();
            });
        });
    }

    // Filter Services Based on Search and Category
    filterServices() {
        const serviceCards = document.querySelectorAll('.service-card-detailed');
        let visibleCount = 0;
        
        serviceCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            const matchesCategory = this.currentFilter === 'all' || category === this.currentFilter;
            const matchesSearch = !this.currentSearchTerm || 
                                 title.includes(this.currentSearchTerm) || 
                                 description.includes(this.currentSearchTerm);
            
            const shouldShow = matchesCategory && matchesSearch;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, visibleCount * 100);
                
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show "no results" message if needed
        this.updateNoResultsMessage(visibleCount === 0);
    }

    updateNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem; color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <h3 style="margin-bottom: 0.5rem;" data-en="No services found" data-ar="لم يتم العثور على خدمات">No services found</h3>
                    <p data-en="Try adjusting your search or filter criteria" data-ar="حاول تعديل معايير البحث أو التصفية">Try adjusting your search or filter criteria</p>
                </div>
            `;
            document.querySelector('.services-grid-detailed').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Service Action Handlers
    setupServiceActions() {
        // These functions are called from HTML onclick attributes
        window.launchService = (serviceId) => {
            console.log(`Launching service: ${serviceId}`);
            this.showServiceLauncher(serviceId);
        };

        window.upgradeRequired = (serviceId) => {
            console.log(`Upgrade required for service: ${serviceId}`);
            this.showUpgradeModal(serviceId);
        };

        window.viewDemo = (serviceId) => {
            console.log(`Viewing demo for service: ${serviceId}`);
            this.showServiceDemo(serviceId);
        };
    }

    showServiceLauncher(serviceId) {
        // Create service launcher modal
        const modal = this.createModal('service-launcher', `
            <div class="service-launcher-modal">
                <h2 data-en="Launch AI Service" data-ar="تشغيل الخدمة الذكية">Launch AI Service</h2>
                <div class="launcher-content">
                    <div class="service-preview">
                        <div class="service-icon">
                            <i class="fas fa-${this.getServiceIcon(serviceId)}"></i>
                        </div>
                        <h3>${this.getServiceName(serviceId)}</h3>
                        <p data-en="Ready to start using this AI tool" data-ar="جاهز لبدء استخدام هذه الأداة الذكية">Ready to start using this AI tool</p>
                    </div>
                    
                    <div class="launcher-options">
                        <div class="usage-stats">
                            <div class="stat-item">
                                <span class="stat-label" data-en="Daily Limit" data-ar="الحد اليومي">Daily Limit</span>
                                <span class="stat-value">1000 words</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label" data-en="Used Today" data-ar="المستخدم اليوم">Used Today</span>
                                <span class="stat-value">250 words</span>
                            </div>
                        </div>
                        
                        <div class="launcher-actions">
                            <button class="btn-primary full-width" onclick="this.startService('${serviceId}')" data-en="Start Using" data-ar="ابدأ الاستخدام">Start Using</button>
                            <button class="btn-outline full-width" onclick="this.closeModal()" data-en="Cancel" data-ar="إلغاء">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.showModal(modal);
    }

    showUpgradeModal(serviceId) {
        const modal = this.createModal('upgrade-required', `
            <div class="upgrade-modal">
                <div class="upgrade-icon">
                    <i class="fas fa-crown"></i>
                </div>
                <h2 data-en="Premium Feature" data-ar="ميزة مدفوعة">Premium Feature</h2>
                <p data-en="This AI service requires a premium subscription to access all features." data-ar="تتطلب هذه الخدمة الذكية اشتراكاً مدفوعاً للوصول إلى جميع الميزات.">This AI service requires a premium subscription to access all features.</p>
                
                <div class="upgrade-benefits">
                    <div class="benefit-item">
                        <i class="fas fa-check"></i>
                        <span data-en="Unlimited usage" data-ar="استخدام غير محدود">Unlimited usage</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-check"></i>
                        <span data-en="Premium quality output" data-ar="إخراج بجودة متميزة">Premium quality output</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-check"></i>
                        <span data-en="Priority support" data-ar="دعم أولوية">Priority support</span>
                    </div>
                </div>
                
                <div class="upgrade-actions">
                    <button class="btn-primary full-width" onclick="location.href='index.html#pricing'" data-en="Upgrade Now" data-ar="الترقية الآن">Upgrade Now</button>
                    <button class="btn-outline full-width" onclick="this.closeModal()" data-en="Maybe Later" data-ar="ربما لاحقاً">Maybe Later</button>
                </div>
            </div>
        `);

        this.showModal(modal);
    }

    showServiceDemo(serviceId) {
        const modal = this.createModal('service-demo', `
            <div class="demo-modal">
                <h2 data-en="Service Demo" data-ar="عرض توضيحي للخدمة">Service Demo</h2>
                <div class="demo-content">
                    <div class="demo-video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p data-en="Interactive demo coming soon" data-ar="العرض التفاعلي قريباً">Interactive demo coming soon</p>
                    </div>
                    
                    <div class="demo-features">
                        <h3 data-en="Key Features" data-ar="الميزات الرئيسية">Key Features</h3>
                        <ul>
                            <li data-en="AI-powered processing" data-ar="معالجة مدعومة بالذكاء الاصطناعي">AI-powered processing</li>
                            <li data-en="Real-time results" data-ar="نتائج فورية">Real-time results</li>
                            <li data-en="Easy-to-use interface" data-ar="واجهة سهلة الاستخدام">Easy-to-use interface</li>
                        </ul>
                    </div>
                </div>
                
                <div class="demo-actions">
                    <button class="btn-primary full-width" onclick="window.aiServicesHub.showAuthModal('signup')" data-en="Try It Now" data-ar="جربه الآن">Try It Now</button>
                    <button class="btn-outline full-width" onclick="this.closeModal()" data-en="Close" data-ar="إغلاق">Close</button>
                </div>
            </div>
        `);

        this.showModal(modal);
    }

    // Modal Creation Helper
    createModal(id, content) {
        // Remove existing modal if any
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closeModal()">&times;</span>
                ${content}
            </div>
        `;

        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Make closeModal globally accessible
        window.closeModal = () => this.closeModal(modal);
    }

    closeModal(modal) {
        if (!modal) {
            // Close any visible modal
            const visibleModal = document.querySelector('.modal[style*="block"]');
            if (visibleModal) {
                visibleModal.style.display = 'none';
                document.body.style.overflow = '';
                visibleModal.remove();
            }
        } else {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            modal.remove();
        }
    }

    // Service Helper Methods
    getServiceIcon(serviceId) {
        const icons = {
            'text-generator': 'pen-fancy',
            'image-creator': 'image',
            'data-analyzer': 'chart-line',
            'translator': 'language',
            'voice-studio': 'microphone-alt',
            'code-assistant': 'code'
        };
        return icons[serviceId] || 'robot';
    }

    getServiceName(serviceId) {
        const names = {
            'text-generator': 'AI Text Generator',
            'image-creator': 'AI Image Creator Pro',
            'data-analyzer': 'Smart Data Analyzer',
            'translator': 'AI Translator Pro',
            'voice-studio': 'AI Voice Studio',
            'code-assistant': 'AI Code Assistant'
        };
        return names[serviceId] || 'AI Service';
    }

    // Load More Services
    setupLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            this.loadMoreServices();
        });
    }

    loadMoreServices() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        const originalText = loadMoreBtn.textContent;
        
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;

        // Simulate loading
        setTimeout(() => {
            this.addMoreServices();
            loadMoreBtn.textContent = originalText;
            loadMoreBtn.disabled = false;
        }, 1500);
    }

    addMoreServices() {
        const additionalServices = [
            {
                id: 'summary-generator',
                category: 'text',
                type: 'free',
                icon: 'file-alt',
                title: { en: 'AI Summarizer', ar: 'مولد الملخصات الذكي' },
                description: { 
                    en: 'Generate concise summaries from long documents and articles with intelligent key point extraction.',
                    ar: 'أنشئ ملخصات مقتضبة من المستندات والمقالات الطويلة مع استخراج ذكي للنقاط الرئيسية.'
                }
            },
            {
                id: 'style-transfer',
                category: 'image',
                type: 'premium',
                icon: 'palette',
                title: { en: 'AI Style Transfer', ar: 'نقل الأسلوب الذكي' },
                description: { 
                    en: 'Transform images with artistic styles using advanced neural style transfer algorithms.',
                    ar: 'حول الصور بأساليب فنية باستخدام خوارزميات نقل الأسلوب العصبية المتقدمة.'
                }
            }
        ];

        const grid = document.querySelector('.services-grid-detailed');
        
        additionalServices.forEach((service, index) => {
            const card = this.createServiceCard(service);
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            grid.insertBefore(card, grid.lastElementChild); // Insert before load more container
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = `service-card-detailed ${service.type}`;
        card.dataset.category = service.category;
        
        const currentLang = window.aiServicesHub ? window.aiServicesHub.currentLang : 'en';
        const title = service.title[currentLang] || service.title.en;
        const description = service.description[currentLang] || service.description.en;
        
        card.innerHTML = `
            <div class="service-header">
                <div class="service-icon">
                    <i class="fas fa-${service.icon}"></i>
                </div>
                <div class="service-badge ${service.type}" data-en="${service.type === 'free' ? 'Free' : 'Premium'}" data-ar="${service.type === 'free' ? 'مجاني' : 'مدفوع'}">${service.type === 'free' ? 'Free' : 'Premium'}</div>
            </div>
            <div class="service-content">
                <h3>${title}</h3>
                <p>${description}</p>
                
                <div class="service-features">
                    <div class="feature-row">
                        <i class="fas fa-${service.type === 'free' ? 'check' : 'crown'}"></i>
                        <span data-en="Advanced AI processing" data-ar="معالجة ذكية متقدمة">Advanced AI processing</span>
                    </div>
                    <div class="feature-row">
                        <i class="fas fa-${service.type === 'free' ? 'check' : 'crown'}"></i>
                        <span data-en="High-quality results" data-ar="نتائج عالية الجودة">High-quality results</span>
                    </div>
                </div>
                
                <div class="service-actions">
                    <button class="btn-primary" onclick="${service.type === 'free' ? `launchService('${service.id}')` : `upgradeRequired('${service.id}')`}" data-en="${service.type === 'free' ? 'Try Now' : 'Upgrade to Use'}" data-ar="${service.type === 'free' ? 'جرب الآن' : 'الترقية للاستخدام'}">${service.type === 'free' ? 'Try Now' : 'Upgrade to Use'}</button>
                    <button class="btn-outline" onclick="viewDemo('${service.id}')" data-en="View Demo" data-ar="شاهد العرض التوضيحي">View Demo</button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Load initial services data
    loadServices() {
        // This would typically fetch from an API
        this.services = [
            { id: 'text-generator', category: 'text', type: 'free' },
            { id: 'image-creator', category: 'image', type: 'premium' },
            { id: 'data-analyzer', category: 'analysis', type: 'free' },
            { id: 'translator', category: 'text', type: 'premium' },
            { id: 'voice-studio', category: 'voice', type: 'premium' },
            { id: 'code-assistant', category: 'code', type: 'free' }
        ];
    }
}

// Initialize Services Manager
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.services-directory')) {
        window.servicesManager = new ServicesManager();
    }
});

// Add additional CSS for service-specific styling
const serviceStyles = `
    .page-header {
        padding: calc(80px + 3rem) 1rem 3rem;
        background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-white) 100%);
        text-align: center;
    }
    
    .page-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary-navy);
        margin-bottom: 1rem;
    }
    
    .service-search-bar {
        max-width: 800px;
        margin: 2rem auto 0;
    }
    
    .search-input-group {
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .search-input-group i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--gray-400);
        z-index: 1;
    }
    
    .search-input-group input {
        width: 100%;
        padding: 1rem 1rem 1rem 3rem;
        border: 2px solid var(--gray-300);
        border-radius: var(--radius-lg);
        font-size: 1rem;
        transition: var(--transition-fast);
    }
    
    .search-input-group input:focus {
        outline: none;
        border-color: var(--primary-navy);
        box-shadow: 0 0 0 3px rgba(13, 60, 85, 0.1);
    }
    
    .category-filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .services-directory {
        padding: 3rem 1rem;
    }
    
    .services-grid-detailed {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .service-card-detailed {
        background: var(--primary-white);
        border-radius: var(--radius-xl);
        border: 1px solid var(--gray-200);
        overflow: hidden;
        transition: all var(--transition-normal);
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card-detailed:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-xl);
    }
    
    .service-header {
        padding: 1.5rem 1.5rem 0;
        position: relative;
    }
    
    .service-content {
        padding: 1rem 1.5rem 1.5rem;
    }
    
    .service-features {
        margin: 1.5rem 0;
    }
    
    .feature-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0;
        color: var(--gray-600);
    }
    
    .feature-row i {
        color: var(--primary-red);
        width: 16px;
    }
    
    .service-actions {
        display: flex;
        gap: 0.75rem;
    }
    
    .service-actions .btn-primary,
    .service-actions .btn-outline {
        flex: 1;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }
    
    .load-more-container {
        text-align: center;
        margin-top: 3rem;
    }
    
    .cta-section {
        background: linear-gradient(135deg, var(--primary-navy) 0%, var(--navy-dark) 100%);
        padding: 4rem 1rem;
        color: var(--primary-white);
        text-align: center;
    }
    
    .cta-content h2 {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }
    
    .cta-content p {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        opacity: 0.9;
    }
    
    .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .cta-buttons .btn-primary {
        background-color: var(--primary-red);
        border-color: var(--primary-red);
    }
    
    .cta-buttons .btn-outline {
        color: var(--primary-white);
        border-color: var(--primary-white);
    }
    
    .cta-buttons .btn-outline:hover {
        background-color: var(--primary-white);
        color: var(--primary-navy);
    }
    
    /* Modal Styles */
    .service-launcher-modal,
    .upgrade-modal,
    .demo-modal {
        text-align: center;
        padding: 2rem;
    }
    
    .service-preview {
        margin-bottom: 2rem;
    }
    
    .service-preview .service-icon {
        width: 80px;
        height: 80px;
        background: var(--gray-100);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
    }
    
    .service-preview .service-icon i {
        font-size: 2rem;
        color: var(--primary-navy);
    }
    
    .usage-stats {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--gray-50);
        border-radius: var(--radius-lg);
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-label {
        display: block;
        font-size: 0.8rem;
        color: var(--gray-500);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .stat-value {
        display: block;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--primary-navy);
    }
    
    .upgrade-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--primary-red), var(--red-light));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
    }
    
    .upgrade-icon i {
        font-size: 2rem;
        color: var(--primary-white);
    }
    
    .upgrade-benefits {
        margin: 2rem 0;
        text-align: left;
    }
    
    .benefit-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0;
    }
    
    .benefit-item i {
        color: var(--primary-red);
    }
    
    .demo-video-placeholder {
        background: var(--gray-100);
        border-radius: var(--radius-lg);
        padding: 3rem 2rem;
        margin-bottom: 2rem;
        color: var(--gray-500);
    }
    
    .demo-video-placeholder i {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .services-grid-detailed {
            grid-template-columns: 1fr;
        }
        
        .category-filters {
            gap: 0.25rem;
        }
        
        .category-filters .filter-btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
        }
        
        .service-actions {
            flex-direction: column;
        }
        
        .cta-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .usage-stats {
            flex-direction: column;
            gap: 1rem;
        }
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = serviceStyles;
document.head.appendChild(styleSheet);