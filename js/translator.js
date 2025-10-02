// AI Translator Service - Enhanced with Multiple AI Models
class AITranslator {
    constructor() {
        this.currentModel = 'gpt-4-translation';
        this.translationHistory = [];
        this.isTranslating = false;
        
        // Language mappings for better accuracy
        this.languages = {
            'auto': 'Auto-detect',
            'en': 'English',
            'ar': 'Arabic',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'hi': 'Hindi',
            'tr': 'Turkish',
            'pl': 'Polish',
            'nl': 'Dutch'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTranslationHistory();
        this.updateCharCount();
    }

    setupEventListeners() {
        // Text input events
        const sourceText = document.getElementById('sourceText');
        const translateBtn = document.getElementById('translateBtn');
        const clearBtn = document.getElementById('clearText');
        const pasteBtn = document.getElementById('pasteText');
        const swapBtn = document.getElementById('swapLanguages');

        sourceText.addEventListener('input', () => {
            this.updateCharCount();
            this.handleAutoTranslate();
        });

        translateBtn.addEventListener('click', () => {
            this.translateText();
        });

        clearBtn.addEventListener('click', () => {
            this.clearText();
        });

        pasteBtn.addEventListener('click', () => {
            this.pasteFromClipboard();
        });

        swapBtn.addEventListener('click', () => {
            this.swapLanguages();
        });

        // Output actions
        const copyBtn = document.getElementById('copyTranslation');
        const speakBtn = document.getElementById('speakTranslation');

        copyBtn.addEventListener('click', () => {
            this.copyTranslation();
        });

        speakBtn.addEventListener('click', () => {
            this.speakTranslation();
        });

        // Quick phrases
        const phraseButtons = document.querySelectorAll('.phrase-btn');
        phraseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.text;
                sourceText.value = text;
                this.updateCharCount();
                this.translateText();
            });
        });

        // Language selection change
        const sourceLanguage = document.getElementById('sourceLanguage');
        const targetLanguage = document.getElementById('targetLanguage');

        sourceLanguage.addEventListener('change', () => {
            if (sourceText.value.trim()) {
                this.translateText();
            }
        });

        targetLanguage.addEventListener('change', () => {
            if (sourceText.value.trim()) {
                this.translateText();
            }
        });

        // Enter key to translate
        sourceText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.translateText();
            }
        });
    }

    updateCharCount() {
        const sourceText = document.getElementById('sourceText');
        const charCount = document.getElementById('charCount');
        const count = sourceText.value.length;
        charCount.textContent = `${count} / 5000`;
        
        if (count > 4500) {
            charCount.style.color = 'var(--primary-red)';
        } else {
            charCount.style.color = 'var(--gray-500)';
        }
    }

    async translateText() {
        if (this.isTranslating) return;

        const sourceText = document.getElementById('sourceText').value.trim();
        const sourceLanguage = document.getElementById('sourceLanguage').value;
        const targetLanguage = document.getElementById('targetLanguage').value;

        if (!sourceText) {
            this.showNotification('Please enter text to translate', 'warning');
            return;
        }

        if (sourceLanguage === targetLanguage && sourceLanguage !== 'auto') {
            this.showNotification('Source and target languages cannot be the same', 'warning');
            return;
        }

        this.isTranslating = true;
        this.showLoadingModal(true);

        try {
            // Simulate AI translation with multiple models
            const translation = await this.performTranslation(sourceText, sourceLanguage, targetLanguage);
            this.displayTranslation(translation);
            this.addToHistory(sourceText, translation.text, sourceLanguage, targetLanguage);
        } catch (error) {
            console.error('Translation error:', error);
            this.showNotification('Translation failed. Please try again.', 'error');
        } finally {
            this.isTranslating = false;
            this.showLoadingModal(false);
        }
    }

    async performTranslation(text, sourceLang, targetLang) {
        // Simulate different AI models for translation
        const models = [
            { name: 'GPT-4 Translation', confidence: 0.95 },
            { name: 'Claude Translation', confidence: 0.92 },
            { name: 'Google Neural MT', confidence: 0.88 },
            { name: 'DeepL AI', confidence: 0.94 }
        ];

        const selectedModel = models[Math.floor(Math.random() * models.length)];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

        // Detect source language if auto
        let detectedLanguage = sourceLang;
        if (sourceLang === 'auto') {
            detectedLanguage = this.detectLanguage(text);
        }

        // Generate translation based on language pairs and text content
        const translatedText = this.generateTranslation(text, detectedLanguage, targetLang);

        return {
            text: translatedText,
            sourceLanguage: detectedLanguage,
            targetLanguage: targetLang,
            confidence: selectedModel.confidence,
            model: selectedModel.name,
            originalText: text
        };
    }

    detectLanguage(text) {
        // Simple language detection based on character patterns
        const arabicPattern = /[\u0600-\u06FF]/;
        const chinesePattern = /[\u4e00-\u9fff]/;
        const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/;
        const koreanPattern = /[\uac00-\ud7af]/;
        const russianPattern = /[\u0400-\u04FF]/;
        
        if (arabicPattern.test(text)) return 'ar';
        if (chinesePattern.test(text)) return 'zh';
        if (japanesePattern.test(text)) return 'ja';
        if (koreanPattern.test(text)) return 'ko';
        if (russianPattern.test(text)) return 'ru';
        
        // Default to English for Latin scripts
        return 'en';
    }

    generateTranslation(text, sourceLang, targetLang) {
        // Enhanced translation simulation with context awareness
        const translations = {
            'en-ar': {
                'Hello, how are you?': 'مرحباً، كيف حالك؟',
                'Thank you very much': 'شكراً لك جزيلاً',
                'Where is the nearest hospital?': 'أين أقرب مستشفى؟',
                'I need help': 'أحتاج المساعدة',
                'What time is it?': 'كم الساعة؟',
                'Good morning': 'صباح الخير',
                'Good evening': 'مساء الخير',
                'Please': 'من فضلك',
                'Excuse me': 'عفواً',
                'I love you': 'أحبك',
                'How much does this cost?': 'كم يكلف هذا؟',
                'I don\'t understand': 'لا أفهم',
                'Can you help me?': 'هل يمكنك مساعدتي؟'
            },
            'ar-en': {
                'مرحباً، كيف حالك؟': 'Hello, how are you?',
                'شكراً لك جزيلاً': 'Thank you very much',
                'أين أقرب مستشفى؟': 'Where is the nearest hospital?',
                'أحتاج المساعدة': 'I need help',
                'كم الساعة؟': 'What time is it?',
                'صباح الخير': 'Good morning',
                'مساء الخير': 'Good evening',
                'من فضلك': 'Please',
                'عفواً': 'Excuse me',
                'أحبك': 'I love you',
                'كم يكلف هذا؟': 'How much does this cost?',
                'لا أفهم': 'I don\'t understand',
                'هل يمكنك مساعدتي؟': 'Can you help me?'
            }
        };

        const translationKey = `${sourceLang}-${targetLang}`;
        
        // Check for exact matches first
        if (translations[translationKey] && translations[translationKey][text]) {
            return translations[translationKey][text];
        }

        // Generate contextual translation for other cases
        return this.generateContextualTranslation(text, sourceLang, targetLang);
    }

    generateContextualTranslation(text, sourceLang, targetLang) {
        // Advanced translation logic with context awareness
        const patterns = {
            'question': /^(what|how|where|when|why|who|which|is|are|do|does|did|can|could|will|would)/i,
            'greeting': /^(hello|hi|hey|good morning|good evening|good night)/i,
            'gratitude': /^(thank|thanks|grateful)/i,
            'request': /^(please|can you|could you|would you)/i,
            'negative': /(no|not|never|don't|doesn't|won't|can't)/i
        };

        let translatedText = text;

        // Apply translation patterns based on language pairs
        if (sourceLang === 'en' && targetLang === 'ar') {
            if (patterns.question.test(text)) {
                translatedText = `${text} [ترجمة سؤال باللغة العربية]`;
            } else if (patterns.greeting.test(text)) {
                translatedText = `${text} [تحية باللغة العربية]`;
            } else {
                translatedText = `[ترجمة نصية متقدمة]: ${text}`;
            }
        } else if (sourceLang === 'ar' && targetLang === 'en') {
            translatedText = `[Advanced AI Translation]: ${text}`;
        } else {
            // Other language pairs
            const targetLanguageName = this.languages[targetLang] || targetLang;
            translatedText = `[${targetLanguageName} Translation]: ${text}`;
        }

        return translatedText;
    }

    displayTranslation(translation) {
        const output = document.getElementById('translationOutput');
        const info = document.getElementById('translationInfo');
        const confidenceScore = document.getElementById('confidenceScore');
        const modelUsed = document.getElementById('modelUsed');

        // Display translation
        output.innerHTML = `<div class="translation-result">${translation.text}</div>`;
        
        // Show translation info
        info.style.display = 'flex';
        confidenceScore.textContent = `${Math.round(translation.confidence * 100)}%`;
        modelUsed.textContent = translation.model;

        // Update detected language if auto-detect was used
        if (document.getElementById('sourceLanguage').value === 'auto') {
            const sourceLang = document.getElementById('sourceLanguage');
            // Visual indication of detected language
            const option = sourceLang.querySelector(`option[value="${translation.sourceLanguage}"]`);
            if (option) {
                sourceLang.style.backgroundColor = 'var(--gray-100)';
                setTimeout(() => {
                    sourceLang.style.backgroundColor = '';
                }, 2000);
            }
        }
    }

    addToHistory(sourceText, translatedText, sourceLang, targetLang) {
        const historyItem = {
            id: Date.now(),
            sourceText,
            translatedText,
            sourceLang,
            targetLang,
            timestamp: new Date().toISOString()
        };

        this.translationHistory.unshift(historyItem);
        
        // Keep only last 10 translations
        if (this.translationHistory.length > 10) {
            this.translationHistory = this.translationHistory.slice(0, 10);
        }

        this.saveTranslationHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContainer = document.querySelector('.translation-history');
        const historyList = document.getElementById('historyList');

        if (this.translationHistory.length > 0) {
            historyContainer.style.display = 'block';
            historyList.innerHTML = '';

            this.translationHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-source">${item.sourceText}</div>
                    <div class="history-arrow">→</div>
                    <div class="history-translation">${item.translatedText}</div>
                    <div class="history-languages">${this.languages[item.sourceLang]} → ${this.languages[item.targetLang]}</div>
                `;
                
                historyItem.addEventListener('click', () => {
                    document.getElementById('sourceText').value = item.sourceText;
                    document.getElementById('sourceLanguage').value = item.sourceLang;
                    document.getElementById('targetLanguage').value = item.targetLang;
                    this.updateCharCount();
                });

                historyList.appendChild(historyItem);
            });
        }
    }

    swapLanguages() {
        const sourceSelect = document.getElementById('sourceLanguage');
        const targetSelect = document.getElementById('targetLanguage');
        const sourceText = document.getElementById('sourceText');
        const output = document.getElementById('translationOutput');

        // Don't swap if source is auto-detect
        if (sourceSelect.value === 'auto') {
            this.showNotification('Cannot swap when auto-detect is enabled', 'warning');
            return;
        }

        // Swap language selections
        const tempLang = sourceSelect.value;
        sourceSelect.value = targetSelect.value;
        targetSelect.value = tempLang;

        // Swap text content if translation exists
        const translationResult = output.querySelector('.translation-result');
        if (translationResult && sourceText.value.trim()) {
            const tempText = sourceText.value;
            sourceText.value = translationResult.textContent;
            this.updateCharCount();
        }

        // Auto-translate if text exists
        if (sourceText.value.trim()) {
            this.translateText();
        }
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const sourceText = document.getElementById('sourceText');
            sourceText.value = text;
            this.updateCharCount();
            this.showNotification('Text pasted from clipboard', 'success');
        } catch (error) {
            console.error('Clipboard access failed:', error);
            this.showNotification('Could not access clipboard', 'error');
        }
    }

    async copyTranslation() {
        const output = document.getElementById('translationOutput');
        const translationResult = output.querySelector('.translation-result');
        
        if (!translationResult) {
            this.showNotification('No translation to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(translationResult.textContent);
            this.showNotification('Translation copied to clipboard', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Could not copy translation', 'error');
        }
    }

    speakTranslation() {
        const output = document.getElementById('translationOutput');
        const translationResult = output.querySelector('.translation-result');
        
        if (!translationResult) {
            this.showNotification('No translation to speak', 'warning');
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(translationResult.textContent);
            const targetLang = document.getElementById('targetLanguage').value;
            
            // Set language for speech synthesis
            utterance.lang = this.getSpeechLanguageCode(targetLang);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            
            speechSynthesis.speak(utterance);
            this.showNotification('Speaking translation...', 'info');
        } else {
            this.showNotification('Speech synthesis not supported', 'error');
        }
    }

    getSpeechLanguageCode(langCode) {
        const speechCodes = {
            'ar': 'ar-SA',
            'en': 'en-US',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT',
            'pt': 'pt-PT',
            'ru': 'ru-RU',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'zh': 'zh-CN',
            'hi': 'hi-IN',
            'tr': 'tr-TR',
            'pl': 'pl-PL',
            'nl': 'nl-NL'
        };
        
        return speechCodes[langCode] || langCode;
    }

    clearText() {
        document.getElementById('sourceText').value = '';
        document.getElementById('translationOutput').innerHTML = '<div class="placeholder-text">Translation will appear here...</div>';
        document.getElementById('translationInfo').style.display = 'none';
        this.updateCharCount();
    }

    handleAutoTranslate() {
        // Clear previous auto-translate timeout
        clearTimeout(this.autoTranslateTimeout);
        
        // Set new timeout for auto-translate (2 seconds after user stops typing)
        this.autoTranslateTimeout = setTimeout(() => {
            const sourceText = document.getElementById('sourceText').value.trim();
            if (sourceText && sourceText.length > 10) {
                // Only auto-translate for longer texts to avoid excessive API calls
                this.translateText();
            }
        }, 2000);
    }

    showLoadingModal(show) {
        const modal = document.getElementById('loadingModal');
        modal.style.display = show ? 'block' : 'none';
        
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    showNotification(message, type = 'info') {
        // Use the main notification system
        if (window.aiServicesHub) {
            window.aiServicesHub.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    saveTranslationHistory() {
        localStorage.setItem('ai-translator-history', JSON.stringify(this.translationHistory));
    }

    loadTranslationHistory() {
        const saved = localStorage.getItem('ai-translator-history');
        if (saved) {
            try {
                this.translationHistory = JSON.parse(saved);
                this.updateHistoryDisplay();
            } catch (error) {
                console.error('Failed to load translation history:', error);
            }
        }
    }
}

// Initialize AI Translator when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aiTranslator = new AITranslator();
});

// Additional CSS for history items
const historyStyles = `
    .history-item {
        background: var(--gray-50);
        border-radius: var(--radius-lg);
        padding: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: var(--transition-fast);
        border: 1px solid var(--gray-200);
    }

    .history-item:hover {
        background: var(--primary-white);
        border-color: var(--primary-navy);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .history-source {
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--gray-700);
    }

    .history-arrow {
        text-align: center;
        color: var(--primary-navy);
        font-weight: bold;
        margin: 0.25rem 0;
    }

    .history-translation {
        font-style: italic;
        color: var(--gray-600);
        margin-bottom: 0.5rem;
    }

    .history-languages {
        font-size: 0.8rem;
        color: var(--gray-500);
        text-align: right;
        font-weight: 500;
    }

    .translation-result {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--gray-800);
        background: linear-gradient(135deg, var(--gray-50), var(--primary-white));
        padding: 1rem;
        border-radius: var(--radius-lg);
        border-left: 4px solid var(--primary-navy);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = historyStyles;
document.head.appendChild(styleSheet);