import assert from "assert";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app.mjs";

import db from "../models/index.js";

const { User, Category, Product, Cart } = db;

describe("Cart unit test", function () {
  let category1, product1, product2, product3, user, user2;
  const password = "mysecret";
  const authenticatedUser = request.agent(app);

  before(async () => {
    user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      password: bcrypt.hashSync(password, 8),
    });

    user2 = await User.create({
      firstName: "John2",
      lastName: "Doe2",
      email: "johndoe2@gmail.com",
      password: bcrypt.hashSync(password, 8),
    });

  });

  beforeEach(async () => {
    await Cart.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });

    category1 = await Category.create({ name: "Clothing" });

    product1 = await Product.create({
      name: "Snickers",
      category_id: category1.id,
      sku: "KD3434FD",
      price: 200,
      stock: 10,
    });

    product2 = await Product.create({
      name: "Slipper",
      category_id: category1.id,
      sku: "JFDF434",
      price: 100,
      stock: 20,
    });

    product3 = await Product.create({
      name: "Infinix",
      category_id: category1.id,
      sku: "JDF3KJ78",
      price: 400,
      stock: 5,
    });

    await authenticatedUser.post(`/api/login`)
      .send({ email: user.email, password: password });

  });

  after(async () => {
    await Cart.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterEach(async () => {
    await Cart.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
  });

  it("require authentication when fetching user cart items", async () => {
    let response = await request(app).get(`/api/cart`);
    assert.equal(response.status, 401);
  });

  it("should fetch only logged in user cart items", async () => {
    const cart1 = await Cart.create({
      user_id: user.id,
      product_id: product1.id,
      quantity: 2,
    });
    const cart2 = await Cart.create({
      user_id: user2.id,
      product_id: product2.id,
      quantity: 2,
    });
    const cart3 = await Cart.create({
      user_id: user.id,
      product_id: product3.id,
      quantity: 2,
    });

    let response = await authenticatedUser.get(`/api/cart`);
    assert.equal(response.status, 200);

    assert.deepEqual(
      response.body.map((p) => p.product_id).sort(),
      [product1.id, product3.id].sort()
    );
  });

  it("successfully add items to cart", async () => {
    let response = await authenticatedUser.post(`/api/cart`)
      .send({ product_id: product1.id, quantity: 2 });

    assert.equal(response.status, 200);
  });
});
