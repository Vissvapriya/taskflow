import express from 'express';
import { auth } from '../middleware/auth.js';
import { 
  getAllProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  addMember, 
  removeMember 
} from '../controllers/projectController.js';

const router = express.Router();

// Project CRUD routes (all require authentication)
router.get('/', auth, getAllProjects);
router.post('/', auth, createProject);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

// Member management routes
router.post('/:id/members', auth, addMember);
router.delete('/:id/members/:memberId', auth, removeMember);

export default router;
