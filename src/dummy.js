const fs = require('fs');

const products = [];

for (let i = 1; i <= 6001; i++) {
  const price = Math.floor(Math.random() * 100001);
  products.push({ id: i, name: `Product ${i}`, price });
}

const data = { products };

fs.writeFile('products.json', JSON.stringify(data), (err) => {
  if (err) throw err;
  console.log('Products file has been saved.');
});
