import { Router } from 'express';
import healthRoutes from './healthRoutes';

const router = Router();

// Mount health routes at base of router (e.g. GET /api/health)
router.use('/', healthRoutes);

export default router;
