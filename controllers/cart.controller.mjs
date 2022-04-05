import db from '../models/index.js';

const {User, Cart} = db;


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
