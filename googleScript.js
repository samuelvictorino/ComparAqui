// googleScript.js
function scrapeProductPrices(productName) {
  const retailers = [
    {url: 'magazineluiza.com.br', selector: '.price-value'},
    {url: 'americanas.com.br', selector: '.price__current'},
    // Adicione mais retailers conforme necessário
  ];
  
  const prices = retailers.map(retailer => {
    try {
      // Lógica de scraping
      return {
        store: retailer.url,
        price: // preço encontrado
      };
    } catch (error) {
      return null;
    }
  }).filter(Boolean);
  
  return prices;
}

function doGet(e) {
  const product = e.parameter.product;
  const prices = scrapeProductPrices(product);
  return ContentService.createTextOutput(JSON.stringify(prices))
    .setMimeType(ContentService.MimeType.JSON);
}
