import { NextFunction, Request, Response } from "express";
import { TemplateUseCase } from "../../application/template-use-case";
import { Rsp } from "../../../utils/response";

export class TemplateController {

    constructor(private readonly templateUseCase: TemplateUseCase) { }

    public save = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { data } = req.body as { data: string }

            const template = await this.templateUseCase.save(data)

            Rsp.success(res, template, 200)
        } catch (error) {
            next(error)
        }
    }

    public findeOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params

            const template = await this.templateUseCase.findOne(id)

            Rsp.success(res, template, 200)
        } catch (error) {
            next(error)
        }
    }
    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templates = await this.templateUseCase.findAll();

            return res.status(200).json({data: templates})
        } catch (error) {
            next(error)
        }
    }
}