import { Router } from 'express';
import { getTasks, createTask } from '../controllers/taskController';

const router = Router();

// Routes mapped to controllers
router.route('/')
  .get(getTasks)
  .post(createTask);

export default router;