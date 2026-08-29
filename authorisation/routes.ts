import express from 'express';
import AuthController from './controller.ts';

const router = express.Router();

router.post('/signup-user', AuthController.register);
router.post('/login-user', AuthController.login);




export default router;