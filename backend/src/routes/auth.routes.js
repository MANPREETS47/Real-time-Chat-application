import express from 'express';
import { login, logout, signup, update, checkAuth} from '../temp/auth.controlers.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.put('/update', protectRoute, update);

router.get('/checkAuth', protectRoute, checkAuth);

export default router;