import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController.js';

const router = express.Router();

// Auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;
