import { Router } from 'express';

import * as CategoryController from '../controllers/category.controller.mjs'
import {asyncWrapper} from '../utils.mjs';

const router = Router();


router.get('/categories', asyncWrapper(CategoryController.listCategories));
router.post('/categories', asyncWrapper(CategoryController.createCategory));
router.get('/categories/:id', asyncWrapper(CategoryController.getCategory));
router.put('/categories/:id', asyncWrapper(CategoryController.updateCategory));
router.delete('/categories/:id', asyncWrapper(CategoryController.deleteCategory));

export default router;
