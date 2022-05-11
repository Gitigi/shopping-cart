'use strict';

const fs = require('fs');
const zlib = require('zlib');

// import db from '../models/index.js';
const {Product, Category} = require('../models/index.js');

async function getCategory(categories) {
  let parent_id = null
  categories = categories.split('>');
  let category, created;
  for(let name of categories) {
    [category, created] = await Category.findOrCreate({
      where: {name, parent_id}
    })
    parent_id = category.id
  }
  return category.id;
}

module.exports = {
  async up (queryInterface, Sequelize) {

    const data = await new Promise(resolve => {
      const fileContents = fs.createReadStream('./seeders/products.txt.gz');
      const writeStream = fs.createWriteStream('./seeders/products.txt');
      const unzip = zlib.createGunzip();

      fileContents.pipe(unzip).pipe(writeStream).on('finish', () => {
        let data = fs.readFileSync('./seeders/products.txt', {encoding:'utf8', flag:'r'});
        fs.unlinkSync('./seeders/products.txt')
        resolve(data)
      });
    })

    let product_lines = data.split('\n')
    let products = product_lines.map(l => l.split('\t'))
    let headers = products.shift().map(h => h.trim())

    let headerMapping = {
      'name': headers.indexOf('Product Name'),
      'sku': headers.indexOf('Sku'),
      'category': headers.indexOf('Product Category'),
      'price': headers.indexOf('Product Price'),
      'stock': headers.indexOf('Product Available Inventory'),
      'description': headers.indexOf('Product Available Inventory'),
    }

    products = products.slice(0, 1000) // create only 1000 products
    for(let product of products) {
      console.log('Creating ', product[headerMapping['name']])
      product = {
        'name': product[headerMapping['name']].replaceAll('"', ''),
        'sku': product[headerMapping['sku']],
        'category_id': await getCategory(product[headerMapping['category']]),
        'price': product[headerMapping['price']],
        'stock': product[headerMapping['stock']],
        'description': product[headerMapping['description']]
      }
      try {
        await Product.create(product)
      } catch(e) {
        console.log('Error creating ', product.name)
        console.log('Error ', e)
      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
