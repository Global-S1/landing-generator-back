import { JSDOM } from 'jsdom';
import { getSectionsFromLanding } from '../../helpers/getSectionsFromTemplate';
import { NotFoundError } from '../../utils/errors';
import { IUserRepository } from '../../users/domain/user-repository';
import { ITemplateRepository } from '../../templates/domain/template-repository';
import { ILandingRepository } from '../domain/landing-repository';
import { chatCompletion } from '../../helpers/chat-completion';
import { getElementInfo } from '../../helpers/getElementInfo';
import { ElementToEdit } from '../domain/landing-entity';
import { LandingValue } from '../domain/landing-value';

interface Args {
    user_id: string,
    template_id: string,
    prompt: string
}

export const createLanding = async (
    userRepository: IUserRepository,
    templateRepository: ITemplateRepository,
    landingRepository: ILandingRepository,
    { user_id, template_id, prompt }: Args
) => {

    const user = await userRepository.findByUid(user_id);
    if (!user) throw new NotFoundError('user not exist');

    const template = await templateRepository.findById(template_id);
    if (!template) throw new NotFoundError('template not exist');

    const dom = new JSDOM(template.data);
    const document = dom.window.document;
    const sectionsId = getSectionsFromLanding(template.data);

    // cada elemento será el total_tokens de cada sección generada
    const tokens_section: number[] = []

    for (let section of sectionsId) {
        console.log(`...cargando section ${section}`);
        const $oldSection = document.getElementById(section);
        if (!$oldSection) continue
        const SYSTEM_PROMPT = `You are an expert landing page developer using HTML with a tailwind.
            The user will tell you the description of their landing page and you will generate the html content of this section: ${section}.
            This is the template of the section ${$oldSection?.outerHTML}
            The template have these sections: ${sectionsId}

            The content must be in the Spanish language
            Returns the template that with the respective change in the section. 
            Just deliver the code, do not generate extra text or explanations.
            DO NOT include markdown "\`\`\`" or "\`\`\`html" at the start or end.
            For images, if the images of this section have a URL in its src attribute, that is different from placeholder images, leave it, if it doesn't, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`;

        //* OpenAi
        const data = await chatCompletion({ system_prompt: SYSTEM_PROMPT, user_prompt: prompt, model: 'gpt-3.5-turbo' });

        if (data.error) {
            console.log(data);
            break
        }

        tokens_section.push(data.usage.total_tokens)
        const newSection = data.choices[0].message.content;

        if ($oldSection) {
            $oldSection.outerHTML = newSection;
        }

        //! tiempo de espera necesario en el tier gratuito
        //! await new Promise(resolve => setTimeout(resolve, 10000))
    }

    //* Agregar objeto con los elementos de las secciones
    const sections: { [id: string]: ElementToEdit[] } = {};

    sectionsId.forEach(id => {

        const sectionDOM = document.getElementById(id);
        const sectionElements: ElementToEdit[] = [];
        if (sectionDOM) {
            getElementInfo(sectionDOM, sectionElements);
        }

        sections[id] = sectionElements;
    })

    const total_tokens = tokens_section.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    const landingValue = new LandingValue({
        initial_prompt: prompt,
        template: dom.serialize(),
        history: [dom.serialize()],
        sections,
        total_tokens,
        user_id: user.uid
    })

    const landing = await landingRepository.create(landingValue);

    return landing;
}