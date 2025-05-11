import express from 'express';
import { verifyToken } from '../../middleware/authMiddleware';
import { getTasks, createTask, getProjectTasks, deleteTask, updatePartialTask, updateTask, getSpecificTask, getUserTasks } from './tasks.controllers';

const router = express.Router();

router.get('/tasks', getTasks);
router.get('/project/:id/tasks', getProjectTasks);
router.get('/tasks/:id', getSpecificTask);
router.get('/users/tasks', verifyToken, getUserTasks);
router.post('/tasks', createTask);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id', updateTask);

export default router;
