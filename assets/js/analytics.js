import { logger } from './logger.js';

/**
 * Classe responsável por monitorar e analisar interações do usuário e performance
 */
export class Analytics {
    constructor() {
        this.setupEventListeners();
        this.setupPerformanceMonitoring();
        this.lastInteraction = Date.now();
        this.interactionBuffer = [];
        this.processInterval = 1000; // 1 segundo
        this.startPeriodicProcessing();
    }

    /**
     * Configurar listeners de eventos
     */
    setupEventListeners() {
        // Monitorar cliques
        document.addEventListener('click', (e) => this.trackClick(e));
        
        // Monitorar movimento do mouse
        document.addEventListener('mousemove', 
            this.debounce((e) => this.trackMouseMovement(e), 250)
        );
        
        // Monitorar rolagem
        document.addEventListener('scroll', 
            this.debounce((e) => this.trackScroll(e), 250)
        );
        
        // Monitorar entrada de texto
        document.addEventListener('input', (e) => this.trackInput(e));
        
        // Monitorar foco/blur em elementos
        document.addEventListener('focus', (e) => this.trackFocus(e), true);
        document.addEventListener('blur', (e) => this.trackBlur(e), true);
        
        // Monitorar visibilidade da página
        document.addEventListener('visibilitychange', 
            () => this.trackVisibilityChange()
        );
        
        // Monitorar redimensionamento da janela
        window.addEventListener('resize', 
            this.debounce(() => this.trackResize(), 250)
        );
    }

    /**
     * Configurar monitoramento de performance
     */
    setupPerformanceMonitoring() {
        // Observar carregamento de recursos
        if (window.PerformanceObserver) {
            // Monitorar carregamento de recursos
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.trackResourceTiming(entry);
                });
            }).observe({ entryTypes: ['resource'] });

            // Monitorar renderização
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.trackPaintTiming(entry);
                });
            }).observe({ entryTypes: ['paint'] });

            // Monitorar layout shifts
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.trackLayoutShift(entry);
                });
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    /**
     * Iniciar processamento periódico de interações
     */
    startPeriodicProcessing() {
        setInterval(() => {
            this.processInteractionBuffer();
        }, this.processInterval);
    }

    /**
     * Rastreamento de eventos
     */
    trackClick(event) {
        const target = event.target;
        const interactionData = {
            type: 'click',
            element: {
                tag: target.tagName.toLowerCase(),
                id: target.id,
                class: target.className,
                text: target.textContent?.trim().substring(0, 50),
                href: target instanceof HTMLAnchorElement ? target.href : null
            },
            position: {
                x: event.clientX,
                y: event.clientY
            },
            timestamp: Date.now()
        };

        this.addToInteractionBuffer(interactionData);
    }

    trackMouseMovement(event) {
        const interactionData = {
            type: 'mousemove',
            position: {
                x: event.clientX,
                y: event.clientY
            },
            timestamp: Date.now()
        };

        this.addToInteractionBuffer(interactionData);
    }

    trackScroll(event) {
        const interactionData = {
            type: 'scroll',
            position: {
                scrollX: window.scrollX,
                scrollY: window.scrollY
            },
            timestamp: Date.now()
        };

        this.addToInteractionBuffer(interactionData);
    }

    trackInput(event) {
        if (event.target instanceof HTMLInputElement || 
            event.target instanceof HTMLTextAreaElement) {
            const interactionData = {
                type: 'input',
                element: {
                    tag: event.target.tagName.toLowerCase(),
                    id: event.target.id,
                    type: event.target.type
                },
                timestamp: Date.now()
            };

            this.addToInteractionBuffer(interactionData);
        }
    }

    trackFocus(event) {
        const interactionData = {
            type: 'focus',
            element: {
                tag: event.target.tagName.toLowerCase(),
                id: event.target.id,
                class: event.target.className
            },
            timestamp: Date.now()
        };

        this.addToInteractionBuffer(interactionData);
    }

    trackBlur(event) {
        const interactionData = {
            type: 'blur',
            element: {
                tag: event.target.tagName.toLowerCase(),
                id: event.target.id,
                class: event.target.className
            },
            timestamp: Date.now()
        };

        this.addToInteractionBuffer(interactionData);
    }

    trackVisibilityChange() {
        logger.logUserInteraction('visibility_change', {
            state: document.visibilityState,
            timestamp: Date.now()
        });
    }

    trackResize() {
        logger.logPerformance('resize', {
            width: window.innerWidth,
            height: window.innerHeight,
            timestamp: Date.now()
        });
    }

    trackResourceTiming(entry) {
        logger.logPerformance('resource_timing', {
            name: entry.name,
            duration: entry.duration,
            initiatorType: entry.initiatorType,
            timestamp: Date.now()
        });
    }

    trackPaintTiming(entry) {
        logger.logPerformance('paint_timing', {
            name: entry.name,
            duration: entry.duration,
            timestamp: Date.now()
        });
    }

    trackLayoutShift(entry) {
        logger.logPerformance('layout_shift', {
            value: entry.value,
            timestamp: Date.now()
        });
    }

    /**
     * Gerenciamento do buffer de interações
     */
    addToInteractionBuffer(interaction) {
        this.interactionBuffer.push(interaction);
        this.lastInteraction = Date.now();
    }

    processInteractionBuffer() {
        if (this.interactionBuffer.length === 0) return;

        const interactions = [...this.interactionBuffer];
        this.interactionBuffer = [];

        const summary = this.summarizeInteractions(interactions);
        logger.logUserInteraction('interaction_batch', summary);
    }

    summarizeInteractions(interactions) {
        const types = {};
        let totalInteractions = interactions.length;
        
        interactions.forEach(interaction => {
            types[interaction.type] = (types[interaction.type] || 0) + 1;
        });

        return {
            total: totalInteractions,
            types,
            timeRange: {
                start: interactions[0].timestamp,
                end: interactions[interactions.length - 1].timestamp
            }
        };
    }

    /**
     * Utilidades
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * API Pública
     */
    generateReport() {
        return logger.generateReport();
    }
}
