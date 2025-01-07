import { logger } from './logger.js';
import { Analytics } from './analytics.js';

/**
 * Classe principal do ComparAqui
 */
class ComparAqui {
    constructor() {
        // Configurações iniciais
        this.API_URL = 'https://script.google.com/macros/s/AKfycbxMZxHhUDsNtZiJ_OEV0HilnNqQUcd0Ki9r4po3vYfdvXCWa1QgyPge_mMrPkRCTV5D/exec';
        this.ITEMS_PER_PAGE = 12;
        this.currentPage = 1;
        this.totalPages = 1;
        this.lastQuery = '';
        this.isLoading = false;

        // Inicializar analytics
        this.analytics = new Analytics();

        // Inicializar a aplicação
        this.init();
    }

    /**
     * Inicialização da aplicação
     */
    init() {
        this.setupEventListeners();
        this.setupDebugPanel();
        this.handleResponsiveLayout();
        
        // Registrar tempo de inicialização
        logger.logPerformance('app_init', performance.now());
    }

    /**
     * Configurar listeners de eventos
     */
    setupEventListeners() {
        // Listener para busca
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        if (searchInput && searchButton) {
            // Busca ao pressionar Enter
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !this.isLoading) {
                    this.searchProducts(1);
                }
            });

            // Busca ao clicar no botão
            searchButton.addEventListener('click', () => {
                if (!this.isLoading) {
                    this.searchProducts(1);
                }
            });

            // Autocompletar após digitar
            searchInput.addEventListener('input', this.debounce(() => {
                const query = searchInput.value.trim();
                if (query.length >= 3) {
                    this.fetchSuggestions(query);
                }
            }, 300));
        }

        // Listener para redimensionamento
        window.addEventListener('resize', this.debounce(() => {
            this.handleResponsiveLayout();
        }, 250));
    }

    /**
     * Buscar produtos
     * @param {number} page - Número da página
     */
    async searchProducts(page = 1) {
        const searchInput = document.getElementById('searchInput');
        const resultsDiv = document.getElementById('results');
        const loadingDiv = document.getElementById('loading');
        const paginationDiv = document.getElementById('pagination');

        const query = searchInput.value.trim();

        if (!query) {
            this.showNotification('Por favor, digite algo para buscar', 'warning');
            return;
        }

        // Registrar início da busca
        const searchStartTime = performance.now();
        this.isLoading = true;
        this.lastQuery = query;
        this.currentPage = page;

        try {
            loadingDiv.classList.remove('hidden');
            const products = await this.fetchProducts(query, page);
            
            // Registrar tempo de busca
            const searchDuration = performance.now() - searchStartTime;
            logger.logPerformance('product_search', searchDuration);
            
            this.displayResults(products);
            this.updatePagination();
            paginationDiv.classList.remove('hidden');

        } catch (error) {
            logger.logApiCall('/search', 'GET', performance.now() - searchStartTime, 'error', error.message);
            this.showNotification(error.message || 'Erro ao buscar produtos', 'error');
            resultsDiv.innerHTML = '';
        } finally {
            loadingDiv.classList.add('hidden');
            this.isLoading = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    /**
     * Buscar produtos na API
     * @param {string} query - Termo de busca
     * @param {number} page - Número da página
     */
    async fetchProducts(query, page) {
        const startTime = performance.now();
        try {
            const response = await fetch(
                `${this.API_URL}?query=${encodeURIComponent(query)}&page=${page}&limit=${this.ITEMS_PER_PAGE}`
            );

            if (!response.ok) {
                throw new Error('Falha ao buscar produtos');
            }

            const data = await response.json();
            
            // Registrar chamada da API
            logger.logApiCall('/search', 'GET', performance.now() - startTime, response.status);
            
            return data;

        } catch (error) {
            logger.logApiCall('/search', 'GET', performance.now() - startTime, 'error', error.message);
            throw new Error('Erro ao conectar com o servidor');
        }
    }

    /**
     * Buscar sugestões de busca
     * @param {string} query - Termo para sugestões
     */
    async fetchSuggestions(query) {
        try {
            const response = await fetch(`${this.API_URL}/suggestions?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            this.displaySuggestions(data.suggestions);
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
        }
    }

    /**
     * Exibir resultados
     * @param {Array} products - Lista de produtos
     */
    displayResults(products) {
        const resultsDiv = document.getElementById('results');

        if (!products || !products.length) {
            resultsDiv.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">Nenhum produto encontrado</p>
                </div>
            `;
            return;
        }

        resultsDiv.innerHTML = products.map((product, index) => `
            <div class="glassmorphism p-4 rounded-xl fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="relative group">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}"
                        class="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                        onerror="this.src='https://via.placeholder.com/300x200'"
                    >
                    ${product.discount ? `
                        <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                            -${product.discount}%
                        </div>
                    ` : ''}
                </div>
                <h3 class="font-semibold text-lg mt-4 mb-2 line-clamp-2">${product.name}</h3>
                <div class="flex justify-between items-end mb-4">
                    <div>
                        <p class="text-xs text-gray-500">Menor preço</p>
                        <p class="text-2xl font-bold text-green-600">R$ ${product.price.toFixed(2)}</p>
                        ${product.originalPrice ? `
                            <p class="text-sm text-gray-400 line-through">
                                R$ ${product.originalPrice.toFixed(2)}
                            </p>
                        ` : ''}
                    </div>
                    <div class="text-right">
                        <img src="${product.storeLogo}" alt="${product.store}" class="h-6">
                    </div>
                </div>
                <a 
                    href="${product.url}" 
                    target="_blank"
                    class="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
                >
                    Ver Oferta
                </a>
            </div>
        `).join('');
    }

    /**
     * Atualizar paginação
     */
    updatePagination() {
        const paginationDiv = document.getElementById('pagination');
        let paginationHTML = '';

        // Botão anterior
        paginationHTML += `
            <button 
                onclick="window.comparAqui.searchProducts(${this.currentPage - 1})"
                class="px-4 py-2 rounded-lg ${this.currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}"
                ${this.currentPage === 1 ? 'disabled' : ''}
            >
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Números das páginas
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button 
                        onclick="window.comparAqui.searchProducts(${i})"
                        class="px-4 py-2 rounded-lg ${this.currentPage === i ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}"
                    >
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="px-4 py-2">...</span>`;
            }
        }

        // Botão próximo
        paginationHTML += `
            <button 
                onclick="window.comparAqui.searchProducts(${this.currentPage + 1})"
                class="px-4 py-2 rounded-lg ${this.currentPage === this.totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}"
                ${this.currentPage === this.totalPages ? 'disabled' : ''}
            >
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationDiv.innerHTML = paginationHTML;
    }

    /**
     * Exibir notificações
     * @param {string} message - Mensagem
     * @param {string} type - Tipo de notificação
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} fade-in`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Configurar painel de debug
     */
    setupDebugPanel() {
        if (process.env.NODE_ENV === 'development') {
            const debugPanel = document.getElementById('debug-panel');
            if (debugPanel) {
                debugPanel.classList.remove('hidden');
                
                // Gerar relatório a cada minuto
                setInterval(() => {
                    const report = this.analytics.generateReport();
                    console.log('Performance Report:', report);
                }, 60000);
            }
        }
    }

    /**
     * Gerenciar layout responsivo
     */
    handleResponsiveLayout() {
        const width = window.innerWidth;
        document.body.classList.toggle('mobile', width < 768);
        logger.logPerformance('responsive_layout', { width, height: window.innerHeight });
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
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.comparAqui = new ComparAqui();
});
