import fs from 'fs'
import path from 'path'
import { NextFunction, Request, Response } from "express"
import { customWriteFile } from '../../helpers/custom-write-file'

export const exportLandingPageCtrl = async (
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    const { template } = req.body as { template: string }

    try {
        const directoryPath = path.join(__dirname, '../../generated-templates/')
        const filePath = customWriteFile({ directoryPath: directoryPath, fileName: 'template', content: template, mime: 'html' })

        res.download(filePath, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('error downloading file')
            }

            // Elimina el archivo después de descargarlo
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                }
                console.log('file deleted');
            });
        })

    } catch (error) {
        next(error)
    }
}