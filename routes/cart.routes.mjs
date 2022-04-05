import { Router } from 'express';

import * as CartController from '../controllers/cart.controller.mjs'
import { authMiddleware } from '../middlewares.mjs';

const router = Router();


router.get('/cart', authMiddleware, CartController.listCart);
router.post('/cart', authMiddleware, CartController.addToCart);
router.delete('/cart/:product_id', authMiddleware, CartController.removeFromCart);

export default router;
