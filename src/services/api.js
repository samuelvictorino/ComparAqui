const API_URL = '/api/search';

export const fetchSearchResults = async (query) => {
  try {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    throw error;
  }
};
