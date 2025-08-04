import { Router } from 'express' ;
const router =Router();

import { getUserList, searchUsers } from '../controllers/user.controller.js' ;
import { authMiddleware } from '../middleware/auth.middleware.js' ;

router.get("/list",authMiddleware,getUserList);
router.get("/search", authMiddleware, searchUsers);


export default router;