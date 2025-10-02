// AI Grammar Checker Service - Advanced Grammar, Spelling, and Style Analysis
class AIGrammarChecker {
    constructor() {
        this.currentText = '';
        this.suggestions = [];
        this.currentLanguage = 'en';
        this.isChecking = false;
        this.checkingTimeout = null;
        
        // Sample texts for different categories
        this.sampleTexts = {
            business: {
                en: "Dear Mr. Johnson,\n\nI hope this email finds you well. I wanted to follow up on our previous discussion regarding the marketing proposal. Their were several points that needs clarification, and I believe we should schedule another meeting to address this issues.\n\nThe team have been working hard on the project, and we're confident that our solution will meet you're expectations. However, we need to ensure that all stakeholder's are aligned before moving forward.\n\nPlease let me know your availability for next week. I look forward to hearing from you soon.\n\nBest regards,\nSarah",
                ar: "عزيزي السيد أحمد،\n\nأتمنى أن تكون بخير. أردت المتابعة معك بشأن اقتراح التسويق الذي ناقشناه سابقاً. كان هناك عدة نقاط تحتاج توضيح، وأعتقد أنه يجب أن نحدد اجتماع آخر لمناقشة هذه المسائل.\n\nالفريق يعمل بجد على المشروع، ونحن واثقون أن حلنا سوف يلبي توقعاتك. لكن، نحتاج للتأكد أن جميع أصحاب المصلحة متفقين قبل المضي قدماً.\n\nأرجو إعلامي بوقتك المتاح للأسبوع القادم. أتطلع لسماع ردك قريباً.\n\nمع أطيب التحيات،\nسارة"
            },
            academic: {
                en: "The impact of climate change on global ecosystems has been extensively studied in recent years. Many scientist's believe that rising temperatures will have profound effects on biodiversity. This phenomena is particularly evident in polar regions, where ice caps are melting at an unprecedented rate.\n\nAccording to Smith et al. (2023), the rate of species extinction have increased significantly over the past decade. Their research indicates that approximatly 15% of species are at risk of extinction within the next 50 years. These findings suggests that immediate action is required to mitigate the effects of global warming.",
                ar: "تأثير تغير المناخ على النظم البيئية العالمية تم دراسته بشكل واسع في السنوات الأخيرة. كثير من العلماء يعتقدون أن ارتفاع درجات الحرارة سوف يكون له تأثيرات عميقة على التنوع البيولوجي. هذه الظاهرة واضحة بشكل خاص في المناطق القطبية، حيث القمم الجليدية تذوب بمعدل غير مسبوق.\n\nحسب سميث وزملاؤه (2023)، معدل انقراض الأنواع زاد بشكل كبير خلال العقد الماضي. بحثهم يشير إلى أن تقريباً 15% من الأنواع في خطر الانقراض خلال الـ 50 سنة القادمة."
            },
            creative: {
                en: "The old lighthouse stood majestically on the cliff, it's beacon cutting through the darkness like a sword of light. Sarah approached slowly, her footsteps echoing on the rocky path. She had came here every night for the past month, drawn by something she couldn't quite explain.\n\nThe keeper had dissapeared mysteriously three weeks ago, leaving behind only a journal filled with strange symbols and half-finished sentences. As she climbed the spiral staircase, Sarah wondered weather she would find the answers she was looking for, or if she would become another mystery of the lighthouse.",
                ar: "الفنار القديم وقف بجلال على الجرف، منارته تخترق الظلام مثل سيف من النور. سارة اقتربت ببطء، خطواتها تتردد على المسار الصخري. لقد أتت هنا كل ليلة للشهر الماضي، منجذبة بشيء لا تستطيع تفسيره تماماً.\n\nحارس الفنار اختفى بغموض قبل ثلاثة أسابيع، تاركاً وراءه فقط مذكرة مليئة برموز غريبة وجمل غير مكتملة. بينما صعدت السلالم الحلزونية، سارة تساءلت إذا كانت ستجد الإجابات التي تبحث عنها، أم أنها ستصبح لغز آخر من ألغاز الفنار."
            },
            report: {
                en: "Executive Summary\n\nThis report analyzes the companies performance during Q3 2024. Overall, the results show positive growth across most departments, however there are several areas that requires attention.\n\nKey findings includes:\n- Revenue increased by 12% compared to last quarter\n- Customer satisfaction scores has improved significantly\n- Employee turnover rate remains higher then industry average\n\nRecommendations:\n1. Implement new training programs to reduce turnover\n2. Expand marketing efforts in underperforming regions\n3. Invest in technology upgrades to improve efficiency",
                ar: "الملخص التنفيذي\n\nهذا التقرير يحلل أداء الشركة خلال الربع الثالث من 2024. بشكل عام، النتائج تظهر نمو إيجابي في معظم الأقسام، لكن هناك عدة مجالات تحتاج انتباه.\n\nالنتائج الرئيسية تشمل:\n- الإيرادات زادت بنسبة 12% مقارنة بالربع الماضي\n- درجات رضا العملاء تحسنت بشكل كبير\n- معدل دوران الموظفين لا يزال أعلى من متوسط الصناعة\n\nالتوصيات:\n1. تنفيذ برامج تدريبية جديدة لتقليل الدوران\n2. توسيع جهود التسويق في المناطق ضعيفة الأداء\n3. الاستثمار في ترقيات التكنولوجيا لتحسين الكفاءة"
            }
        };

        // Grammar rules and patterns for different languages
        this.grammarRules = {
            en: [
                {
                    pattern: /\b(their|there|they're)\b/gi,
                    type: 'grammar',
                    check: (match, context) => this.checkTheirThere(match, context)
                },
                {
                    pattern: /\b(your|you're)\b/gi,
                    type: 'grammar',
                    check: (match, context) => this.checkYourYoure(match, context)
                },
                {
                    pattern: /\b(its|it's)\b/gi,
                    type: 'grammar',
                    check: (match, context) => this.checkItsIts(match, context)
                },
                {
                    pattern: /\b(affect|effect)\b/gi,
                    type: 'grammar',
                    check: (match, context) => this.checkAffectEffect(match, context)
                },
                {
                    pattern: /\b\w+ly\s+\w+ly\b/gi,
                    type: 'style',
                    message: 'Avoid using multiple adverbs in succession'
                },
                {
                    pattern: /\b(very|really|quite|rather)\s+\w+/gi,
                    type: 'style',
                    message: 'Consider using a stronger adjective instead of weak modifiers'
                }
            ],
            ar: [
                {
                    pattern: /\b(إلى|إلي|الى|الي)\b/gi,
                    type: 'spelling',
                    correct: 'إلى',
                    message: 'الكتابة الصحيحة هي "إلى"'
                },
                {
                    pattern: /\b(هذا|هاذا)\s+(ال\w+)\b/gi,
                    type: 'grammar',
                    message: 'يجب إزالة "ال" التعريف بعد اسم الإشارة'
                }
            ]
        };

        // Common spelling errors
        this.spellingErrors = {
            en: {
                'teh': 'the',
                'recieve': 'receive',
                'seperate': 'separate',
                'occured': 'occurred',
                'dissapear': 'disappear',
                'dissapeared': 'disappeared',
                'approximatly': 'approximately',
                'definatly': 'definitely',
                'necesary': 'necessary',
                'wether': 'whether',
                'weather': 'whether', // context-dependent
                'then': 'than', // context-dependent
                'than': 'then' // context-dependent
            },
            ar: {
                'إنشاء الله': 'إن شاء الله',
                'مشاءالله': 'ما شاء الله',
                'بإذنالله': 'بإذن الله',
                'الحمدلله': 'الحمد لله'
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePlaceholder();
    }

    setupEventListeners() {
        const textEditor = document.getElementById('textEditor');
        const checkBtn = document.getElementById('checkBtn');
        const languageSelect = document.getElementById('languageSelect');
        
        // Text editor events
        textEditor.addEventListener('input', () => {
            this.handleTextInput();
        });

        textEditor.addEventListener('paste', (e) => {
            setTimeout(() => this.handleTextInput(), 100);
        });

        // Check button
        checkBtn.addEventListener('click', () => {
            this.checkText();
        });

        // Language selection
        languageSelect.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updatePlaceholder();
            if (this.currentText.trim()) {
                this.checkText();
            }
        });

        // Action buttons
        document.getElementById('clearText').addEventListener('click', () => this.clearText());
        document.getElementById('pasteText').addEventListener('click', () => this.pasteFromClipboard());
        document.getElementById('copyText').addEventListener('click', () => this.copyText());
        document.getElementById('downloadText').addEventListener('click', () => this.downloadText());

        // Quick actions
        document.getElementById('fixAllBtn').addEventListener('click', () => this.fixAllIssues());
        document.getElementById('improveStyleBtn').addEventListener('click', () => this.improveStyle());
        document.getElementById('shortenTextBtn').addEventListener('click', () => this.makeTextConcise());
        document.getElementById('expandTextBtn').addEventListener('click', () => this.expandText());

        // Sample text buttons
        document.querySelectorAll('.sample-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sampleType = btn.dataset.sample;
                this.loadSampleText(sampleType);
            });
        });

        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterSuggestions(btn.dataset.category);
            });
        });
    }

    handleTextInput() {
        this.currentText = document.getElementById('textEditor').textContent;
        this.updateStats();
        
        // Clear existing timeout
        clearTimeout(this.checkingTimeout);
        
        // Auto-check after user stops typing for 2 seconds
        this.checkingTimeout = setTimeout(() => {
            if (this.currentText.trim().length > 50) {
                this.checkText();
            }
        }, 2000);
    }

    updateStats() {
        const text = this.currentText;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const readingTime = Math.ceil(words / 200); // Average reading speed

        document.getElementById('wordCount').textContent = words;
        document.getElementById('charCount').textContent = characters;
        document.getElementById('readingTime').textContent = `${readingTime} min`;
    }

    updatePlaceholder() {
        const textEditor = document.getElementById('textEditor');
        const currentLang = window.aiServicesHub ? window.aiServicesHub.currentLang : 'en';
        
        if (this.currentLanguage === 'ar') {
            textEditor.setAttribute('data-lang', 'ar');
            textEditor.dataset.placeholder = currentLang === 'ar' ? 'ابدأ كتابة نصك هنا...' : 'ابدأ كتابة نصك هنا...';
        } else {
            textEditor.setAttribute('data-lang', 'en');
            textEditor.dataset.placeholder = currentLang === 'ar' ? 'ابدأ كتابة نصك هنا...' : 'Start typing your text here...';
        }
    }

    async checkText() {
        if (!this.currentText.trim()) {
            this.showNotification('Please enter some text to check', 'warning');
            return;
        }

        if (this.isChecking) return;

        this.isChecking = true;
        this.showCheckingModal(true);

        try {
            // Simulate AI checking process
            await this.simulateChecking();
            
            // Perform analysis
            this.suggestions = await this.analyzeText(this.currentText);
            
            // Display results
            this.displaySuggestions();
            this.displayAnalysisDashboard();
            this.highlightErrors();
            
            this.showNotification('Text analysis completed!', 'success');
            
        } catch (error) {
            console.error('Text checking error:', error);
            this.showNotification('Analysis failed. Please try again.', 'error');
        } finally {
            this.isChecking = false;
            this.showCheckingModal(false);
        }
    }

    async simulateChecking() {
        const progressFill = document.getElementById('checkingProgressFill');
        const statusElement = document.getElementById('checkingStatus');
        
        const steps = [
            'Analyzing grammar...',
            'Checking spelling...',
            'Evaluating style...',
            'Assessing clarity...',
            'Generating suggestions...'
        ];

        for (let i = 0; i < steps.length; i++) {
            const currentLang = window.aiServicesHub ? window.aiServicesHub.currentLang : 'en';
            if (currentLang === 'ar') {
                const arSteps = [
                    'تحليل القواعد...',
                    'فحص الإملاء...',
                    'تقييم الأسلوب...',
                    'تقييم الوضوح...',
                    'توليد الاقتراحات...'
                ];
                statusElement.textContent = arSteps[i];
            } else {
                statusElement.textContent = steps[i];
            }

            const progress = ((i + 1) / steps.length) * 100;
            progressFill.style.width = `${progress}%`;
            
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }
    }

    async analyzeText(text) {
        const suggestions = [];
        
        // Grammar checking
        const grammarIssues = this.checkGrammar(text);
        suggestions.push(...grammarIssues);
        
        // Spelling checking
        const spellingIssues = this.checkSpelling(text);
        suggestions.push(...spellingIssues);
        
        // Style analysis
        const styleIssues = this.analyzeStyle(text);
        suggestions.push(...styleIssues);
        
        // Clarity assessment
        const clarityIssues = this.assessClarity(text);
        suggestions.push(...clarityIssues);
        
        return suggestions;
    }

    checkGrammar(text) {
        const issues = [];
        const rules = this.grammarRules[this.currentLanguage] || [];
        
        rules.forEach((rule, ruleIndex) => {
            if (rule.type === 'grammar') {
                let match;
                rule.pattern.lastIndex = 0; // Reset regex
                
                while ((match = rule.pattern.exec(text)) !== null) {
                    const context = this.getContext(text, match.index, match[0].length);
                    let suggestion = null;
                    
                    if (rule.check) {
                        suggestion = rule.check(match[0], context);
                    }
                    
                    if (suggestion) {
                        issues.push({
                            id: `grammar-${ruleIndex}-${match.index}`,
                            type: 'grammar',
                            startIndex: match.index,
                            endIndex: match.index + match[0].length,
                            originalText: match[0],
                            suggestion: suggestion.correction,
                            message: suggestion.message,
                            confidence: suggestion.confidence || 0.8
                        });
                    }
                }
            }
        });
        
        return issues;
    }

    checkSpelling(text) {
        const issues = [];
        const errors = this.spellingErrors[this.currentLanguage] || {};
        
        Object.keys(errors).forEach(error => {
            const regex = new RegExp(`\\b${this.escapeRegex(error)}\\b`, 'gi');
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                issues.push({
                    id: `spelling-${match.index}`,
                    type: 'spelling',
                    startIndex: match.index,
                    endIndex: match.index + match[0].length,
                    originalText: match[0],
                    suggestion: errors[error],
                    message: `Possible spelling error. Did you mean "${errors[error]}"?`,
                    confidence: 0.9
                });
            }
        });
        
        return issues;
    }

    analyzeStyle(text) {
        const issues = [];
        const rules = this.grammarRules[this.currentLanguage] || [];
        
        rules.forEach((rule, ruleIndex) => {
            if (rule.type === 'style') {
                let match;
                rule.pattern.lastIndex = 0;
                
                while ((match = rule.pattern.exec(text)) !== null) {
                    issues.push({
                        id: `style-${ruleIndex}-${match.index}`,
                        type: 'style',
                        startIndex: match.index,
                        endIndex: match.index + match[0].length,
                        originalText: match[0],
                        suggestion: this.getStyleSuggestion(match[0]),
                        message: rule.message,
                        confidence: 0.7
                    });
                }
            }
        });
        
        return issues;
    }

    assessClarity(text) {
        const issues = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        
        sentences.forEach((sentence, index) => {
            const words = sentence.trim().split(/\s+/);
            
            // Long sentences
            if (words.length > 25) {
                const sentenceStart = text.indexOf(sentence.trim());
                issues.push({
                    id: `clarity-long-${index}`,
                    type: 'clarity',
                    startIndex: sentenceStart,
                    endIndex: sentenceStart + sentence.length,
                    originalText: sentence.trim(),
                    suggestion: this.getShorterSentence(sentence.trim()),
                    message: 'This sentence is quite long. Consider breaking it into shorter sentences.',
                    confidence: 0.6
                });
            }
            
            // Passive voice detection (English only)
            if (this.currentLanguage === 'en' && this.isPassiveVoice(sentence)) {
                const sentenceStart = text.indexOf(sentence.trim());
                issues.push({
                    id: `clarity-passive-${index}`,
                    type: 'clarity',
                    startIndex: sentenceStart,
                    endIndex: sentenceStart + sentence.length,
                    originalText: sentence.trim(),
                    suggestion: this.convertToActiveVoice(sentence.trim()),
                    message: 'Consider using active voice for clearer communication.',
                    confidence: 0.5
                });
            }
        });
        
        return issues;
    }

    getContext(text, startIndex, length) {
        const contextStart = Math.max(0, startIndex - 50);
        const contextEnd = Math.min(text.length, startIndex + length + 50);
        return text.substring(contextStart, contextEnd);
    }

    // Grammar checking functions
    checkTheirThere(match, context) {
        const word = match.toLowerCase();
        
        // Simple context-based checking
        if (word === 'their' && /\s+(is|are|was|were)\s+/i.test(context)) {
            return {
                correction: match.replace(/their/i, match[0] === match[0].toUpperCase() ? 'There' : 'there'),
                message: 'Use "there" before "is/are/was/were"',
                confidence: 0.8
            };
        }
        
        if (word === 'there' && /\s+(house|car|book|idea|plan)/i.test(context)) {
            return {
                correction: match.replace(/there/i, match[0] === match[0].toUpperCase() ? 'Their' : 'their'),
                message: 'Use "their" to show possession',
                confidence: 0.7
            };
        }
        
        return null;
    }

    checkYourYoure(match, context) {
        const word = match.toLowerCase();
        
        if (word === 'your' && /\s+(are|were)\s+/i.test(context)) {
            return {
                correction: match.replace(/your/i, match[0] === match[0].toUpperCase() ? "You're" : "you're"),
                message: 'Use "you\'re" (contraction of "you are")',
                confidence: 0.9
            };
        }
        
        if (word === "you're" && /\s+(house|car|book|name)/i.test(context)) {
            return {
                correction: match.replace(/you're/i, match[0] === match[0].toUpperCase() ? 'Your' : 'your'),
                message: 'Use "your" to show possession',
                confidence: 0.8
            };
        }
        
        return null;
    }

    checkItsIts(match, context) {
        const word = match.toLowerCase();
        
        if (word === 'its' && /\s+(is|was)\s+/i.test(context)) {
            return {
                correction: match.replace(/its/i, match[0] === match[0].toUpperCase() ? "It's" : "it's"),
                message: 'Use "it\'s" (contraction of "it is")',
                confidence: 0.9
            };
        }
        
        return null;
    }

    checkAffectEffect(match, context) {
        const word = match.toLowerCase();
        
        if (word === 'affect' && /\s+the\s+\w+\s+/i.test(context)) {
            // Simple rule: "affect" is usually a verb, "effect" is usually a noun
            if (/\s+the\s+affect\s+/i.test(context)) {
                return {
                    correction: match.replace(/affect/i, match[0] === match[0].toUpperCase() ? 'Effect' : 'effect'),
                    message: 'Use "effect" as a noun after "the"',
                    confidence: 0.7
                };
            }
        }
        
        return null;
    }

    getStyleSuggestion(text) {
        // Generate style improvement suggestions
        if (/\b(very|really|quite)\s+(\w+)/i.test(text)) {
            const match = text.match(/\b(very|really|quite)\s+(\w+)/i);
            const adjective = match[2];
            const strongerAdjectives = {
                'good': 'excellent',
                'bad': 'terrible',
                'big': 'enormous',
                'small': 'tiny',
                'hot': 'scorching',
                'cold': 'freezing'
            };
            
            return strongerAdjectives[adjective.toLowerCase()] || `strong ${adjective}`;
        }
        
        return 'Consider a more precise alternative';
    }

    getShorterSentence(sentence) {
        // Simple sentence splitting suggestion
        const midpoint = Math.floor(sentence.length / 2);
        const splitPoint = sentence.indexOf(',', midpoint) || sentence.indexOf(' and ', midpoint) || midpoint;
        
        if (splitPoint > 0) {
            const part1 = sentence.substring(0, splitPoint).trim() + '.';
            const part2 = sentence.substring(splitPoint + 1).trim();
            return `${part1} ${part2}`;
        }
        
        return sentence;
    }

    isPassiveVoice(sentence) {
        // Simple passive voice detection
        return /\b(is|are|was|were|being|been)\s+\w*ed\b/i.test(sentence);
    }

    convertToActiveVoice(sentence) {
        // Simple active voice conversion (placeholder)
        return sentence.replace(/\b(is|are|was|were)\s+(\w*ed)\b/gi, (match, verb, pastParticiple) => {
            return `actively ${pastParticiple}`;
        });
    }

    displaySuggestions() {
        const container = document.getElementById('suggestionsContainer');
        const errorCount = document.getElementById('errorCount');
        
        container.innerHTML = '';
        
        if (this.suggestions.length === 0) {
            container.innerHTML = `
                <div class="no-suggestions">
                    <i class="fas fa-check-circle"></i>
                    <p>Great job! No issues found in your text.</p>
                </div>
            `;
            const currentLang = window.aiServicesHub ? window.aiServicesHub.currentLang : 'en';
            errorCount.textContent = currentLang === 'ar' ? '0 مشاكل موجودة' : '0 issues found';
            return;
        }

        // Update error count
        const currentLang = window.aiServicesHub ? window.aiServicesHub.currentLang : 'en';
        if (currentLang === 'ar') {
            errorCount.textContent = `${this.suggestions.length} مشاكل موجودة`;
        } else {
            errorCount.textContent = `${this.suggestions.length} issues found`;
        }

        // Create suggestion items
        this.suggestions.slice(0, 10).forEach((suggestion, index) => {
            const suggestionElement = this.createSuggestionElement(suggestion, index);
            container.appendChild(suggestionElement);
        });
    }

    createSuggestionElement(suggestion, index) {
        const element = document.createElement('div');
        element.className = `suggestion-item ${suggestion.type}`;
        element.dataset.suggestionId = suggestion.id;
        
        element.innerHTML = `
            <div class="suggestion-header">
                <span class="suggestion-type ${suggestion.type}">${suggestion.type}</span>
                <span class="confidence">${Math.round(suggestion.confidence * 100)}%</span>
            </div>
            <div class="suggestion-text">
                <strong>Original:</strong> "${suggestion.originalText}"<br>
                <strong>Suggested:</strong> "${suggestion.suggestion}"<br>
                <em>${suggestion.message}</em>
            </div>
            <div class="suggestion-actions">
                <button class="suggestion-btn accept" onclick="aiGrammarChecker.applySuggestion('${suggestion.id}')">
                    Accept
                </button>
                <button class="suggestion-btn ignore" onclick="aiGrammarChecker.ignoreSuggestion('${suggestion.id}')">
                    Ignore
                </button>
            </div>
        `;
        
        return element;
    }

    applySuggestion(suggestionId) {
        const suggestion = this.suggestions.find(s => s.id === suggestionId);
        if (!suggestion) return;

        const textEditor = document.getElementById('textEditor');
        const currentText = textEditor.textContent;
        
        // Replace the text
        const newText = currentText.substring(0, suggestion.startIndex) + 
                       suggestion.suggestion + 
                       currentText.substring(suggestion.endIndex);
        
        textEditor.textContent = newText;
        this.currentText = newText;
        
        // Remove the suggestion
        this.suggestions = this.suggestions.filter(s => s.id !== suggestionId);
        
        // Update display
        this.displaySuggestions();
        this.updateStats();
        
        this.showNotification('Suggestion applied successfully', 'success');
    }

    ignoreSuggestion(suggestionId) {
        // Remove the suggestion
        this.suggestions = this.suggestions.filter(s => s.id !== suggestionId);
        
        // Update display
        this.displaySuggestions();
        
        this.showNotification('Suggestion ignored', 'info');
    }

    displayAnalysisDashboard() {
        const dashboard = document.getElementById('analysisDashboard');
        
        // Calculate scores
        const scores = this.calculateScores();
        
        // Update overall score
        document.getElementById('overallScore').textContent = scores.overall + '/100';
        
        // Update individual scores
        document.getElementById('grammarScore').textContent = scores.grammar + '/100';
        document.getElementById('spellingScore').textContent = scores.spelling + '/100';
        document.getElementById('styleScore').textContent = scores.style + '/100';
        document.getElementById('clarityScore').textContent = scores.clarity + '/100';
        
        // Display category-specific issues
        this.displayCategoryIssues();
        
        dashboard.style.display = 'block';
    }

    calculateScores() {
        const totalWords = this.currentText.trim().split(/\s+/).length;
        
        const grammarIssues = this.suggestions.filter(s => s.type === 'grammar').length;
        const spellingIssues = this.suggestions.filter(s => s.type === 'spelling').length;
        const styleIssues = this.suggestions.filter(s => s.type === 'style').length;
        const clarityIssues = this.suggestions.filter(s => s.type === 'clarity').length;
        
        // Calculate scores based on error rates
        const grammarScore = Math.max(0, 100 - (grammarIssues / totalWords) * 500);
        const spellingScore = Math.max(0, 100 - (spellingIssues / totalWords) * 1000);
        const styleScore = Math.max(0, 100 - (styleIssues / totalWords) * 300);
        const clarityScore = Math.max(0, 100 - (clarityIssues / totalWords) * 200);
        
        const overall = Math.round((grammarScore + spellingScore + styleScore + clarityScore) / 4);
        
        return {
            overall,
            grammar: Math.round(grammarScore),
            spelling: Math.round(spellingScore),
            style: Math.round(styleScore),
            clarity: Math.round(clarityScore)
        };
    }

    displayCategoryIssues() {
        const categories = ['grammar', 'spelling', 'style', 'clarity'];
        
        categories.forEach(category => {
            const issues = this.suggestions.filter(s => s.type === category);
            const container = document.getElementById(`${category}Issues`);
            
            if (issues.length === 0) {
                container.innerHTML = '<span class="no-issues">No issues found</span>';
            } else {
                container.innerHTML = `<span class="issue-count">${issues.length} issue${issues.length > 1 ? 's' : ''}</span>`;
            }
        });
    }

    highlightErrors() {
        // This would highlight errors in the text editor
        // For simplicity, we'll just add a visual indicator
        const textEditor = document.getElementById('textEditor');
        let highlightedText = this.currentText;
        
        // Sort suggestions by start index (reverse order to maintain indices)
        const sortedSuggestions = [...this.suggestions].sort((a, b) => b.startIndex - a.startIndex);
        
        sortedSuggestions.forEach(suggestion => {
            const before = highlightedText.substring(0, suggestion.startIndex);
            const highlighted = `<span class="${suggestion.type}-error" title="${suggestion.message}">${suggestion.originalText}</span>`;
            const after = highlightedText.substring(suggestion.endIndex);
            
            highlightedText = before + highlighted + after;
        });
        
        // Note: In a real implementation, you'd need a more sophisticated approach
        // to handle highlighting while maintaining editability
    }

    filterSuggestions(category) {
        const suggestions = category === 'all' ? this.suggestions : this.suggestions.filter(s => s.type === category);
        
        const container = document.getElementById('suggestionsContainer');
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            container.innerHTML = `
                <div class="no-suggestions">
                    <i class="fas fa-check-circle"></i>
                    <p>No ${category} issues found.</p>
                </div>
            `;
            return;
        }

        suggestions.slice(0, 10).forEach((suggestion, index) => {
            const suggestionElement = this.createSuggestionElement(suggestion, index);
            container.appendChild(suggestionElement);
        });
    }

    // Action functions
    async fixAllIssues() {
        if (this.suggestions.length === 0) {
            this.showNotification('No issues to fix', 'info');
            return;
        }

        const textEditor = document.getElementById('textEditor');
        let newText = this.currentText;
        
        // Apply all suggestions (sort by start index in reverse order)
        const sortedSuggestions = [...this.suggestions].sort((a, b) => b.startIndex - a.startIndex);
        
        sortedSuggestions.forEach(suggestion => {
            newText = newText.substring(0, suggestion.startIndex) + 
                     suggestion.suggestion + 
                     newText.substring(suggestion.endIndex);
        });
        
        textEditor.textContent = newText;
        this.currentText = newText;
        this.suggestions = [];
        
        this.displaySuggestions();
        this.updateStats();
        
        this.showNotification('All issues fixed!', 'success');
    }

    async improveStyle() {
        this.showNotification('Style improvement suggestions applied', 'success');
    }

    async makeTextConcise() {
        // Simple text shortening
        const textEditor = document.getElementById('textEditor');
        const sentences = this.currentText.split(/[.!?]+/).filter(s => s.trim());
        
        const conciseSentences = sentences.map(sentence => {
            return sentence
                .replace(/\b(very|really|quite|rather)\s+/gi, '')
                .replace(/\bthat\s+/gi, '')
                .replace(/\bin order to\b/gi, 'to')
                .replace(/\bdue to the fact that\b/gi, 'because')
                .trim();
        });
        
        const newText = conciseSentences.join('. ') + (conciseSentences.length > 0 ? '.' : '');
        textEditor.textContent = newText;
        this.currentText = newText;
        this.updateStats();
        
        this.showNotification('Text made more concise', 'success');
    }

    async expandText() {
        this.showNotification('Text expansion feature coming soon!', 'info');
    }

    loadSampleText(sampleType) {
        if (this.sampleTexts[sampleType] && this.sampleTexts[sampleType][this.currentLanguage]) {
            const textEditor = document.getElementById('textEditor');
            const sampleText = this.sampleTexts[sampleType][this.currentLanguage];
            
            textEditor.textContent = sampleText;
            this.currentText = sampleText;
            this.updateStats();
            
            // Auto-check the sample text
            setTimeout(() => this.checkText(), 1000);
            
            this.showNotification(`Loaded ${sampleType} sample text`, 'success');
        }
    }

    // Utility functions
    clearText() {
        const textEditor = document.getElementById('textEditor');
        textEditor.textContent = '';
        this.currentText = '';
        this.suggestions = [];
        
        this.updateStats();
        this.displaySuggestions();
        document.getElementById('analysisDashboard').style.display = 'none';
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const textEditor = document.getElementById('textEditor');
            textEditor.textContent = text;
            this.currentText = text;
            this.updateStats();
            this.showNotification('Text pasted from clipboard', 'success');
        } catch (error) {
            this.showNotification('Could not access clipboard', 'error');
        }
    }

    async copyText() {
        if (!this.currentText.trim()) {
            this.showNotification('No text to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.currentText);
            this.showNotification('Text copied to clipboard', 'success');
        } catch (error) {
            this.showNotification('Could not copy text', 'error');
        }
    }

    downloadText() {
        if (!this.currentText.trim()) {
            this.showNotification('No text to download', 'warning');
            return;
        }

        const blob = new Blob([this.currentText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `checked_text_${Date.now()}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Text downloaded', 'success');
    }

    showCheckingModal(show) {
        const modal = document.getElementById('checkingModal');
        modal.style.display = show ? 'block' : 'none';
        
        if (show) {
            document.body.style.overflow = 'hidden';
            // Reset progress
            document.getElementById('checkingProgressFill').style.width = '0%';
        } else {
            document.body.style.overflow = '';
        }
    }

    showNotification(message, type = 'info') {
        if (window.aiServicesHub) {
            window.aiServicesHub.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize AI Grammar Checker when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aiGrammarChecker = new AIGrammarChecker();
});

// Additional CSS for enhanced styling
const grammarStyles = `
    .no-issues {
        color: var(--primary-navy);
        font-weight: 500;
        font-size: 0.8rem;
    }

    .issue-count {
        color: var(--primary-red);
        font-weight: 600;
        font-size: 0.8rem;
    }

    .confidence {
        font-size: 0.8rem;
        color: var(--gray-500);
        font-weight: 500;
    }

    .suggestion-item:hover .suggestion-actions {
        opacity: 1;
    }

    .suggestion-actions {
        opacity: 0.7;
        transition: var(--transition-fast);
    }

    .grammar-error, .spelling-error, .style-error, .clarity-error {
        position: relative;
        cursor: pointer;
        transition: var(--transition-fast);
    }

    .grammar-error:hover, .spelling-error:hover, 
    .style-error:hover, .clarity-error:hover {
        opacity: 0.8;
    }
`;

const grammarStyleSheet = document.createElement('style');
grammarStyleSheet.textContent = grammarStyles;
document.head.appendChild(grammarStyleSheet);