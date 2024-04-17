import { ITemplateRepository } from "../../templates/domain";
import { IUserRepository } from "../../users/domain";
import { ILandingRepository } from "../domain";
import { findOneLanding } from './find/findOneLanding';
import { findLandingsByUserId } from './find/findLandingsByUserId';
import { editSectionWithAi } from './edit/editSectionWithAi';
import { editLandingTemplate } from "./edit/editLandingTemplate";
import { editElementContent } from './edit/editElementContent';
import { EditElementContentDto } from "./interfaces";
import { historyLanding } from "./historyLanding";
import { updateImage, createImg } from "./img";
import { UploadedFile } from "express-fileupload";
import { prepareData, fineTuning, uploadFileOpenai, tuneModelCompletion, } from "./exp";
import { createLandingAi } from "./createLandingAi";
import { CreateLandingDto } from "../domain/landing-dto";
import { completion } from "./exp/completion";

export class LandingUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly templateRepository: ITemplateRepository,
        private readonly landingRepository: ILandingRepository
    ) { }

    public createAi = async (data: CreateLandingDto) => {
        return createLandingAi(this.userRepository, this.landingRepository, data)
    }

    public findOne = async (id: string) => {
        return findOneLanding(this.landingRepository, id);
    }

    public findByUserId = async (userId: string) => {
        return findLandingsByUserId(this.landingRepository, userId);
    }

    public editSectionWithAi = async ({ id, prompt, sectionId }: { id: string, prompt: string, sectionId: string }) => {
        return editSectionWithAi(this.landingRepository, { id, prompt, sectionId });
    }

    public editTemplate = async ({ id, editedTemplate }: { id: string, editedTemplate: string }) => {
        return editLandingTemplate(this.landingRepository, { id, editedTemplate });
    }

    public editElementContent = async (id: string, data: EditElementContentDto) => {
        return editElementContent(this.landingRepository, id, data);
    }

    public earlierVersion = async (id: string) => {
        return historyLanding(this.landingRepository, id);
    }

    public createImgAi = async (id: string, data: { prompt: string, oldSrc: string, sectionId: string }) => {
        return createImg(this.landingRepository, id, data);
    }
    public updateImage = async (id: string, data: { data_id: string, sectionId: string, file: UploadedFile }) => {
        return updateImage(this.landingRepository, id, data);
    }
    public prepareData = async () => {
        return prepareData();
    }
    public uploadTuneFile = async () => {
        return uploadFileOpenai();
    }
    public fineTuning = async () => {
        return fineTuning();
    }
    public tuneCompletion = async (html: string) => {
        return completion();
    }
}