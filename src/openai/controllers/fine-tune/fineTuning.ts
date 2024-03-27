import fs from 'fs'
import path from 'path'

import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import OpenAI from "openai"

import { DataSetFormat } from '../../../interfaces/fine-tuning'

export const uploadFileCtrl = async (req: Request, res: Response) => {
    const api_key = process.env.API_KEY
    const openai = new OpenAI({ apiKey: api_key });

    try {
        const filePath = path.join(__dirname, '../../db/training_file.jsonl')

        const file = await openai.files.create({
            file: fs.createReadStream(filePath),
            purpose: "fine-tune",
        });

        return res.json({
            msg: 'api/ai - upload',
            data: file
        })
    } catch (error) {
        res.status(400).json(error)
    }
}

export const fineTuneCtrl = async (req: Request, res: Response) => {
    const api_key = process.env.API_KEY

    try {
        //* const training_file_id = 'file-tWstyy94h7jyOAX2Rsi1m2O5' - my account
        const training_file_id = 'file-CGAt5hs1ClCyaibWTiclrTQe'
        const suffix = 'transform-struct'
        const body = {
            training_file: training_file_id,
            model: "gpt-3.5-turbo",
            suffix,
        }

        //! ESTO ES PARA PLAN DE PAGA
        const resp = await fetch('https://api.openai.com/v1/fine_tuning/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify(body)
        })
        const fineTune = await resp.json()

        return res.json({
            msg: 'api/ai - fine-tune',
            data: fineTune
        })
    } catch (error) {
        res.status(400).json(error)
    }
}


export const trainingDataCtrl = async (req: Request, res: Response) => {

    try {
        const { fileId ,frameId } = req.query as {fileId: string, frameId: string}
        const files = req.files as { file: UploadedFile }

        const templateJson = fs.readFileSync(files.file.tempFilePath, 'utf8')
        const input = 'PROMPT' // training prompt
        const output = JSON.parse(templateJson)
        const requiredFormat: DataSetFormat = {
            messages: []
        }

        requiredFormat.messages.push({ "role": "user", "content": JSON.stringify(input) })
        requiredFormat.messages.push({ "role": "assistant", "content": JSON.stringify(output) })


        const directoryPath = path.join(__dirname, '../../data/')
        const filePath = path.join(directoryPath, `training_file.jsonl`)


        fs.appendFileSync(filePath, '\n' + JSON.stringify(requiredFormat))

        return res.json({
            msg: 'Se agregó un nuevo dato al archivo de entrenamiento',
            data: requiredFormat
        })
    } catch (error) {
        res.json(error)
    }
}
