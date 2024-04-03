import { TemplateEntity } from "./template-entity";

export interface ITemplateRepository {
    save: (template: TemplateEntity) => Promise<TemplateEntity | null>;

    findById: (id: string) => Promise<TemplateEntity | null>;

    findAll: () => Promise<TemplateEntity[] | null>
}