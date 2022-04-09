import { Router } from 'express';

import * as AuthController from '../controllers/auth.controller.mjs'
import {asyncWrapper} from '../utils.mjs';

const router = Router();


router.post('/register', asyncWrapper(AuthController.register));
router.post('/login', asyncWrapper(AuthController.login));
router.get('/logout', asyncWrapper(AuthController.logout));

export default router;
