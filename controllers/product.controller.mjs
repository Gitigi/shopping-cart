import db from '../models/index.js';

const {sequelize, Sequelize, Product} = db;


export async function listProducts(req, res) {
    let products = await Product.findAll({where: null})
    res.send(products)
}

export async function categoryProducts(req, res) {
    const query = `
    WITH RECURSIVE category_list AS (
        SELECT id from Categories where id = :category_id
    
        UNION ALL
    
        SELECT Categories.id from Categories, category_list
        WHERE Categories.parent_id = category_list.id
    )
    select * from Products where category_id in (select id from category_list);
    `
    let products = await sequelize.query(query, {
        replacements: { category_id: req.params.id },
        model: Product,
        type: Sequelize.QueryTypes.SELECT
    })
    res.send(products)
}

export async function createProduct(req, res) {
    try{
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
    } catch (e) {
        return res.status(500).json(e)
    }
}

export async function getProduct(req, res) {
    let product = await Product.findByPk(req.params.id)
    res.send(product)
}

export async function updateProduct(req, res) {
    try {
        let product = await Product.update(req.body, {where: {id: req.params.id}})
        res.send(product)
    } catch (e) {
        return res.status(500).json(e)
    }
}

export async function deleteProduct(req, res) {
    let product = await Product.destroy({where: {id: req.params.id}})
    res.send({"message": "Product was deleted"})
}
