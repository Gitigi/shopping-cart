import { Joi } from 'express-validation';

import db from '../models/index.js';
import { joiCustomError } from '../utils.mjs';

const {sequelize, Sequelize, Product} = db;

export const productPostValidation = {
    body: Joi.object({
        name: Joi.string().required()
            .external(async (value,helper) => {
                let product = await Product.findOne({where: {name: value}})
                if(product) {
                    throw joiCustomError('name must be unique', 'name', 'name', value);
                }
            }),
        sku: Joi.string().required()
        .external(async (value,helper) => {
            let product = await Product.findOne({where: {sku: value}})
            if(product) {
                throw joiCustomError('sku must be unique', 'sku', 'sku', value);
            }
        }),
        price: Joi.number().min(0).required(),
        stock: Joi.number().integer().min(0).required(),
        category_id: Joi.string().uuid().required()
    }),
}


export async function listProducts(req, res) {
    let offset = req.query['page'] ? parseInt(req.query['page']) : 1;
    let limit = req.query['size'] ? parseInt(req.query['size']) : 10;
    offset = offset > 0 ? offset - 1 : 0
    limit = limit > 0 ? limit : 10;

    let products = await Product.findAndCountAll({
        limit,
        offset,
        where: null
    })
    
    res.send(products)
}

export async function categoryProducts(req, res) {
    let offset = req.query['page'] ? parseInt(req.query['page']) : 1;
    let limit = req.query['size'] ? parseInt(req.query['size']) : 10;
    offset = offset > 0 ? offset - 1 : 0
    limit = limit > 0 ? limit : 10;

    const query = `
    WITH RECURSIVE category_list AS (
        SELECT id from Categories where id = :category_id
    
        UNION ALL
    
        SELECT Categories.id from Categories, category_list
        WHERE Categories.parent_id = category_list.id
    ),
    total_products as (
        select count(*) as count from Products where category_id in (select id from category_list)
    )
    select * from Products, total_products where category_id in (select id from category_list) limit :limit offset :offset;
    `
    let products = await sequelize.query(query, {
        replacements: { category_id: req.params.id, limit, offset },
        type: Sequelize.QueryTypes.SELECT
    })
    const count = products.length ? products[0].count : 0;
    products = {
        count,
        rows: products.map(p => (delete p.count && p))
    }
    res.send(products)
}

export async function createProduct(req, res) {
    let product = {
        name: req.body.name,
        category_id: req.body.category_id,
        sku: req.body.sku,
        price: req.body.price,
        stock: req.body.stock,
        experiation: req.body.experiation,
        description: req.body.description
    }
    product = await Product.create(product)
    res.send(product)

}

export async function getProduct(req, res) {
    let product = await Product.findByPk(req.params.id)
    res.send(product)
}

export async function updateProduct(req, res) {
    let product = await Product.update(req.body, {where: {id: req.params.id}})
    res.send(product)
}

export async function deleteProduct(req, res) {
    let product = await Product.destroy({where: {id: req.params.id}})
    res.send({"message": "Product was deleted"})
}
