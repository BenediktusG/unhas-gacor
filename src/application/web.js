import express from 'express';
import dotenv from 'dotenv';

export const web = express();

dotenv.config();

web.listen(process.env.APP_PORT, () => {
    console.log(`Application is running in http://localhost:${process.env.APP_PORT}`);
});