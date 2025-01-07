/**
 * Sistema de logging para monitoramento de performance, interações do usuário e chamadas de API
 */
class Logger {
    constructor() {
        this.logs = {
            performance: [],
            userInteraction: [],
            apiCalls: []
        };
        this.startTime = performance.now();
        this.maxLogsPerType = 1000;
        this.setupStorageCleanup();
    }

    /**
     * Configuração da limpeza automática do storage
     */
    setupStorageCleanup() {
        // Limpar logs antigos a cada hora
        setInterval(() => this.cleanOldLogs(), 3600000);
    }

    /**
     * Log de performance
     * @param {string} action - Ação sendo monitorada
     * @param {number|object} duration - Duração ou dados da performance
     */
    logPerformance(action, duration) {
        const log = {
            timestamp: new Date().toISOString(),
            action,
            duration: typeof duration === 'number' ? duration : JSON.stringify(duration),
            memory: this.getMemoryUsage(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        this.logs.performance.push(log);
        this.saveLog('performance', log);
    }

    /**
     * Log de interação do usuário
     * @param {string} action - Tipo de interação
     * @param {object} details - Detalhes da interação
     */
    logUserInteraction(action, details) {
        const log = {
            timestamp: new Date().toISOString(),
            action,
            details,
            sessionId: this.getSessionId(),
            userAgent: navigator.userAgent,
            path: window.location.pathname
        };

        this.logs.userInteraction.push(log);
        this.saveLog('user-interaction', log);
    }

    /**
     * Log de chamadas API
     * @param {string} endpoint - Endpoint da API
     * @param {string} method - Método HTTP
     * @param {number} duration - Duração da chamada
     * @param {number|string} status - Status da resposta
     * @param {string|null} error - Erro, se houver
     */
    logApiCall(endpoint, method, duration, status, error = null) {
        const log = {
            timestamp: new Date().toISOString(),
            endpoint,
            method,
            duration,
            status,
            error,
            sessionId: this.getSessionId()
        };

        this.logs.apiCalls.push(log);
        this.saveLog('api-calls', log);
    }

    /**
     * Salvar log no storage
     * @param {string} type - Tipo do log
     * @param {object} log - Dados do log
     */
    saveLog(type, log) {
        const key = `log_${type}_${Date.now()}`;
        try {
            localStorage.setItem(key, JSON.stringify(log));
        } catch (error) {
            console.warn('Error saving log:', error);
            this.cleanOldLogs(); // Tentar liberar espaço
        }
    }

    /**
     * Limpar logs antigos
     */
    cleanOldLogs() {
        const keys = Object.keys(localStorage);
        const logKeys = keys.filter(key => key.startsWith('log_'));

        if (logKeys.length > this.maxLogsPerType * 3) {
            logKeys
                .sort()
                .slice(0, logKeys.length - this.maxLogsPerType * 3)
                .forEach(key => localStorage.removeItem(key));
        }
    }

    /**
     * Gerar relatório completo
     */
    generateReport() {
        return {
            performance: this.analyzePerformance(),
            userInteraction: this.analyzeUserInteraction(),
            apiCalls: this.analyzeApiCalls(),
            summary: this.generateSummary()
        };
    }

    /**
     * Analisar métricas de performance
     */
    analyzePerformance() {
        const performanceLogs = this.logs.performance;
        return {
            averageLoadTime: this.calculateAverage(performanceLogs, 'duration'),
            slowestActions: this.findSlowestActions(performanceLogs),
            memoryUsage: this.analyzeMemoryUsage(performanceLogs),
            timeRange: this.getTimeRange(performanceLogs)
        };
    }

    /**
     * Analisar interações do usuário
     */
    analyzeUserInteraction() {
        const interactions = this.logs.userInteraction;
        return {
            totalInteractions: interactions.length,
            actionTypes: this.countByType(interactions, 'action'),
            sessionAnalysis: this.analyzeUserSessions(interactions),
            mostCommonPaths: this.findMostCommonPaths(interactions)
        };
    }

    /**
     * Analisar chamadas de API
     */
    analyzeApiCalls() {
        const apiCalls = this.logs.apiCalls;
        return {
            totalCalls: apiCalls.length,
            averageResponseTime: this.calculateAverage(apiCalls, 'duration'),
            errorRate: this.calculateErrorRate(apiCalls),
            endpointAnalysis: this.analyzeEndpoints(apiCalls)
        };
    }

    /**
     * Utilitários
     */
    getMemoryUsage() {
        return performance.memory ? 
            Math.round(performance.memory.usedJSHeapSize / 1048576) : 
            'N/A';
    }

    getSessionId() {
        if (!sessionStorage.getItem('sessionId')) {
            sessionStorage.setItem('sessionId', 
                Date.now().toString(36) + Math.random().toString(36).substr(2)
            );
        }
        return sessionStorage.getItem('sessionId');
    }

    calculateAverage(array, key) {
        if (!array.length) return 0;
        return array.reduce((acc, curr) => acc + (parseFloat(curr[key]) || 0), 0) / array.length;
    }

    findSlowestActions(logs) {
        return [...logs]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 5);
    }

    countByType(array, key) {
        return array.reduce((acc, curr) => {
            acc[curr[key]] = (acc[curr[key]] || 0) + 1;
            return acc;
        }, {});
    }

    getTimeRange(logs) {
        if (!logs.length) return null;
        const timestamps = logs.map(log => new Date(log.timestamp));
        return {
            start: new Date(Math.min(...timestamps)),
            end: new Date(Math.max(...timestamps))
        };
    }

    generateSummary() {
        return {
            totalLogs: {
                performance: this.logs.performance.length,
                userInteraction: this.logs.userInteraction.length,
                apiCalls: this.logs.apiCalls.length
            },
            startTime: new Date(this.startTime),
            currentTime: new Date(),
            sessionDuration: (performance.now() - this.startTime) / 1000
        };
    }
}

// Exportar instância única
export const logger = new Logger();
