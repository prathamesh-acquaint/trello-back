import express from 'express';
import { authUser, registerUser, userSearch } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/search' , protect ,userSearch)

export default router;
