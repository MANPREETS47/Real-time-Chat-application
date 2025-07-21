import express from 'express';
import {protectRoute} from '../temp/auth.middleware.js';
import { getUsersForSidebar , getMessages, sendMessage} from '../controllers/message.controlers.js';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;