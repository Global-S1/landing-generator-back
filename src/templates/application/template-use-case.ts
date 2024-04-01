import { NotFoundError } from "../../utils/errors";
import { TemplateRepository } from "../domain/template-repository";
import { TemplateValue } from "../domain/template-value";

export class TemplateUseCase{
    constructor(private readonly templateRepository: TemplateRepository){}

    public save = async(dataHtml: string) => {

        const templateValue = new TemplateValue({data: dataHtml})
        const template = await this.templateRepository.save(templateValue);

        return template;
    }

    public findOne = async (id: string) => {
        const template = await this.templateRepository.findById(id);

		if (!template) throw new NotFoundError('User not exist');

        return template;
    }
}