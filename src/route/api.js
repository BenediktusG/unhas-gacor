import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware.js';
import userController from '../controller/user-controller.js';

export const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get('/money', userController.getMoney);