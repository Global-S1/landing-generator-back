import { TemplateEntity, ITemplateRepository } from "../../domain";
import TemplateSchema from "./template-schema";

export class MongoTemplateRepository implements ITemplateRepository {
    async save(template: TemplateEntity): Promise<TemplateEntity | null> {
        const newTemplate = await TemplateSchema.create(template)

        await newTemplate.save()

        return newTemplate
    }

    async findById(id: string): Promise<TemplateEntity | null> {
        const template = await TemplateSchema.findOne<TemplateEntity>({ id })

        return template
    }
}