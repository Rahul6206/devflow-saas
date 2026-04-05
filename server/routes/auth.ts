import express from 'express'
import signup from '../controllers/auth/signup';
import Login from '../controllers/auth/login';
import Refresh from '../controllers/auth/refreshToken';
import LogOut from '../controllers/auth/logout';
import Me from '../controllers/auth/me';
import { updateProfile } from '../controllers/auth/updateProfile';
import { googleLogin } from '../controllers/auth/googleLogin';
import sendOtp from '../controllers/auth/sendOtp';
import authenticateToken from '../middlewares/authToken';
const router=express.Router();

router.post('/send-otp',sendOtp);
router.post('/signup',signup); 
router.post('/login',Login);
router.post('/google',googleLogin);
router.post('/refresh',Refresh)
router.delete('/logout',LogOut)
router.get('/me',authenticateToken,Me)
router.patch('/profile',authenticateToken,updateProfile)

export default router;