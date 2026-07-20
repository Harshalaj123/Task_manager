import { Router } from 'express';
import { registerUser } from '../controllers/userController';

const router = Router();

// Route configuration
router.post('/register', registerUser);

export default router;