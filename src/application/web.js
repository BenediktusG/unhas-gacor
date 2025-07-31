import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from '../route/api.js';

dotenv.config();
export const web = express();

web.use(userRouter);

web.listen(process.env.APP_PORT, () => {
    console.log(`Application is running in http://localhost:${process.env.APP_PORT}`);
});