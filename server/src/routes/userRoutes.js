import express from 'express';
import { auth } from '../middleware/auth.js';
import { getProfile, updateProfile, changePassword, getAllUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

// Protected routes (require authentication)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// Admin routes (can be protected further later with role checking)
router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);

export default router;
