import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';

export const validateFile = (allowedFiles: string[]) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const files = req.files as { file: UploadedFile } | null
        console.log(files)
        if (!files) {
            return res.status(400).json({
                msg: 'Se requiere archivo, Key: file - tipo: File',
            })
        }

        if (Array.isArray(files.file)) {
            return res.status(400).json({
                msg: 'Solo se admite un archivo',
            })
        }

        const extensionImage = files.file.mimetype.split('/')[1]
        const validExtensions = [...allowedFiles]

        if (!validExtensions.includes(extensionImage)) {
            return res.json({
                msg: `Formatos permitidos: ${validExtensions}`,
            })
        }

        next();
    }
}