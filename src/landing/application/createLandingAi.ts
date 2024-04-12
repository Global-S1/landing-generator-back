import path from 'path'

import { SectionType } from "../../interfaces"
import { JSDOM } from 'jsdom';
import { chatCompletion } from '../../helpers/chat-completion';
import { customWriteFile } from "../../helpers";

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

export const createLandingAi = async () => {

    const prompt = 'Landing para un fast food llamado sabrocito';
    const sectionsId: SectionType[] = ['header', 'hero', 'features', 'about', 'faq', 'cta', 'footer'];

    const dom = new JSDOM(html);
    const document = dom.window.document;

    let total_tokens_createBase = 0
    let total_tokens_createContent = 0

    for (const section of sectionsId) {

        const SYSTEM_PROMPT = `You are an expert landing page developer using HTML with a tailwind.
        The user will ask you to generate a HTML section of a landing page, create this section considering that the landing page has these: ${sectionsId}
        
        Use semantic tags for each section and tag.
        Generate responsive layouts. 
        add the id attribute to this generated section, the value should be "${section}".
        Just deliver the code, do not generate extra text or explanations.
        DO NOT include markdown "\`\`\`" or "\`\`\`html" at the start or end.
        Use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`;

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


        const USER_PROMPT = prompt

        const completion = await chatCompletion({ system_prompt: SYSTEM_PROMPT, user_prompt: USER_PROMPT, model: 'gpt-3.5-turbo' });
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
    
    const directoryPath = path.join(__dirname, '/')
    customWriteFile({ directoryPath, fileName: 'template', content: dom.serialize(), mime: 'html' })

    return {
        msg: 'create landing page ai',
        total_tokens_1: total_tokens_createBase,
        total_tokens_2: total_tokens_createContent,
    }
}