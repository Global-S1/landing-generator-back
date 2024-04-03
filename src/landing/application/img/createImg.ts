import { JSDOM } from 'jsdom';
import { v2 as cloudinary } from 'cloudinary';
import { OpenaiApi } from "../../../config"
import { OpenaiDalleResponse } from "../../../interfaces"
import { NotFoundError } from "../../../utils/errors"
import { ILandingRepository } from "../../domain"

cloudinary.config({
    cloud_name: 'dqwojznyw',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const CLOUDINARY_FOLDER = 'LANDING-AI'

export const createImg = async (
    landingRepository: ILandingRepository,
    id: string,
    { prompt, oldSrc, sectionId }: { prompt: string, oldSrc: string, sectionId: string }
) => {
    const body = {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: 'b64_json'
    }

    const resp = await OpenaiApi.post<OpenaiDalleResponse>('/images/generations', body);
    const openaiResponse = resp.data;
    const imageData = openaiResponse.data[0].b64_json;

    const landing = await landingRepository.findOneById(id);
    if (!landing) throw new NotFoundError('landing not exist');


    const dom = new JSDOM(landing.template);
    const document = dom.window.document;
    const sections = landing.sections;

    const section = document.getElementById(sectionId)
    const $elements = section?.querySelectorAll('img')

    if ($elements) {
        for (const element of $elements) {
            const src = element.getAttribute('src')
            if (oldSrc === src) {
                // Subir imagen a cloudinary
                const cloudinaryResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageData}`, {
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
                        element.attributes['src'] = urlImage
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