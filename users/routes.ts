import express from "express";
import userController from './controller.ts';
import check from '../common/middlewares/isAuthenticated.ts';

const router = express.Router();


router.get('/', check, userController.getUser);
router.get('/all', check, userController.getAllUsers);

export default router;