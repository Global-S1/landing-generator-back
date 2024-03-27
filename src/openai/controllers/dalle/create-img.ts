import { NextFunction, Request, Response } from "express";
import fs from 'fs'
import path from 'path'
import { OpenaiDalleResponse } from "../../../interfaces";

const imgsDirectory = '../../../imgs/'

export const createImgCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const api_key = process.env.API_KEY

    try {
        const body = {
            model: 'dall-e-3',
            prompt: "a white siamese cat",
            n: 1,
            size: "1024x1024",
            response_format: 'b64_json'
        }

        const resp = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify(body)
        })
        const openaiResponse: OpenaiDalleResponse = await resp.json()

        // Convertir la imagen en base64 a un archivo de imagen
        const imageData = openaiResponse.data[0].b64_json   ;
        const imageBuffer = Buffer.from(imageData, 'base64');

        const fileName = `img_${new Date().getTime()}.jpg`

        const filePath = path.join(__dirname,imgsDirectory,fileName); // Nombre de archivo para la imagen generada

        // Guardar la imagen en el sistema de archivos
        fs.writeFile(filePath, imageBuffer, 'base64', (err) => {
            if (err) {
                console.error('Error al guardar la imagen:', err);
                return res.status(500).json({ error: 'Error al guardar la imagen' });
            }

            console.log('Imagen guardada exitosamente:', filePath);
            // Puedes devolver el nombre del archivo o cualquier otro mensaje que desees
            return res.json({
                msg: 'Imagen guardada exitosamente',
                filePath,
                fileName
            });
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
    const imagePath = path.join(__dirname, imgsDirectory,fileName);
    res.sendFile(imagePath);
    } catch (error) {
        next(error)
    }
}
