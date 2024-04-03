import { JSDOM } from 'jsdom';
import { v2 as cloudinary } from 'cloudinary';

import { UploadedFile } from "express-fileupload";
import { ILandingRepository } from "../../domain";
import { NotFoundError } from "../../../utils/errors";

cloudinary.config({
    cloud_name: 'dqwojznyw',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const CLOUDINARY_FOLDER = 'LANDING-AI'

export const updateImage = async (
    landingRepository: ILandingRepository,
    id: string,
    { oldSrc, sectionId, file }: { oldSrc: string, sectionId: string, file: UploadedFile },
) => {

    const landing = await landingRepository.findOneById(id);
    if (!landing) throw new NotFoundError('landing not exist');

    const { tempFilePath } = file;

    const dom = new JSDOM(landing.template);
    const document = dom.window.document;
    const sections = landing.sections;
    const section = document.getElementById(sectionId);
    const $elements = section?.querySelectorAll('img');

    if ($elements) {
        for (const element of $elements) {
            const src = element.getAttribute('src');

            if (oldSrc === src) {
                // Subir imagen a cloudinary
                const cloudinaryResponse = await cloudinary.uploader.upload(tempFilePath, {
                    folder: CLOUDINARY_FOLDER
                })
                const urlImage = cloudinaryResponse.secure_url

                // Eliminar imagen de cloudinary
                const nameArr = oldSrc.split("/");
                const name = nameArr[nameArr.length - 1];
                const [public_id] = name.split(".");
                if (nameArr.includes(CLOUDINARY_FOLDER)) {
                    await cloudinary.uploader.destroy(`${CLOUDINARY_FOLDER}/${public_id}`);
                }

                element.setAttribute("src", urlImage)
                sections[sectionId].forEach(element => {
                    if (element.attributes['src'] === oldSrc) {
                        element.attributes['src'] = urlImage;
                    }
                })
            }
        }
    }

    const newTemplate = dom.serialize()
    const data = {
        template: newTemplate,
        history: [...landing.history, newTemplate],
        sections
    }

    const updatedLanding = await landingRepository.update(id, data)

    return updatedLanding
}