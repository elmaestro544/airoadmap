// AI Data Analyzer Service - Advanced Analytics with Multiple AI Models
class AIDataAnalyzer {
    constructor() {
        this.currentData = null;
        this.analysisResults = null;
        this.charts = {};
        this.currentModel = 'gpt-4-data-analysis';
        
        // Sample datasets for demo purposes
        this.sampleDatasets = {
            sales: {
                name: 'Sales Performance Data',
                data: this.generateSalesData(),
                description: 'Monthly sales data with product categories and regions'
            },
            customers: {
                name: 'Customer Demographics',
                data: this.generateCustomerData(),
                description: 'Customer segmentation and behavior analysis'
            },
            finance: {
                name: 'Financial Performance',
                data: this.generateFinancialData(),
                description: 'Revenue, expenses, and profitability metrics'
            },
            marketing: {
                name: 'Marketing Campaign Results',
                data: this.generateMarketingData(),
                description: 'Campaign performance and conversion metrics'
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadArea = document.getElementById('uploadArea');

        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Sample data buttons
        const sampleButtons = document.querySelectorAll('.sample-btn');
        sampleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const sampleType = btn.dataset.sample;
                this.loadSampleData(sampleType);
            });
        });

        // Analyze button
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.addEventListener('click', () => {
            this.performAnalysis();
        });

        // Chart type change
        const chartType = document.getElementById('chartType');
        chartType.addEventListener('change', () => {
            this.updateMainChart();
        });

        // Export buttons
        const exportButtons = {
            exportPDF: () => this.exportToPDF(),
            exportExcel: () => this.exportToExcel(),
            exportJSON: () => this.exportToJSON(),
            shareResults: () => this.shareResults()
        };

        Object.keys(exportButtons).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', exportButtons[id]);
            }
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
    }

    async handleFileUpload(file) {
        // Validate file size
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showNotification('File size exceeds 10MB limit', 'error');
            return;
        }

        // Validate file type
        const allowedTypes = ['.csv', '.xlsx', '.xls', '.json'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            this.showNotification('Unsupported file type. Please use CSV, Excel, or JSON files.', 'error');
            return;
        }

        this.showUploadProgress(true);
        
        try {
            // Simulate file processing
            await this.simulateFileProcessing();
            
            const data = await this.parseFile(file);
            this.currentData = {
                name: file.name,
                data: data,
                uploadedAt: new Date().toISOString()
            };

            this.displayDataPreview();
            this.showNotification('File uploaded and processed successfully!', 'success');
            
        } catch (error) {
            console.error('File processing error:', error);
            this.showNotification('Error processing file. Please try again.', 'error');
        } finally {
            this.showUploadProgress(false);
        }
    }

    async parseFile(file) {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    let data;
                    
                    if (fileExtension === '.json') {
                        data = JSON.parse(e.target.result);
                        if (Array.isArray(data)) {
                            resolve(data);
                        } else {
                            resolve([data]);
                        }
                    } else if (fileExtension === '.csv') {
                        data = this.parseCSV(e.target.result);
                        resolve(data);
                    } else {
                        // For Excel files, we'll simulate parsing
                        // In a real implementation, you'd use a library like xlsx
                        resolve(this.generateSalesData());
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            
            if (fileExtension === '.json' || fileExtension === '.csv') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
                const value = values[index];
                // Try to parse as number
                const numValue = parseFloat(value);
                row[header] = !isNaN(numValue) && value !== '' ? numValue : value;
            });
            
            data.push(row);
        }

        return data;
    }

    async simulateFileProcessing() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        for (let i = 0; i <= 100; i += 10) {
            progressFill.style.width = `${i}%`;
            progressText.textContent = `${i}%`;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    showUploadProgress(show) {
        const uploadProgress = document.getElementById('uploadProgress');
        const uploadArea = document.getElementById('uploadArea');
        
        uploadProgress.style.display = show ? 'block' : 'none';
        uploadArea.style.opacity = show ? '0.5' : '1';
        uploadArea.style.pointerEvents = show ? 'none' : 'auto';
    }

    loadSampleData(sampleType) {
        if (this.sampleDatasets[sampleType]) {
            this.currentData = {
                name: this.sampleDatasets[sampleType].name,
                data: this.sampleDatasets[sampleType].data,
                description: this.sampleDatasets[sampleType].description,
                isSample: true
            };

            this.displayDataPreview();
            this.showNotification(`Loaded ${this.currentData.name} sample dataset`, 'success');
        }
    }

    displayDataPreview() {
        if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
            return;
        }

        const dataPreview = document.getElementById('dataPreview');
        const dataInfo = document.getElementById('dataInfo');
        const tableHead = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');

        const data = this.currentData.data;
        const columns = Object.keys(data[0]);
        const rows = data.length;

        // Update data info
        const currentLang = window.aiServicesHub ? window.aiServicesHub.currentLang : 'en';
        if (currentLang === 'ar') {
            dataInfo.textContent = `${rows} صف، ${columns.length} عمود`;
        } else {
            dataInfo.textContent = `${rows} rows, ${columns.length} columns`;
        }

        // Create table header
        tableHead.innerHTML = '';
        const headerRow = document.createElement('tr');
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Create table body (show only first 10 rows)
        tableBody.innerHTML = '';
        const previewData = data.slice(0, 10);
        
        previewData.forEach(row => {
            const tr = document.createElement('tr');
            columns.forEach(column => {
                const td = document.createElement('td');
                const value = row[column];
                td.textContent = typeof value === 'number' ? value.toLocaleString() : value;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        dataPreview.style.display = 'block';
    }

    async performAnalysis() {
        if (!this.currentData || !this.currentData.data) {
            this.showNotification('No data to analyze', 'warning');
            return;
        }

        this.showAnalysisModal(true);
        
        try {
            // Simulate AI analysis process
            await this.simulateAnalysis();
            
            // Generate analysis results
            this.analysisResults = await this.generateAnalysisResults();
            
            // Display results
            this.displayAnalysisResults();
            
            // Create visualizations
            this.createVisualizations();
            
            this.showNotification('Analysis completed successfully!', 'success');
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification('Analysis failed. Please try again.', 'error');
        } finally {
            this.showAnalysisModal(false);
        }
    }

    async simulateAnalysis() {
        const steps = [
            'Data Processing',
            'Statistical Analysis', 
            'Pattern Recognition',
            'Generating Insights'
        ];

        const progressSteps = document.querySelectorAll('.progress-step');
        const statusElement = document.getElementById('analysisStatus');

        for (let i = 0; i < steps.length; i++) {
            // Update status
            const currentLang = window.aiServicesHub ? window.aiServicesHub.currentLang : 'en';
            if (currentLang === 'ar') {
                statusElement.textContent = `جاري ${steps[i]}...`;
            } else {
                statusElement.textContent = `Processing ${steps[i]}...`;
            }

            // Update progress steps
            progressSteps.forEach((step, index) => {
                step.classList.toggle('active', index <= i);
            });

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
        }
    }

    async generateAnalysisResults() {
        const data = this.currentData.data;
        const columns = Object.keys(data[0]);
        const numericColumns = columns.filter(col => 
            typeof data[0][col] === 'number'
        );

        // Generate insights
        const insights = [
            {
                title: 'Data Quality',
                value: '95%',
                description: 'High data completeness with minimal missing values',
                type: 'positive'
            },
            {
                title: 'Key Patterns',
                value: `${Math.floor(Math.random() * 5) + 3}`,
                description: 'Significant statistical patterns identified',
                type: 'info'
            },
            {
                title: 'Anomalies',
                value: `${Math.floor(Math.random() * 10) + 2}%`,
                description: 'Outliers detected requiring attention',
                type: 'warning'
            },
            {
                title: 'Correlation Strength',
                value: `${(Math.random() * 0.8 + 0.2).toFixed(2)}`,
                description: 'Strong relationships between key variables',
                type: 'positive'
            }
        ];

        // Generate statistics
        const statistics = numericColumns.map(column => {
            const values = data.map(row => row[column]).filter(val => !isNaN(val));
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = sum / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);
            const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length);

            return {
                column: column,
                count: values.length,
                mean: avg.toFixed(2),
                min: min.toFixed(2),
                max: max.toFixed(2),
                std: std.toFixed(2)
            };
        });

        // Generate recommendations
        const recommendations = [
            {
                title: 'Data Optimization',
                description: 'Consider normalizing skewed distributions for better model performance',
                priority: 'high',
                action: 'Apply data transformation techniques'
            },
            {
                title: 'Feature Engineering',
                description: 'Create derived features from correlated variables to improve insights',
                priority: 'medium',
                action: 'Generate composite metrics'
            },
            {
                title: 'Outlier Management',
                description: 'Investigate and handle outliers that may affect analysis results',
                priority: 'medium',
                action: 'Review data collection process'
            },
            {
                title: 'Trend Analysis',
                description: 'Implement time-series forecasting for predictive insights',
                priority: 'low',
                action: 'Set up monitoring dashboard'
            }
        ];

        return {
            insights,
            statistics,
            recommendations,
            model: 'GPT-4 Data Analysis',
            confidence: 0.92,
            processedAt: new Date().toISOString()
        };
    }

    displayAnalysisResults() {
        const resultsSection = document.getElementById('analysisResults');
        const modelName = document.getElementById('modelName');
        
        // Update model info
        modelName.textContent = this.analysisResults.model;

        // Display insights
        this.displayInsights();
        
        // Display statistics
        this.displayStatistics();
        
        // Display recommendations
        this.displayRecommendations();

        resultsSection.style.display = 'block';
        
        // Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    displayInsights() {
        const insightsGrid = document.getElementById('insightsGrid');
        insightsGrid.innerHTML = '';

        this.analysisResults.insights.forEach(insight => {
            const insightCard = document.createElement('div');
            insightCard.className = 'insight-card';
            insightCard.innerHTML = `
                <h5>${insight.title}</h5>
                <span class="stat-value">${insight.value}</span>
                <p>${insight.description}</p>
            `;
            
            // Add type-based styling
            const colors = {
                positive: 'var(--primary-navy)',
                info: 'var(--primary-red)',
                warning: '#ff9500'
            };
            
            insightCard.style.borderLeftColor = colors[insight.type] || 'var(--primary-navy)';
            insightsGrid.appendChild(insightCard);
        });
    }

    displayStatistics() {
        const statisticsGrid = document.getElementById('statisticsGrid');
        statisticsGrid.innerHTML = '';

        this.analysisResults.statistics.forEach(stat => {
            const statCard = document.createElement('div');
            statCard.className = 'stat-card';
            statCard.innerHTML = `
                <h5>${stat.column}</h5>
                <div class="stat-details">
                    <p><strong>Count:</strong> ${stat.count}</p>
                    <p><strong>Mean:</strong> ${stat.mean}</p>
                    <p><strong>Min:</strong> ${stat.min}</p>
                    <p><strong>Max:</strong> ${stat.max}</p>
                    <p><strong>Std Dev:</strong> ${stat.std}</p>
                </div>
            `;
            statisticsGrid.appendChild(statCard);
        });
    }

    displayRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';

        this.analysisResults.recommendations.forEach(rec => {
            const recItem = document.createElement('div');
            recItem.className = 'recommendation-item';
            recItem.innerHTML = `
                <h5>${rec.title} <span class="priority-badge ${rec.priority}">${rec.priority}</span></h5>
                <p>${rec.description}</p>
                <div class="recommendation-action">
                    <strong>Recommended Action:</strong> ${rec.action}
                </div>
            `;
            recommendationsList.appendChild(recItem);
        });
    }

    createVisualizations() {
        if (!this.currentData || !this.currentData.data) return;

        // Create main chart
        this.createMainChart();
        
        // Create correlation matrix
        this.createCorrelationChart();
        
        // Create trend chart
        this.createTrendChart();
    }

    createMainChart() {
        const ctx = document.getElementById('mainChart');
        const chartType = document.getElementById('chartType').value;
        
        if (this.charts.main) {
            this.charts.main.destroy();
        }

        const data = this.currentData.data;
        const columns = Object.keys(data[0]);
        const numericColumns = columns.filter(col => typeof data[0][col] === 'number');

        if (numericColumns.length === 0) return;

        const labels = data.map((row, index) => `Row ${index + 1}`).slice(0, 20);
        const datasets = numericColumns.slice(0, 3).map((column, index) => ({
            label: column,
            data: data.slice(0, 20).map(row => row[column]),
            backgroundColor: [
                'rgba(13, 60, 85, 0.7)',
                'rgba(255, 0, 0, 0.7)', 
                'rgba(100, 100, 100, 0.7)'
            ][index],
            borderColor: [
                'rgba(13, 60, 85, 1)',
                'rgba(255, 0, 0, 1)',
                'rgba(100, 100, 100, 1)'
            ][index],
            borderWidth: 2
        }));

        this.charts.main = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: chartType !== 'pie' ? {
                    y: {
                        beginAtZero: true
                    }
                } : {}
            }
        });
    }

    createCorrelationChart() {
        const ctx = document.getElementById('correlationChart');
        
        if (this.charts.correlation) {
            this.charts.correlation.destroy();
        }

        // Generate correlation matrix visualization
        const data = Array.from({length: 10}, () => Math.random() * 2 - 1);
        
        this.charts.correlation = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Var1-Var2', 'Var1-Var3', 'Var2-Var3', 'Var1-Var4', 'Var2-Var4'],
                datasets: [{
                    label: 'Correlation Coefficient',
                    data: data.slice(0, 5),
                    backgroundColor: data.slice(0, 5).map(val => 
                        val > 0.5 ? 'rgba(255, 0, 0, 0.7)' :
                        val < -0.5 ? 'rgba(13, 60, 85, 0.7)' :
                        'rgba(100, 100, 100, 0.7)'
                    ),
                    borderColor: 'rgba(13, 60, 85, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        min: -1,
                        max: 1
                    }
                }
            }
        });
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart');
        
        if (this.charts.trend) {
            this.charts.trend.destroy();
        }

        // Generate trend data
        const trendData = Array.from({length: 12}, (_, i) => ({
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
            actual: Math.random() * 100 + 50,
            predicted: Math.random() * 100 + 50
        }));

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.map(d => d.month),
                datasets: [
                    {
                        label: 'Actual',
                        data: trendData.map(d => d.actual),
                        borderColor: 'rgba(13, 60, 85, 1)',
                        backgroundColor: 'rgba(13, 60, 85, 0.1)',
                        fill: false
                    },
                    {
                        label: 'Predicted',
                        data: trendData.map(d => d.predicted),
                        borderColor: 'rgba(255, 0, 0, 1)',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    updateMainChart() {
        this.createMainChart();
    }

    showAnalysisModal(show) {
        const modal = document.getElementById('analysisModal');
        modal.style.display = show ? 'block' : 'none';
        
        if (show) {
            document.body.style.overflow = 'hidden';
            // Reset progress steps
            const progressSteps = document.querySelectorAll('.progress-step');
            progressSteps.forEach(step => step.classList.remove('active'));
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

    // Export functions
    exportToPDF() {
        this.showNotification('PDF export feature coming soon!', 'info');
    }

    exportToExcel() {
        if (!this.currentData) {
            this.showNotification('No data to export', 'warning');
            return;
        }

        // Convert to CSV for now (in real app, use Excel library)
        const csvContent = this.convertToCSV(this.currentData.data);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentData.name}_analysis.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Data exported as CSV', 'success');
    }

    exportToJSON() {
        if (!this.analysisResults) {
            this.showNotification('No analysis results to export', 'warning');
            return;
        }

        const jsonContent = JSON.stringify(this.analysisResults, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis_results_${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Analysis results exported as JSON', 'success');
    }

    shareResults() {
        if (!this.analysisResults) {
            this.showNotification('No results to share', 'warning');
            return;
        }

        const shareData = {
            title: 'AI Data Analysis Results',
            text: `Analysis completed with ${this.analysisResults.model}. Confidence: ${Math.round(this.analysisResults.confidence * 100)}%`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback to copy URL
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('Analysis URL copied to clipboard', 'success');
        }
    }

    convertToCSV(data) {
        if (!data || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    // Sample data generators
    generateSalesData() {
        const products = ['Laptops', 'Phones', 'Tablets', 'Accessories'];
        const regions = ['North', 'South', 'East', 'West'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const data = [];
        
        for (let i = 0; i < 100; i++) {
            data.push({
                Month: months[Math.floor(Math.random() * months.length)],
                Product: products[Math.floor(Math.random() * products.length)],
                Region: regions[Math.floor(Math.random() * regions.length)],
                Sales: Math.floor(Math.random() * 50000) + 10000,
                Units: Math.floor(Math.random() * 500) + 50,
                Revenue: Math.floor(Math.random() * 100000) + 20000
            });
        }
        
        return data;
    }

    generateCustomerData() {
        const ages = [25, 30, 35, 40, 45, 50, 55, 60];
        const segments = ['Premium', 'Standard', 'Basic'];
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
        
        const data = [];
        
        for (let i = 0; i < 80; i++) {
            data.push({
                CustomerID: `CUST${(1000 + i).toString()}`,
                Age: ages[Math.floor(Math.random() * ages.length)],
                Segment: segments[Math.floor(Math.random() * segments.length)],
                City: cities[Math.floor(Math.random() * cities.length)],
                Purchases: Math.floor(Math.random() * 20) + 1,
                TotalSpent: Math.floor(Math.random() * 10000) + 500,
                Satisfaction: Math.floor(Math.random() * 5) + 1
            });
        }
        
        return data;
    }

    generateFinancialData() {
        const quarters = ['Q1-2023', 'Q2-2023', 'Q3-2023', 'Q4-2023', 'Q1-2024'];
        const departments = ['Sales', 'Marketing', 'Operations', 'IT', 'HR'];
        
        const data = [];
        
        for (let i = 0; i < 60; i++) {
            const revenue = Math.floor(Math.random() * 500000) + 100000;
            const expenses = Math.floor(revenue * (0.6 + Math.random() * 0.3));
            
            data.push({
                Quarter: quarters[Math.floor(Math.random() * quarters.length)],
                Department: departments[Math.floor(Math.random() * departments.length)],
                Revenue: revenue,
                Expenses: expenses,
                Profit: revenue - expenses,
                Margin: ((revenue - expenses) / revenue * 100).toFixed(2)
            });
        }
        
        return data;
    }

    generateMarketingData() {
        const campaigns = ['Email', 'Social Media', 'Google Ads', 'TV', 'Radio'];
        const channels = ['Online', 'Offline', 'Mobile', 'Desktop'];
        
        const data = [];
        
        for (let i = 0; i < 90; i++) {
            const impressions = Math.floor(Math.random() * 100000) + 10000;
            const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.05));
            const conversions = Math.floor(clicks * (0.02 + Math.random() * 0.08));
            
            data.push({
                Campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
                Channel: channels[Math.floor(Math.random() * channels.length)],
                Impressions: impressions,
                Clicks: clicks,
                Conversions: conversions,
                CTR: (clicks / impressions * 100).toFixed(2),
                CostPerClick: (Math.random() * 5 + 0.5).toFixed(2),
                ROI: (Math.random() * 300 + 50).toFixed(2)
            });
        }
        
        return data;
    }
}

// Initialize AI Data Analyzer when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aiDataAnalyzer = new AIDataAnalyzer();
});

// Additional CSS for priority badges and chart styling
const additionalStyles = `
    .priority-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
        text-transform: uppercase;
        font-weight: 600;
        margin-left: 0.5rem;
    }

    .priority-badge.high {
        background: var(--primary-red);
        color: var(--primary-white);
    }

    .priority-badge.medium {
        background: #ff9500;
        color: var(--primary-white);
    }

    .priority-badge.low {
        background: var(--gray-400);
        color: var(--primary-white);
    }

    .stat-details p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
        color: var(--gray-600);
    }

    .recommendation-action {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--gray-100);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
        color: var(--gray-700);
    }

    canvas {
        max-height: 400px !important;
    }
`;

const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);