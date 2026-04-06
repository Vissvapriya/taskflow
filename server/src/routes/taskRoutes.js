import express from 'express';
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} from '../controllers/taskController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Tasks for a specific project
router.get('/project/:projectId', auth, getTasksByProject);
router.post('/project/:projectId', auth, createTask);

// Individual task operations
router.get('/:taskId', auth, getTaskById);
router.put('/:taskId', auth, updateTask);
router.delete('/:taskId', auth, deleteTask);
router.put('/:taskId/status', auth, updateTaskStatus);

export default router;
