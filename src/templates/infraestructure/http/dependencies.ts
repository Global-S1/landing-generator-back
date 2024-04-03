import { TemplateUseCase } from "../../application/template-use-case";
import { MongoTemplateRepository } from "../mongo/mongo-template-repository";
import { TemplateController } from "./template-controller";

const templateRepository = new MongoTemplateRepository()
const templateUseCase = new TemplateUseCase(templateRepository)

export const templateCtrl = new TemplateController(templateUseCase)