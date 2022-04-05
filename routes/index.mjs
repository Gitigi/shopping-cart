import { Router } from 'express';

import ProductRoutes from './product.routes.mjs';
import CategoryRoutes from './category.routes.mjs';
import AuthRoutes from './auth.routes.mjs';

const router = Router();

router.use('/', ProductRoutes);
router.use('/', CategoryRoutes);
router.use('/', AuthRoutes);

export default router;
