import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from '../route/api.js';
import cors from 'cors';

dotenv.config();
export const web = express();

web.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
}));

web.use(userRouter);

web.use(express.json());

web.listen(process.env.APP_PORT, () => {
    console.log(`Application is running in http://localhost:${process.env.APP_PORT}`);
});