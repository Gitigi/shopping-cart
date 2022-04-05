import { Router } from 'express';

import * as ProductController from '../controllers/product.controller.mjs'

const router = Router();

router.get('/products', ProductController.listProducts);
router.get('/products/category/:id', ProductController.categoryProducts);
router.post('/products',  ProductController.createProduct);
router.get('/products/:id', ProductController.getProduct);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

export default router;
