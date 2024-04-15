import path from 'path'

import { SectionType } from "../../interfaces"
import { JSDOM } from 'jsdom';
import { chatCompletion } from '../../helpers/chat-completion';
import { customWriteFile, getElementInfo } from "../../helpers";
import { IUserRepository } from '../../users/domain';
import { NotFoundError } from '../../utils/errors';
import { ElementToEdit, ILandingRepository, LandingValue } from '../domain';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
</body>
</html>`

interface Args {
    user_id: string;
    prompt: string;
    title: string;
}

export const createLandingAi = async (
    userRepository: IUserRepository,
    landingRepository: ILandingRepository,
    { user_id, prompt, title }: Args
) => {

    const user = await userRepository.findByUid(user_id);
    if (!user) throw new NotFoundError('user not exist');

    const userPrompt = prompt;
    // const sectionsId: SectionType[] = ['header', 'hero', 'features', 'about', 'faq', 'cta', 'footer'];
    const sectionsId: SectionType[] = ['header', 'hero', 'features', 'about', 'faq', 'cta','testimonials', 'pricing', 'contact', 'footer'];

    const dom = new JSDOM(html);
    const document = dom.window.document;

    let total_tokens_createBase = 0
    let total_tokens_createContent = 0

    for (const section of sectionsId) {
        const SYSTEM_PROMPT = `You are an expert landing page developer using HTML with a tailwind.
        The user will ask you to generate a HTML section of a landing page, create this section considering that the landing page has these: ${sectionsId}.
        - Use semantic tags for each section and tag.
        - Generate the design with a minimalist style.
        - titulos principales( h1 - h2 ) y botones tendran un color verde, los subtitulos y el texto de color negro y el fondo de color blanco.
        - Generate responsive layouts. 
        - add the id attribute to this generated section, the value should be "${section}".
        - Just deliver the code, do not generate extra text or explanations.
        - DO NOT include markdown "\`\`\`" or "\`\`\`html" at the start or end.
        - Use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`;

        const USER_PROMPT = `I want to create the html template for the "${section}" section of a landing page.`;

        const completion = await chatCompletion({ system_prompt: SYSTEM_PROMPT, user_prompt: USER_PROMPT, model: 'gpt-3.5-turbo' });
        if (completion.error) {
            continue;
        }
        console.log(section)

        const newSection = completion.choices[0].message.content;

        total_tokens_createBase += completion.usage.total_tokens;
        document.body.innerHTML += newSection;
    }

    for (const section of sectionsId) {
        const $oldSection = document.getElementById(section);
        if (!$oldSection) continue

        const SYSTEM_PROMPT = `You are an expert landing page developer using HTML with a tailwind.
        The user will tell you the description of their landing page and you will generate the html content of the section "${section}".
        This is the template of the section ${$oldSection?.outerHTML}
        The landing page have these sections: ${sectionsId}
        The content must be in the Spanish language
        Returns the template that with the respective change in the section. 
        Just deliver the code, do not generate extra text or explanations.
        DO NOT include markdown "\`\`\`" or "\`\`\`html" at the start or end.
        Use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`;

        const completion = await chatCompletion({ system_prompt: SYSTEM_PROMPT, user_prompt: userPrompt, model: 'gpt-3.5-turbo' });
        if (completion.error) {
            break;
        }

        console.log(section, 'content')

        const newSection = completion.choices[0].message.content;

        if ($oldSection) {
            total_tokens_createContent += completion.usage.total_tokens;
            $oldSection.outerHTML = newSection;
        }
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


    //* Info 
    const directoryPath = path.join(__dirname, '/')
    customWriteFile({ directoryPath, fileName: 'template', content: dom.serialize(), mime: 'html' })
    console.log(total_tokens_createBase)
    console.log(total_tokens_createContent)

    const total_tokens = total_tokens_createBase + total_tokens_createContent
    const landingValue = new LandingValue({
        title,
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