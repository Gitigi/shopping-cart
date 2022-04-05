import { Router } from 'express';

import ProductRoutes from './product.routes.mjs';
import CategoryRoutes from './category.routes.mjs';
import AuthRoutes from './auth.routes.mjs';
import CartRoutes from './cart.routes.mjs';

const router = Router();

router.use('/', ProductRoutes);
router.use('/', CategoryRoutes);
router.use('/', AuthRoutes);
router.use('/', CartRoutes)

export default router;
