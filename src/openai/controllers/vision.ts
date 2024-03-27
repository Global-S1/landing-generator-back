import path from 'path'
import { Request, Response } from 'express'
import { imageToBase64 } from '../../helpers/image-to-base64'
import { UploadedFile } from 'express-fileupload'
import { customWriteFile } from '../../helpers/custom-write-file'

const templatesDirectory = '../../generated-templates/'

export const generateTemplateFromImgCtrl = async (req: Request, res: Response) => {

    const { file } = req.files as { file: UploadedFile }

    const extensionImage = file.mimetype.split('/')[1]
    const base64String = imageToBase64(file.tempFilePath)
    const urlWithPrefix = `data:image/${extensionImage};base64,${base64String}`

    const api_key = process.env.API_KEY

    // const EXAMPLE_TEMPLATE = example_template
    const SYSTEM_PROMPT = `You are an expert creating json templates for Wordpress Elemetor, you know perfectly the structure of the template json file.
    You take screenshots of a reference web page from the user, and then build single template for Elementor page. 

    - Make sure the app looks exactly like the screenshot.
    - Pay close attention to background color, text color, font size, font family, 
    padding, margin, border, etc. Match the colors and sizes exactly.
    - Use the exact text from the screenshot.
    - Generate the response without extra text, you will only response the template, and then parse the response and save the json in a file.
    - Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items.
    - For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.
    - Do not include markdown "\`\`\`" or "\`\`\`json" at the start or end.
`

    const USER_PROMPT = 'Generate a template for Elementor page that looks exactly like this'

    try {

        const body = {
            "model": "gpt-4-vision-preview",
            "max_tokens": 4096,
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": USER_PROMPT
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": urlWithPrefix
                            }
                        }
                    ]
                }
            ],
        }

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify(body)
        })
        const data = await resp.json()

        if (!data.choices[0].message.content) {
            return res.json({
                msg: 'Error',
                data
            })
        }
        const directoryPath = path.join(__dirname, templatesDirectory)
        const responseData = data.choices[0].message.content
        customWriteFile({ directoryPath: directoryPath, fileName: 'template', content: responseData, mime: 'json' })

        return res.json({
            msg: 'api/ai - vision',
            data
        })
    } catch (error) {

        res.json(error)
    }
}

export const describeImgCtrl = async (req: Request, res: Response) => {

    const { file } = req.files as { file: UploadedFile }

    const extensionImage = file.mimetype.split('/')[1]
    const base64String = imageToBase64(file.tempFilePath)
    const urlWithPrefix = `data:image/${extensionImage};base64,${base64String}`

    const api_key = process.env.API_KEY


    const SYSTEM_PROMPT = `Eres un experto describiendo images de paginas web, cuando un usuario te pase una imagen, describe todo los elementos que veas, uno por uno y como los estructurarías, 

    Tomar en cuenta:
    - Se preciso con los coleres, background-color, bordes, border-color, textos, etc.
    - Sigue una estructura jerarquica y que se pueda adaptar a un diferentes dispositivos. `

    const USER_PROMPT = 'Describe la imagen'

    try {

        const body = {
            "model": "gpt-4-vision-preview",
            "max_tokens": 4096,
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": USER_PROMPT
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": urlWithPrefix
                            }
                        }
                    ]
                }
            ],
        }

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify(body)
        })
        const data = await resp.json()

        return res.json({
            msg: 'api/ai - vision',
            data
        })
    } catch (error) {

        res.json(error)
    }
}

export const generateCodeFromImgCtrl = async (req: Request, res: Response) => {

    const { file } = req.files as { file: UploadedFile }

    const extensionImage = file.mimetype.split('/')[1]
    const base64String = imageToBase64(file.tempFilePath)
    const urlWithPrefix = `data:image/${extensionImage};base64,${base64String}`

    const api_key = process.env.API_KEY

    const USER_PROMPT = 'Generate code for a web page that looks exactly like this'

    const SYSTEM_PROMPT = `You are an expert Tailwind developer
    You take screenshots of a reference web page from the user, and then build single page apps 
    using Tailwind, HTML and JS.
    
    - Make sure the app looks exactly like the screenshot.
    - Pay close attention to background color, text color, font size, font family, 
    padding, margin, border, etc. Match the colors and sizes exactly.
    - Use the exact text from the screenshot.
    - Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
    - Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
    - For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.
    
    In terms of libraries,
    - Use this script to include Tailwind: <script src="https://cdn.tailwindcss.com"></script>
    - You can use Google Fonts
    - Font Awesome for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    -Generate the response without extra text, you will only response the code.
    -Do not include markdown "\`\`\`" or "\`\`\`html" at the start or end.`

    try {

        const body = {
            "model": "gpt-4-vision-preview",
            "max_tokens": 4096,
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": USER_PROMPT
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": urlWithPrefix
                            }
                        }
                    ]
                }
            ],
        }

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify(body)
        })
        const data = await resp.json()

        if (!data.choices[0].message.content) {
            return res.json({
                msg: 'Error',
                data
            })
        }

        const directoryPath = path.join(__dirname, templatesDirectory)
        const responseData = data.choices[0].message.content
        customWriteFile({ directoryPath: directoryPath, fileName: 'template', content: responseData, mime: 'html' })

        return res.json({
            msg: 'api/ai - vision',
            data
        })
    } catch (error) {

        res.json(error)
    }
}