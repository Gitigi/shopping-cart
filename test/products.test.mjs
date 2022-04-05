import assert from 'assert';
import chai from 'chai';
import request from 'supertest';
import app from '../app.mjs';

import db from '../models/index.js';

const {expect} = chai;
const {Category, Product} = db;

describe('Product unit test', function() {
  let category1, category2, category3, product1, product2, product3
  
  before( async () => {    
    category1 = await Category.create({'name': 'Clothing'});
    category2 = await Category.create({'name': 'Shoes', parent_id: category1.id});
    category3 = await Category.create({'name': 'Electronics'});

    product1 = await Product.create({
      name: 'Snickers',
      category_id: category2.id,
      sku: 'KD3434FD',
      price: 200,
      stock: 10
    });

    product2 = await Product.create({
      name: 'Slipper',
      category_id: category2.id,
      sku: 'JFDF434',
      price: 100,
      stock: 20
    });

    product3 = await Product.create({
      name: 'Infinix',
      category_id: category3.id,
      sku: 'JDF3KJ78',
      price: 400,
      stock: 5
    });

  })

  after(async () => {
    await Product.destroy({where: {}})
    await Category.destroy({where: {}})
  })

  it('fetch all products', async () => {
    let response = await request(app).get(`/api/products`)
    assert.equal(response.status, 200)
    assert.equal(response.body.length, 3)
    assert.deepEqual(
      response.body.map(p => p.name).sort(),
      [product1.name, product2.name, product3.name].sort()
    )

  });

  it('fetch all products in a category including sub categories', async () => {
    let response = await request(app).get(`/api/products/category/${category1.id}`)
    assert.equal(response.status, 200)
    assert.equal(response.body.length, 2)
    assert.deepEqual(
      response.body.map(p => p.name).sort(),
      [product1.name, product2.name].sort()
    )

  });
  
});
