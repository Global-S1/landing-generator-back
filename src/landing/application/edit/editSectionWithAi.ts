import { chatCompletion, getElementInfo, getSectionsFromLanding } from "../../../helpers";
import { NotFoundError } from "../../../utils/errors";
import { ElementToEdit, ILandingRepository } from "../../domain";
import { JSDOM } from 'jsdom';

interface Args {
    id: string,
    prompt: string,
    sectionId: string
}
export const editSectionWithAi = async (
    landingRepository: ILandingRepository,
    { id, prompt, sectionId }: Args
) => {
    const landing = await landingRepository.findOneById(id);
    if (!landing) throw new NotFoundError('landing not exist');

    const dom = new JSDOM(landing.template);
    const document = dom.window.document;
    const $oldSection = document.getElementById(sectionId);
    if (!$oldSection) throw Error("this section do not exist")

    const initial_prompt = landing.initial_prompt;
    const SYSTEM_PROMPT = `You are an expert landing page developer using HTML with a tailwind. You are capable of creating incredible components
    The user will tell you the description to improve the ${sectionId} of their landing page, and you will generate the changes.
    
    This is the template of the section ${$oldSection.outerHTML}
    The general content of the landing page is: ${initial_prompt}, with this information you can have more context and generate the changes that the user wants in the respective section.
    
    The content must be in the Spanish language
    Returns the template that with the respective change in the section. 
    Just deliver the code, do not generate extra text or explanations.
    DO NOT include markdown "\`\`\`" or "\`\`\`html" at the start or end.
    For images, if the images have a URL in its src attribute use that, if it doesn't, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`;

    const completion = await chatCompletion({ system_prompt: SYSTEM_PROMPT, user_prompt: prompt, model: 'gpt-4-0125-preview' })

    if (completion.error) {
        console.log(completion);
    }

    const newSection = completion.choices[0].message.content
    $oldSection.outerHTML = newSection

    //Actualizar secciones
    const sectionIds = getSectionsFromLanding(landing.template);
    const sections: { [id: string]: ElementToEdit[] } = {}

    sectionIds.forEach(id => {
        const sectionDOM = document.getElementById(id);
        const sectionElements: ElementToEdit[] = []
        if (sectionDOM) {
            getElementInfo(sectionDOM, sectionElements);
        }

        sections[id] = sectionElements
    })

    const updatedLanding = await landingRepository.update(id, {
        template: dom.serialize(),
        total_tokens: landing.total_tokens + completion.usage.total_tokens,
        sections
    })

    return updatedLanding
};