import express from "express";
import userController from './controller.ts';
import check from '../common/middlewares/isAuthenticated.ts';

const router = express.Router();


router.get('/auth', check, userController.getUser);
router.get('/auth/all', check, userController.getAllUsers);

export default router;