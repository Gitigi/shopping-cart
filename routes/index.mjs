import { Router } from 'express';

import ProductRoutes from './product.routes.mjs';
import CategoryRoutes from './category.routes.mjs';

const router = Router();

router.use('/', ProductRoutes);
router.use('/', CategoryRoutes);

export default router;
