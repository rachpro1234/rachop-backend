import express from 'express';
import AuthController from './controller.ts';

const router = express.Router();

router.post('/signup', AuthController.register);


export default router;