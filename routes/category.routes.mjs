import { Router } from 'express';

import * as CategoryController from '../controllers/category.controller.mjs'

const router = Router();


router.get('/categories', CategoryController.listCategories);
router.post('/categories', CategoryController.createCategory);
router.get('/categories/:id', CategoryController.getCategory);
router.put('/categories/:id', CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.deleteCategory);

export default router;
