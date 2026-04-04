import express from 'express'
import signup from '../controllers/auth/signup';
import Login from '../controllers/auth/login';
import Refresh from '../controllers/auth/refreshToken';
import LogOut from '../controllers/auth/logout';
import Me from '../controllers/auth/me';
import { updateProfile } from '../controllers/auth/updateProfile';
import authenticateToken from '../middlewares/authToken';
const router=express.Router();

router.post('/signup',signup); 
router.post('/login',Login);
router.post('/refresh',Refresh)
router.delete('/logout',LogOut)
router.get('/me',authenticateToken,Me)
router.patch('/profile',authenticateToken,updateProfile)

export default router;