import express from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
} from '../controllers/teamController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Team operations
router.get('/', auth, getAllTeams);
router.post('/', auth, createTeam);
router.get('/:teamId', auth, getTeamById);
router.put('/:teamId', auth, updateTeam);
router.delete('/:teamId', auth, deleteTeam);

// Member operations
router.post('/:teamId/members', auth, addMember);
router.delete('/:teamId/members/:memberId', auth, removeMember);

export default router;
