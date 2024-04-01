import { TemplateEntity } from "./template-entity";

export interface TemplateRepository{
    save: (template: TemplateEntity) => Promise<TemplateEntity | null>;

    findById: (id: string) => Promise<TemplateEntity | null>;
}