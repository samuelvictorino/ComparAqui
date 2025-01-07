// assets/js/services/magalu-api.js

// Adicionar no arquivo magalu-api.js

class MagaluAPIError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = 'MagaluAPIError';
        this.status = status;
        this.code = code;
    }
}


class MagaluAPI {
    constructor() {
        this.BASE_URL = 'https://api.magalu.com/v1';
        this.API_KEY = '6b4282a5-05ba-42af-afa7-e54547d4d585'; // Substituir pela sua chave
        this.PARTNER_ID = '524cf852-20ee-4281-9513-f816f0f31a71';   // Substituir pelo seu ID de parceiro
    }

    /**
     * Headers padrão para requisições
     */
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`,
            'X-Partner-ID': this.PARTNER_ID
        };
    }

    /**
     * Buscar produtos na API da Magalu
     * @param {string} query - Termo de busca
     * @param {number} page - Número da página
     * @param {number} limit - Itens por página
     */
    async searchProducts(query, page = 1, limit = 12) {
        try {
            const response = await fetch(`${this.BASE_URL}/products/search`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    query,
                    page,
                    per_page: limit,
                    sort: 'relevance',
                    filters: {
                        available: true
                    }
                })
            });

            
// Adicionar no método searchProducts
if (!response.ok) {
    const errorData = await response.json();
    throw new MagaluAPIError(
        errorData.message || 'Erro na API Magalu',
        response.status,
        errorData.code
    );
}

            const data = await response.json();
            return this.formatProducts(data);

        } catch (error) {
            console.error('Erro ao buscar produtos na Magalu:', error);
            throw error;
        }c
    }

    

    /**
     * Formatar produtos para o padrão da aplicação
     * @param {Object} data - Dados retornados pela API da Magalu
     */
    formatProducts(data) {
        const products = data.products.map(product => ({
            id: product.id,
            name: product.title,
            description: product.description,
            price: product.price.amount,
            originalPrice: product.price.original_amount,
            discount: this.calculateDiscount(product.price.amount, product.price.original_amount),
            image: product.images.default,
            url: product.permalink,
            store: 'Magazine Luiza',
            storeLogo: 'assets/img/magalu-logo.png', // Adicionar logo da Magalu
            rating: product.rating_average,
            reviews: product.review_count,
            installments: product.installments,
            availability: product.availability,
            categories: product.categories,
            seller: product.seller.name
        }));

        return {
            products,
            totalItems: data.total,
            currentPage: data.page,
            totalPages: Math.ceil(data.total / data.per_page)
        };
    }

    /**
     * Calcular desconto
     * @param {number} currentPrice - Preço atual
     * @param {number} originalPrice - Preço original
     */
    calculateDiscount(currentPrice, originalPrice) {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }

    /**
     * Buscar detalhes de um produto específico
     * @param {string} productId - ID do produto
     */
    async getProductDetails(productId) {
        try {
            const response = await fetch(`${this.BASE_URL}/products/${productId}`, {
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes do produto: ${response.status}`);
            }

            const data = await response.json();
            return this.formatProductDetails(data);

        } catch (error) {
            console.error('Erro ao buscar detalhes do produto:', error);
            throw error;
        }
    }

    /**
     * Formatar detalhes do produto
     * @param {Object} product - Dados do produto
     */
    formatProductDetails(product) {
        return {
            id: product.id,
            name: product.title,
            description: product.description,
            price: {
                current: product.price.amount,
                original: product.price.original_amount,
                discount: this.calculateDiscount(
                    product.price.amount,
                    product.price.original_amount
                ),
                installments: product.installments
            },
            images: {
                main: product.images.default,
                gallery: product.images.gallery
            },
            specifications: product.technical_specifications,
            categories: product.categories,
            brand: product.brand,
            seller: {
                name: product.seller.name,
                rating: product.seller.rating
            },
            shipping: {
                free: product.shipping.free,
                estimated: product.shipping.estimate
            },
            stock: product.stock,
            url: product.permalink,
            rating: {
                average: product.rating_average,
                count: product.review_count
            }
        };
    }
}

export const magaluAPI = new MagaluAPI();
