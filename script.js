// Linux Optimization Checker - WebUI Application
class LinuxOptimizer {
    constructor() {
        this.charts = {};
        this.monitoringInterval = null;
        this.isMonitoring = false;
        this.historyData = [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.setupCharts();
        this.loadHistory();
        this.updateSystemStats();
        
        // Update stats every 5 seconds
        setInterval(() => this.updateSystemStats(), 5000);
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.nav-item').dataset.tab);
            });
        });

        // Quick actions
        document.getElementById('runInstallBtn').addEventListener('click', () => {
            this.runScript('install');
        });

        document.getElementById('runCheckBtn').addEventListener('click', () => {
            this.runScript('check');
        });

        document.getElementById('refreshStatsBtn').addEventListener('click', () => {
            this.updateSystemStats(true);
        });

        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.exportReport();
        });

        // Install tab actions
        document.getElementById('installAllBtn').addEventListener('click', () => {
            this.runScript('install');
        });

        document.getElementById('checkStatusBtn').addEventListener('click', () => {
            this.checkToolStatus();
        });

        // Check tab actions
        document.getElementById('runCheckBtn2').addEventListener('click', () => {
            this.runScript('check');
        });

        document.getElementById('generateReportBtn').addEventListener('click', () => {
            this.generateDetailedReport();
        });

        // Monitoring actions
        document.getElementById('startMonitoringBtn').addEventListener('click', () => {
            this.startMonitoring();
        });

        document.getElementById('stopMonitoringBtn').addEventListener('click', () => {
            this.stopMonitoring();
        });

        document.getElementById('clearChartsBtn').addEventListener('click', () => {
            this.clearCharts();
        });

        // Recommendations actions
        document.getElementById('applyAllBtn').addEventListener('click', () => {
            this.applyAllRecommendations();
        });

        document.getElementById('refreshRecommendationsBtn').addEventListener('click', () => {
            this.generateRecommendations();
        });

        // History actions
        document.getElementById('historyTimeRange').addEventListener('change', () => {
            this.updateHistoryCharts();
        });

        document.getElementById('exportHistoryBtn').addEventListener('click', () => {
            this.exportHistoryData();
        });

        // Modal actions
        document.getElementById('terminalCloseBtn').addEventListener('click', () => {
            this.closeModal('terminalModal');
        });

        document.getElementById('progressCloseBtn').addEventListener('click', () => {
            this.closeModal('progressModal');
        });

        // Terminal input
        document.getElementById('terminalInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeTerminalCommand(e.target.value);
                e.target.value = '';
            }
        });

        document.getElementById('copyOutputBtn').addEventListener('click', () => {
            this.copyTerminalOutput();
        });

        document.getElementById('clearTerminalBtn').addEventListener('click', () => {
            this.clearTerminalOutput();
        });
    }

    setupCharts() {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: '#e2e8f0' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#e2e8f0'
                }
            }
        };

        // CPU Chart
        this.charts.cpu = new Chart(document.getElementById('cpuChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'CPU Usage',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartOptions
        });

        // Memory Chart
        this.charts.memory = new Chart(document.getElementById('memoryChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Memory Usage',
                    data: [],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartOptions
        });

        // Disk Chart
        this.charts.disk = new Chart(document.getElementById('diskChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Disk I/O',
                    data: [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: { ...chartOptions.scales.y, max: undefined }
                }
            }
        });

        // Network Chart
        this.charts.network = new Chart(document.getElementById('networkChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Network I/O',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: { ...chartOptions.scales.y, max: undefined }
                }
            }
        });

        // History Charts
        this.charts.historyCpu = new Chart(document.getElementById('historyCpuChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Average CPU Usage',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartOptions
        });

        this.charts.historyMemory = new Chart(document.getElementById('historyMemoryChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Average Memory Usage',
                    data: [],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartOptions
        });
    }

    async updateSystemStats(force = false) {
        try {
            // Simulate system stats for demo purposes
            // In a real implementation, these would call actual system commands
            const stats = await this.getSystemStats();
            
            // Update dashboard stats
            document.getElementById('cpuUsage').textContent = `${stats.cpu}%`;
            document.getElementById('memoryUsage').textContent = `${stats.memory}%`;
            document.getElementById('diskUsage').textContent = `${stats.disk}%`;
            document.getElementById('temperature').textContent = `${stats.temp}°C`;
            
            // Update health score
            const healthScore = this.calculateHealthScore(stats);
            this.updateHealthScore(healthScore);
            
            // Update charts if monitoring
            if (this.isMonitoring) {
                this.updateCharts(stats);
            }
            
            // Update tool status
            if (force) {
                this.checkToolStatus();
            }
            
        } catch (error) {
            console.error('Error updating system stats:', error);
        }
    }

    async getSystemStats() {
        // Simulate system stats - in real implementation, these would be actual system calls
        return {
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100),
            disk: Math.floor(Math.random() * 100),
            temp: Math.floor(Math.random() * 50) + 30,
            load: (Math.random() * 4).toFixed(2),
            swap: Math.floor(Math.random() * 50)
        };
    }

    calculateHealthScore(stats) {
        let score = 100;
        
        // Deduct points based on resource usage
        if (stats.cpu > 80) score -= 20;
        else if (stats.cpu > 60) score -= 10;
        
        if (stats.memory > 80) score -= 20;
        else if (stats.memory > 60) score -= 10;
        
        if (stats.disk > 90) score -= 30;
        else if (stats.disk > 70) score -= 15;
        
        if (stats.temp > 70) score -= 20;
        else if (stats.temp > 50) score -= 10;
        
        return Math.max(0, Math.min(100, score));
    }

    updateHealthScore(score) {
        const circle = document.getElementById('healthCircle');
        const percentage = document.getElementById('healthScore');
        const status = document.getElementById('healthStatus');
        
        percentage.textContent = `${score}%`;
        
        // Update circular progress
        const radius = 15.9155;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
        
        // Update status text and color
        if (score >= 80) {
            status.textContent = "Excellent";
            status.className = "text-success";
        } else if (score >= 60) {
            status.textContent = "Good";
            status.className = "text-warning";
        } else {
            status.textContent = "Needs Attention";
            status.className = "text-danger";
        }
    }

    updateCharts(stats) {
        const now = new Date().toLocaleTimeString();
        
        // Update CPU chart
        this.updateChart(this.charts.cpu, now, stats.cpu, 'cpuChartValue');
        
        // Update Memory chart
        this.updateChart(this.charts.memory, now, stats.memory, 'memoryChartValue');
        
        // Update Disk chart (simulated I/O)
        const diskIO = Math.random() * 100;
        this.updateChart(this.charts.disk, now, diskIO, 'diskChartValue', 'MB/s');
        
        // Update Network chart (simulated I/O)
        const networkIO = Math.random() * 50;
        this.updateChart(this.charts.network, now, networkIO, 'networkChartValue', 'KB/s');
    }

    updateChart(chart, label, value, valueElementId, unit = '%') {
        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(value);
        
        // Keep only last 20 data points
        if (chart.data.labels.length > 20) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update('none');
        
        // Update current value display
        if (valueElementId) {
            document.getElementById(valueElementId).textContent = `${value.toFixed(1)}${unit}`;
        }
    }

    startMonitoring() {
        if (!this.isMonitoring) {
            this.isMonitoring = true;
            this.monitoringInterval = setInterval(() => {
                this.updateSystemStats();
            }, 1000);
            
            document.getElementById('startMonitoringBtn').disabled = true;
            document.getElementById('stopMonitoringBtn').disabled = false;
        }
    }

    stopMonitoring() {
        if (this.isMonitoring) {
            this.isMonitoring = false;
            clearInterval(this.monitoringInterval);
            
            document.getElementById('startMonitoringBtn').disabled = false;
            document.getElementById('stopMonitoringBtn').disabled = true;
        }
    }

    clearCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
            chart.update();
        });
    }

    async runScript(scriptType) {
        this.showProgressModal(scriptType === 'install' ? 'Installing Tools' : 'Running System Check');
        
        try {
            // Simulate script execution
            await this.simulateScriptExecution(scriptType);
            
            this.hideProgressModal();
            this.showTerminalModal();
            
            if (scriptType === 'install') {
                this.addActivity('Tools Installation', 'Completed');
                this.checkToolStatus();
            } else {
                this.addActivity('System Check', 'Completed');
                this.updateCheckResults();
                this.generateRecommendations();
            }
            
        } catch (error) {
            this.hideProgressModal();
            this.showError('Script execution failed');
        }
    }

    async simulateScriptExecution(scriptType) {
        const steps = scriptType === 'install' 
            ? ['Updating package list...', 'Installing htop...', 'Installing iotop...', 'Installing sysstat...', 'Installing powertop...', 'Installing lm-sensors...', 'Installing TLP...', 'Enabling services...', 'Detecting sensors...']
            : ['Analyzing CPU performance...', 'Checking memory usage...', 'Evaluating disk performance...', 'Monitoring temperature...', 'Reviewing system configuration...', 'Generating recommendations...'];
        
        for (let i = 0; i < steps.length; i++) {
            this.updateProgress((i + 1) / steps.length * 100, steps[i]);
            await this.sleep(500);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showProgressModal(title) {
        document.getElementById('progressTitle').textContent = title;
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressPercentage').textContent = '0%';
        document.getElementById('progressSteps').innerHTML = '';
        document.getElementById('progressModal').classList.add('active');
    }

    hideProgressModal() {
        document.getElementById('progressModal').classList.remove('active');
    }

    updateProgress(percentage, currentStep) {
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressPercentage').textContent = `${Math.round(percentage)}%`;
        
        const stepsContainer = document.getElementById('progressSteps');
        const stepElement = document.createElement('div');
        stepElement.className = 'progress-step active';
        stepElement.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>${currentStep}</span>
        `;
        stepsContainer.appendChild(stepElement);
        
        // Mark previous step as completed
        const steps = stepsContainer.querySelectorAll('.progress-step');
        if (steps.length > 1) {
            steps[steps.length - 2].classList.remove('active');
            steps[steps.length - 2].classList.add('completed');
        }
    }

    showTerminalModal() {
        document.getElementById('terminalModal').classList.add('active');
        this.addToTerminal('Script execution completed successfully.');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    addToTerminal(message) {
        const output = document.getElementById('terminalOutput');
        output.innerHTML += `<div>$ ${message}</div>`;
        output.scrollTop = output.scrollHeight;
    }

    copyTerminalOutput() {
        const output = document.getElementById('terminalOutput').innerText;
        navigator.clipboard.writeText(output);
        this.showToast('Output copied to clipboard');
    }

    clearTerminalOutput() {
        document.getElementById('terminalOutput').innerHTML = '';
    }

    async checkToolStatus() {
        // Simulate tool status check
        const tools = ['htop', 'iotop', 'sysstat', 'powertop', 'lm-sensors', 'tlp'];
        
        for (const tool of tools) {
            const statusElement = document.getElementById(`${tool.replace('-', '')}Status`);
            // Simulate random installation status
            const isInstalled = Math.random() > 0.3;
            
            if (isInstalled) {
                statusElement.textContent = 'Installed ✓';
                statusElement.className = 'tool-status text-success';
            } else {
                statusElement.textContent = 'Not installed';
                statusElement.className = 'tool-status';
            }
        }
    }

    updateCheckResults() {
        // Update check card statuses and metrics
        const checkCards = ['cpu', 'memory', 'disk', 'temp'];
        
        checkCards.forEach(card => {
            const status = document.getElementById(`${card}CheckStatus`);
            status.textContent = 'Completed';
            status.className = 'check-status text-success';
        });
        
        // Update metric values
        document.getElementById('cpuCurrent').textContent = `${Math.floor(Math.random() * 100)}%`;
        document.getElementById('cpuLoad').textContent = `${(Math.random() * 4).toFixed(2)}`;
        document.getElementById('memoryCurrent').textContent = `${Math.floor(Math.random() * 100)}%`;
        document.getElementById('swapUsage').textContent = `${Math.floor(Math.random() * 50)}%`;
        document.getElementById('diskCurrent').textContent = `${Math.floor(Math.random() * 100)}%`;
        document.getElementById('diskIO').textContent = `${(Math.random() * 100).toFixed(1)} MB/s`;
        document.getElementById('cpuTemp').textContent = `${Math.floor(Math.random() * 50) + 30}°C`;
        document.getElementById('fanSpeeds').textContent = '1200-2400 RPM';
    }

    generateRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        
        const recommendations = [
            {
                title: 'Optimize CPU Usage',
                description: 'Close unnecessary applications and consider upgrading your CPU if frequently at 80%+ usage',
                priority: 'high'
            },
            {
                title: 'Memory Management',
                description: 'Enable swap file and close memory-intensive applications',
                priority: 'medium'
            },
            {
                title: 'Disk Cleanup',
                description: 'Remove temporary files and consider upgrading to SSD for better performance',
                priority: 'medium'
            },
            {
                title: 'Temperature Control',
                description: 'Clean dust from fans and ensure proper ventilation',
                priority: 'high'
            },
            {
                title: 'System Updates',
                description: 'Keep your system and drivers up to date for optimal performance',
                priority: 'low'
            }
        ];
        
        recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <div class="recommendation-content">
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-desc">${rec.description}</div>
                </div>
                <div class="recommendation-actions">
                    <button class="btn-secondary">Apply</button>
                    <button class="btn-primary">Details</button>
                </div>
            `;
            recommendationsList.appendChild(item);
        });
    }

    applyAllRecommendations() {
        this.showToast('Applying all recommendations...');
        // Simulate applying recommendations
        setTimeout(() => {
            this.showToast('All recommendations applied successfully!');
        }, 2000);
    }

    addActivity(title, status) {
        const activityList = document.getElementById('activityList');
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <i class="fas fa-circle activity-dot completed"></i>
            <div class="activity-content">
                <span class="activity-title">${title}</span>
                <span class="activity-time">${new Date().toLocaleString()}</span>
            </div>
        `;
        activityList.insertBefore(item, activityList.firstChild);
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabName) {
                item.classList.add('active');
            }
        });
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-content`) {
                content.classList.add('active');
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const icon = document.querySelector('#themeToggle i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            systemStats: {
                cpu: document.getElementById('cpuUsage').textContent,
                memory: document.getElementById('memoryUsage').textContent,
                disk: document.getElementById('diskUsage').textContent,
                temperature: document.getElementById('temperature').textContent
            },
            healthScore: document.getElementById('healthScore').textContent,
            recommendations: Array.from(document.querySelectorAll('.recommendation-title')).map(el => el.textContent)
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `linux-optimizer-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateDetailedReport() {
        this.addToTerminal('Generating detailed system analysis report...');
        setTimeout(() => {
            this.addToTerminal('Report generated successfully. Check the downloads folder.');
        }, 2000);
    }

    loadHistory() {
        // Load from localStorage or initialize empty
        this.historyData = JSON.parse(localStorage.getItem('optimizerHistory') || '[]');
        this.updateHistoryTable();
    }

    updateHistoryTable() {
        const tbody = document.querySelector('#historyTable tbody');
        tbody.innerHTML = '';
        
        this.historyData.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td>${entry.script}</td>
                <td>${entry.status}</td>
                <td>${entry.healthScore}%</td>
                <td>
                    <button class="btn-secondary">View</button>
                    <button class="btn-primary">Export</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateHistoryCharts() {
        const timeRange = document.getElementById('historyTimeRange').value;
        // Filter data based on time range and update charts
        // This is a simplified implementation
        this.charts.historyCpu.data.labels = ['1h ago', '45m ago', '30m ago', '15m ago', 'Now'];
        this.charts.historyCpu.data.datasets[0].data = [60, 65, 70, 75, 80];
        this.charts.historyCpu.update();
        
        this.charts.historyMemory.data.labels = ['1h ago', '45m ago', '30m ago', '15m ago', 'Now'];
        this.charts.historyMemory.data.datasets[0].data = [40, 45, 50, 55, 60];
        this.charts.historyMemory.update();
    }

    exportHistoryData() {
        const blob = new Blob([JSON.stringify(this.historyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `linux-optimizer-history-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    executeTerminalCommand(command) {
        this.addToTerminal(`$ ${command}`);
        
        // Simulate command execution
        if (command.includes('ls')) {
            this.addToTerminal('systemcheck.sh  systeminstall.sh  index.html  styles.css  script.js');
        } else if (command.includes('pwd')) {
            this.addToTerminal('/home/user/Linux-Optimizisation-checker');
        } else if (command.includes('date')) {
            this.addToTerminal(new Date().toString());
        } else {
            this.addToTerminal(`Command not found: ${command}`);
        }
    }

    showToast(message) {
        // Create and show toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.addToTerminal(`Error: ${message}`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LinuxOptimizer();
});
