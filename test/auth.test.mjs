import assert from "assert";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app.mjs";

import db from "../models/index.js";

const { User } = db;

describe("Authentication unit test", function () {
  before(async () => {});

  after(async () => {
    await User.destroy({ where: {} });
  });

  it("registering a new user successed", async () => {
    let newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      password: "mysecret",
    };
    let response = await request(app).post(`/api/register`).send(newUser);
    assert.equal(response.status, 200);
    assert.equal(response.body.email, newUser.email);
  });

  it("logging users works", async () => {
    const user = await User.create({
      firstName: "John2",
      lastName: "Doe2",
      email: "johndoe2@gmail.com",
      password: bcrypt.hashSync("mysecret", 8),
    });
    let response = await request(app)
      .post(`/api/login`)
      .send({ email: user.email, password: user.password });
    assert.equal(response.status, 200);
  });
});
