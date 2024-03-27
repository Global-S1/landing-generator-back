import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express'
import OpenAI from "openai"
import { customWriteFile } from '../../helpers/custom-write-file'

const templatesDirectory = '../../generated-templates'

export const chatCtrl = async (req: Request, res: Response) => {
    const { prompt } = req.body

    try {
        const api_key = process.env.API_KEY
        const openai = new OpenAI({ apiKey: api_key });

        const examplePath = path.join(__dirname, '../../data/page_template.json')

        const data = fs.readFileSync(examplePath, 'utf8')
        // const jsonData = JSON.stringify(JSON.parse(data))

        const SYSTEM_PROMPT = `You are an expert creating json templates for Wordpress Elemetor, you know perfectly the structure of the template json file
        This is an example template for Elementor, but you are good at creating amazing designs:
    
        - Generate the response without extra text, you will only response the template, and then parse the response and save the json in a file.
        - Use the exact color that describe the user
        - Do not include markdown "\`\`\`" or "\`\`\`json" at the start or end.`

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    "role": "system",
                    content: SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": prompt
                }],
            model: "gpt-3.5-turbo",
        })

        if (!completion.choices[0].message.content) {
            return res.json({
                msg: 'error',
                data: completion
            })
        }

        // Crear archivo
        const directoryPath = path.join(__dirname, templatesDirectory)
        const responseData = completion.choices[0].message.content
        customWriteFile({ directoryPath: directoryPath, fileName: 'template', content: responseData, mime: 'json' })


        return res.json({
            msg: 'api/ai - chat',
            data: completion.choices[0]
        })
    } catch (error) {
        res.status(400).json(error)
    }
}


export const chatWithFineTunedModelCtrl = async (req: Request, res: Response) => {
    const promptString = JSON.stringify(prompt)
    if (promptString.trim().length == 0) {
        return res.json({
            msg: 'api/ai - chat',
            data: 'No hay prompt'
        })
    }

    const api_key = process.env.API_KEY
    const openai = new OpenAI({ apiKey: api_key });

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    "role": "user",
                    "content": "Utiliza los ejemplo que que pase por fine-tuning, usa tu modelo fine tuning para convertir los objetos que te pase al objeto que debe recibir como output"
                },
                {
                    "role": "user",
                    "content": promptString
                }
            ],
            model: "ft:gpt-3.5-turbo-0613:global-s1:transform-struct:8syEQWZs",
        });

        //* Respuesta del api
        console.log(completion.choices[0].message)

        const messageContent = completion.choices[0].message.content

        let resp
        if (messageContent) {
            resp = JSON.parse(messageContent)
        } else {
            resp = 'No hubo respuesta'
        }

        return res.json({
            msg: 'api/ai - chat',
            data: resp
        })
    } catch (error) {
        res.status(400).json(error)
    }
}