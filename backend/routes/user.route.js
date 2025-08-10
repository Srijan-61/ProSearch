import { Router } from 'express' ;
const router =Router();

import { getUserList, searchUsers, getCurrentUserProfile, updateUserProfile, getUserProfileById } from '../controllers/user.controller.js' ;
import { authMiddleware } from '../middleware/auth.middleware.js' ;
import { me } from '../controllers/auth.controller.js';
import User from '../models/user.model.js';

router.get("/list",authMiddleware,getUserList);
router.get("/search", authMiddleware, searchUsers);

// Get current user profile
router.get('/auth/me', authMiddleware, me);

// Profile management routes
router.get('/profile', authMiddleware, getCurrentUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

// Get user by ID (for professional detail page)
router.get('/user/:id', authMiddleware, getUserProfileById);

export default router;