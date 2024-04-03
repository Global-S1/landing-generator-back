import { NotFoundError } from "../../utils/errors";
import { ITemplateRepository, TemplateValue } from "../domain";

export class TemplateUseCase {
    constructor(private readonly templateRepository: ITemplateRepository) { }

    public save = async (dataHtml: string) => {

        const templateValue = new TemplateValue({ data: dataHtml })
        const template = await this.templateRepository.save(templateValue);

        return template;
    }

    public findOne = async (id: string) => {
        const template = await this.templateRepository.findById(id);

        if (!template) throw new NotFoundError('Template not exist');

        return template;
    }
    public findAll = async () => {
        const templates = await this.templateRepository.findAll();

        if (!templates) throw new NotFoundError('Templates not exist');

        return templates;
    }
}