import express from 'express';
import AuthController from './controller.ts';

const router = express.Router();

router.post('/signup', AuthController); // when finished the login controller add the Authcontroller.register and .login



export default router;