import fs from 'fs'
import path from 'path'
import { NextFunction, Request, Response } from "express";
import { JSDOM } from 'jsdom'
import { OpenaiDalleResponse } from "../../interfaces";
import { DB } from "../../db";
import { OpenaiApi } from '../../config';

const imgsDirectory = '../../imgs/'

const db = new DB()

export const createImgCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { prompt, sectionId, oldSrc } = req.body as { prompt: string, oldSrc: string, sectionId: string }

    try {

        const body = {
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: 'b64_json'
        }

        const resp = await OpenaiApi.post<OpenaiDalleResponse>('/images/generations', body)

        const openaiResponse = resp.data

        const imageData = openaiResponse.data[0].b64_json;
        const imageBuffer = Buffer.from(imageData, 'base64');

        const fileName = `img_${new Date().getTime()}.jpg`
        const filePath = path.join(__dirname, imgsDirectory, fileName);

        fs.writeFileSync(filePath, imageBuffer, 'base64');
        const urlImage = `http://localhost:3001/api/landing/images/${fileName}`

        const { data, sections } = await db.getTemplate()
        const dom = new JSDOM(data)
        const document = dom.window.document

        const section = document.getElementById(sectionId)

        const $elements = section?.querySelectorAll('img')

        $elements?.forEach(element => {
            const src = element.getAttribute('src')
            if (oldSrc === src) {
                element.setAttribute("src", urlImage)
                sections[sectionId].forEach(element => {
                    if (element.attributes['src'] === oldSrc) {
                        element.attributes['src'] = urlImage
                    }

                })
            }
        })

        const newTemplate = dom.serialize()
        await db.saveTemplate(newTemplate, 0)
        await db.saveSections(sections)

        return res.json({
            fileName,
            url: urlImage,
            template: newTemplate,
            sections
        });
    } catch (error) {
        next(error)
    }
}

export const serverImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const fileName = req.params.fileName;
        const imagePath = path.join(__dirname, imgsDirectory, fileName);
        res.sendFile(imagePath);
    } catch (error) {
        next(error)
    }
}
