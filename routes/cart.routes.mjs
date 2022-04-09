import { Router } from 'express';
import { validate } from 'express-validation';

import * as CartController from '../controllers/cart.controller.mjs'
import { authMiddleware } from '../middlewares.mjs';
import {asyncWrapper} from '../utils.mjs';

const router = Router();


router.get('/cart', authMiddleware, asyncWrapper(CartController.listCart));
router.post('/cart', authMiddleware, validate(CartController.cartValidation, {}, {}), asyncWrapper(CartController.addToCart));
router.delete('/cart/:product_id', authMiddleware, asyncWrapper(CartController.removeFromCart));

export default router;
