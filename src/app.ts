import os from 'os';

import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'

import landingRoutes from "./landing/router/landingRoutes";
import { errorHandler } from './middlewares/errorHandler';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000
const tempDir = os.tmpdir();

app.use(cors())
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir
}))

app.use('/api/landing', landingRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})
