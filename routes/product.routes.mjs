import { Router } from 'express';

import * as ProductController from '../controllers/product.controller.mjs'
import {asyncWrapper} from '../utils.mjs';

const router = Router();

router.get('/products', asyncWrapper(ProductController.listProducts));
router.get('/products/category/:id', asyncWrapper(ProductController.categoryProducts));
router.post('/products',  asyncWrapper(ProductController.createProduct));
router.get('/products/:id', asyncWrapper(ProductController.getProduct));
router.put('/products/:id', asyncWrapper(ProductController.updateProduct));
router.delete('/products/:id', asyncWrapper(ProductController.deleteProduct));

export default router;
