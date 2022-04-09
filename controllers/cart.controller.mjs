import { Joi } from 'express-validation';

import db from '../models/index.js';
import product from '../models/product.js';
import { joiCustomError } from '../utils.mjs';

const {User, Cart, Product} = db;

export const cartValidation = {
    body: Joi.object({
        product_id: Joi.string()
            .uuid()
            .required(),
        quantity: Joi.number()
            .integer()
            .min(1)
            .required()
            .custom( async (value, helpers) => {
                let product = await Product.findOne({where: {id: helpers.state.ancestors[0].product_id}})
                if(!product) {
                  throw joiCustomError('product does not exist', 'product_id', 'product', helpers.state.ancestors[0].product_id);
                }
                if(value > product.stock){
                  throw joiCustomError('quantity excide', 'quantity', 'quantity', value);
                }
                return value;
            })
            .external(async (value, helper)=>{
                return await value;
            })
    
    }),
}

export async function listCart(req, res) {
    let cart = await Cart.findAll({where: {user_id: req.session.user.id}})
    res.send(cart)
}

export async function addToCart(req, res) {
    let cart = await Cart.findOne({where: {user_id: req.session.user.id, product_id: req.body.product_id}})
    if(cart) {
        cart = await cart.update({'quantity': req.body.quantity})
    } else {
        cart = await Cart.create({user_id: req.session.user.id, product_id: req.body.product_id, quantity: req.body.quantity})
    }
    res.send(cart)
}

export async function removeFromCart(req, res) {
    await Cart.destroy({where: {user_id: req.session.user.id, product_id: req.params.product_id}});
    res.send({"message": "Category was deleted"})
}
