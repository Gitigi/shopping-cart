import express from 'express';

import db from './models/index.js';

const {sequelize, Sequelize, Category, Product} = db;

const app = express();

app.use(express.json());

// db.sequelize.sync()

app.get('/', (req, res) => {
    res.send('Hello World\n');
})


app.get('/categories', async (req, res) => {
    let categories = await Category.findAll({where: null})
    res.send(categories)
})

app.post('/categories', async (req, res) => {
    let category = {
        name: req.body.name,
        parent_id: req.body?.parent_id
    }
    try{
        category = await Category.create(category)
        res.send(category)
    } catch(e) {
        res.status(500).json(e)
    }
})

app.get('/categories/:id', async (req, res) => {
    let category = await Category.findByPk(req.params.id)
    res.send(category)
})

app.put('/categories/:id', async (req, res) => {
    try {
        let category = await Category.update(req.body, {where: {id: req.params.id}})
        res.send(category)
    } catch (e) {
        return res.status(500).json(e)
    }
})

app.delete('/categories/:id', async (req, res) => {
    let category = await Category.destroy({where: {id: req.params.id}})
    res.send({"message": "Category was deleted"})
})


app.get('/products/category/:id', async (req, res) => {
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
})


app.get('/products', async (req, res) => {
    let products = await Product.findAll({where: null})
    res.send(products)
})

app.post('/products',  async (req, res, next) => {
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
    
    
})

app.get('/products/:id', async (req, res) => {
    let product = await Product.findByPk(req.params.id)
    res.send(product)
})

app.put('/products/:id', async (req, res) => {
    try {
        let product = await Product.update(req.body, {where: {id: req.params.id}})
        res.send(product)
    } catch (e) {
        return res.status(500).json(e)
    }
})

app.delete('/products/:id', async (req, res) => {
    let product = await Product.destroy({where: {id: req.params.id}})
    res.send({"message": "Product was deleted"})
})

app.use((err, req, res, next) => {
    return res.status(500).json(err)
  })


export default app;

const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log(`Running on port ${PORT}`);
