const axios = require("axios");
const fs = require('fs');

async function fetchProductsByPriceRange(minPrice, maxPrice) {
  const url = `http://localhost:3000/products`;
  const responseArray = await axios.get(url);

  const filteredProducts = responseArray.data.filter((product) => {
    return product.price >= minPrice && product.price <= maxPrice;
  });

  const total = filteredProducts.length;
  const count = Math.min(total, 1000);
  const products = filteredProducts.slice(0, count);

  return { total, count, products };
}

async function fetchAllProducts() {
  const products = [];
  const totalProducts =  (await fetchProductsByPriceRange(0, 100000)).total;

  let segmentSize = 10000; // Number of products to fetch in each segment
  let iteration = 0;

  let minPrice = 0;
  let maxPrice = segmentSize - 1
  while (true) {
    const result = await fetchProductsByPriceRange(minPrice, maxPrice);
    if (totalProducts <= products.length) {
      break;
    }
    if (result.total <= result.count) {
      products.push(...result.products);
    }
    else{
      segmentSize = segmentSize/2
    }

    minPrice = maxPrice + 1; // Move to the next segment
    maxPrice += segmentSize;
    maxPrice = Math.min(maxPrice, 100000); // Ensure the maxPrice stays within the range
  }

  return products;
}

async function main() {
  const result = await fetchAllProducts();
  const sortedResult = result.sort((a, b) => a.id - b.id); // Sort by id
  const jsonResult = JSON.stringify(sortedResult, null, 2);

  
  fs.writeFile('retrieved_products.json', jsonResult, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('Products have been written to products.json');
    console.log(result.length);
  });
}
main()
