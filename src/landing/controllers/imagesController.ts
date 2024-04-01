import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';
import { JSDOM } from 'jsdom'
import { OpenaiDalleResponse } from "../../interfaces";
import { DB } from "../../db";
import { OpenaiApi } from '../../config';


cloudinary.config({
    cloud_name: 'dqwojznyw',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const CLOUDINARY_FOLDER = 'LANDING-AI'

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
        const imageData = openaiResponse.data[0].b64_json

        const { data, sections } = await db.getTemplate()
        const dom = new JSDOM(data)
        const document = dom.window.document

        const section = document.getElementById(sectionId)
        const $elements = section?.querySelectorAll('img')

        if ($elements) {
            for (const element of $elements) {
                const src = element.getAttribute('src')
                if (oldSrc === src) {
                    // Subir imagen a cloudinary
                    const cloudinaryResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageData}`, {
                        folder: CLOUDINARY_FOLDER
                    })
                    const urlImage = cloudinaryResponse.secure_url

                    // Eliminar imagen de cloudinary
                    const nameArr = oldSrc.split("/");
                    const name = nameArr[nameArr.length - 1];
                    const [public_id] = name.split(".");
                
                    if (nameArr.includes(CLOUDINARY_FOLDER)) {
                        await cloudinary.uploader.destroy(`${CLOUDINARY_FOLDER}/${public_id}`);
                    }

                    element.setAttribute("src", urlImage)
                    sections[sectionId].forEach(element => {
                        if (element.attributes['src'] === oldSrc) {
                            element.attributes['src'] = urlImage
                        }
                    })
                }
            }
        }


        const newTemplate = dom.serialize()
        await db.saveTemplate(newTemplate, 0)
        await db.saveSections(sections)

        return res.json({
            template: newTemplate,
            sections
        });
    } catch (error) {
        next(error)
    }
}

export const updateImageCloudinary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldSrc, sectionId } = req.query as { oldSrc: string, sectionId: string }
        const { file } = req.files as { file: UploadedFile }
        const { tempFilePath } = file

        const { data, sections } = await db.getTemplate()
        const dom = new JSDOM(data)
        const document = dom.window.document

        const section = document.getElementById(sectionId)
        const $elements = section?.querySelectorAll('img')

        if ($elements) {
            for (const element of $elements) {
                const src = element.getAttribute('src')

                if (oldSrc === src) {
                    // Subir imagen a cloudinary
                    const cloudinaryResponse = await cloudinary.uploader.upload(tempFilePath, {
                        folder: CLOUDINARY_FOLDER
                    })
                    const urlImage = cloudinaryResponse.secure_url

                    // Eliminar imagen de cloudinary
                    const nameArr = oldSrc.split("/");
                    const name = nameArr[nameArr.length - 1];
                    const [public_id] = name.split(".");
                    if (nameArr.includes(CLOUDINARY_FOLDER)) {
                        await cloudinary.uploader.destroy(`${CLOUDINARY_FOLDER}/${public_id}`);
                    }

                    element.setAttribute("src", urlImage)
                    sections[sectionId].forEach(element => {
                        if (element.attributes['src'] === oldSrc) {
                            element.attributes['src'] = urlImage
                        }
                    })
                }
            }
        }

        const newTemplate = dom.serialize()
        await db.saveTemplate(newTemplate, 0)
        await db.saveSections(sections)

        return res.json({
            template: newTemplate,
            sections
        });

    } catch (error) {
        next(error)
    }
}
