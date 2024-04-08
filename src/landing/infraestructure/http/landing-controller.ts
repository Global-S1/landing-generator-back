import fs from 'fs';
import path from 'path';
import { NextFunction, type Request, type Response } from 'express';
import { LandingUseCase } from "../../application/landing-use-case";
import { EditElementContentDto } from '../../application/interfaces';
import { customWriteFile } from '../../../helpers';
import { UploadedFile } from 'express-fileupload';

export class LandingController {

    constructor(private readonly landingUseCase: LandingUseCase) { }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        const { prompt, user_id, template_id } = req.body as { prompt: string, user_id: string, template_id: string };
        try {
            const landing = await this.landingUseCase.create({ user_id, template_id, prompt });

            return res.status(200).json({
                id: landing?.id,
                template: landing?.template,
                sections: landing?.sections
            })
        } catch (error) {
            next(error)
        }
    }

    public findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;

            const landing = await this.landingUseCase.findOne(id);

            return res.status(200).json({
                id: landing?.id,
                template: landing?.template,
                sections: landing?.sections
            })
        } catch (error) {
            next(error)
        }
    }

    public findByUserId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //user id
            const id = req.params.id;

            const landings = await this.landingUseCase.findByUserId(id);

            return res.status(200).json({ data: landings })
        } catch (error) {
            next(error)
        }
    }

    public editSectionWithAi = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const { prompt, sectionId } = req.body as { prompt: string, sectionId: string };

            const landing = await this.landingUseCase.editSectionWithAi({ id, prompt, sectionId });

            return res.status(200).json({
                template: landing.template,
                sections: landing.sections
            })
        } catch (error) {
            next(error)
        }
    }

    public editTemplate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const { editedTemplate } = req.body as { editedTemplate: string };

            const landing = await this.landingUseCase.editTemplate({ id, editedTemplate });

            return res.status(200).json({
                template: landing.template,
                sections: landing.sections
            })
        } catch (error) {
            next(error)
        }
    }


    public editElementContent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const data = req.body as EditElementContentDto;

            const landing = await this.landingUseCase.editElementContent(id, data);
            return res.status(200).json({
                template: landing.template,
                sections: landing.sections
            })
        } catch (error) {
            next(error)
        }
    }

    public earlierVersion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;

            const landing = await this.landingUseCase.earlierVersion(id)

            return res.status(200).json({
                template: landing.template,
                sections: landing.sections
            })
        } catch (error) {
            next(error)
        }
    }

    public exportLanding = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id

            const landing = await this.landingUseCase.findOne(id)

            const directoryPath = path.join(__dirname, '/')
            const filePath = customWriteFile({ directoryPath: directoryPath, fileName: 'template', content: landing.template, mime: 'html' })

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

    public createImgAi = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const { prompt, sectionId, oldSrc } = req.body as { prompt: string, oldSrc: string, sectionId: string };

            const landing = await this.landingUseCase.createImgAi(id, { prompt, sectionId, oldSrc })

            return res.status(200).json({
                template: landing.template,
                sections: landing.sections
            })
        } catch (error) {
            next(error)
        }
    }

    public uploadImg = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const { oldSrc, sectionId } = req.query as { oldSrc: string, sectionId: string }
            const { file } = req.files as { file: UploadedFile }

            const landing = await this.landingUseCase.updateImage(id, { oldSrc, sectionId, file })

            return res.status(200).json({
                template: landing.template,
                sections: landing.sections
            })
        } catch (error) {
            next(error)
        }
    }
    public convertToElementor = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const template = await this.landingUseCase.converToElementor()

            return res.status(200).json(template)
        } catch (error) {
            next(error)
        }
    }
    public prepareData = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const data = await this.landingUseCase.prepareData()

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    }

    public uploadTuneFile = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const data = await this.landingUseCase.uploadTuneFile()

            return res.status(200).json({ data })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public fineTuning = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const data = await this.landingUseCase.fineTuning()

            return res.status(200).json({ data })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}