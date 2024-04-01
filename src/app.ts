import os from 'os';

import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'

import { errorHandler } from './middlewares/errorHandler';
import { connectDb } from './db/connect';

import authRoutes from './users/infrastructure/http/auth-route';
import landingRoutes from "./landing/router/landingRoutes";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000
const tempDir = os.tmpdir();

connectDb()

app.use(cors())
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir
}))

app.use('/api/landing', landingRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})
