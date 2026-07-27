import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect as any, getMe as any);

export default router;