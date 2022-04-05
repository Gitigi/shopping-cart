import db from '../models/index.js';

const {Category} = db;

export async function listCategories(req, res) {
    let categories = await Category.findAll({where: null})
    res.send(categories)
}

export async function createCategory(req, res) {
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
}

export async function getCategory(req, res) {
    let category = await Category.findByPk(req.params.id)
    res.send(category)
}

export async function updateCategory(req, res) {
    try {
        let category = await Category.update(req.body, {where: {id: req.params.id}})
        res.send(category)
    } catch (e) {
        return res.status(500).json(e)
    }
}

export async function deleteCategory(req, res) {
    let category = await Category.destroy({where: {id: req.params.id}})
    res.send({"message": "Category was deleted"})
}
