import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStats,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Protect all routes
router.use(protect as any);

router.get('/stats', getTaskStats as any);

router.route('/')
  .get(getTasks as any)
  .post(createTask as any);

router.route('/:id')
  .put(updateTask as any)
  .delete(deleteTask as any);

router.patch('/:id/toggle', toggleTaskStatus as any);

export default router;