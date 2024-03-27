import path from 'path'
import { NextFunction, Request, Response } from "express";
import { JSDOM } from 'jsdom'
import { customWriteFile } from "../../helpers/custom-write-file";
import { searchTemplate } from '../../helpers/searchTemplate';
import { chatCompletion } from '../../helpers/chat-completion';
import { DB } from '../../db';
import { NotAcceptable, NotFoundError } from '../../utils/errors';
import { ElementToEdit, getElementInfo } from '../../helpers/getElementInfo';
import { getSectionsFromLanding } from '../../helpers/getSectionsFromTemplate';

const db = new DB()
const templatesDirectory = '../../generated-templates/'

export const existTemplateCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const template = await db.getTemplate()
        if (!template) {
            throw new NotFoundError("There's not a template")
        }

        res.json({
            msg: 'there is template',
            template: template.data,
            sections: template.sections
        })
    } catch (error) {
        next(error)
    }
}

export const createBasicLandingCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { prompt, template_option } = req.body as { prompt: string, template_option: number }

    try {
        const templateExist = await db.getTemplate()
        if (templateExist.data) throw new NotAcceptable("There's a template")

        const { template_html, sectionsId } = searchTemplate(template_option)
        const dom = new JSDOM(template_html)
        const document = dom.window.document

        // cada elemento será el total_tokens de cada sección generada
        const tokens_section: number[] = []

        for (let section of sectionsId) {
            console.log(`...cargando section ${section}`)
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
            For images, if the images of this section have a URL in its src attribute, that is different from placeholder images, leave it, if it doesn't, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`

            //* OpenAi
            const data = await chatCompletion({ system_prompt: SYSTEM_PROMPT, user_prompt: prompt, model: 'gpt-3.5-turbo' })

            if (data.error) {
                console.log(data);
                break
            }

            tokens_section.push(data.usage.total_tokens)
            const newSection = data.choices[0].message.content

            if ($oldSection) {
                $oldSection.outerHTML = newSection
            }

            //! tiempo de espera necesario en el tier gratuito
            //! await new Promise(resolve => setTimeout(resolve, 10000))
        }

        //* Agregar objeto con los elementos de las secciones
        const sections: { [id: string]: ElementToEdit[] } = {}

        sectionsId.forEach(id => {

            const sectionDOM = document.getElementById(id);
            const sectionElements: ElementToEdit[] = []
            if (sectionDOM) {
                getElementInfo(sectionDOM, sectionElements);
            }

            sections[id] = sectionElements
        })

        const total_tokens = tokens_section.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        await db.saveInitialPrompt(prompt)
        await db.saveTemplate(dom.serialize(), total_tokens)
        await db.saveSections(sections)
        const directoryPath = path.join(__dirname, templatesDirectory)
        customWriteFile({ fileName: 'template', content: dom.serialize(), mime: 'html', directoryPath: directoryPath })

        res.json({
            usage: {
                tokens_section,
                total_tokens
            },
            sections,
            data: dom.serialize()
        })
    } catch (error) {
        next(error)
    }
}

export const editSectionCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { prompt, section } = req.body as { prompt: string, section: string }
    try {
        const { data } = await db.getTemplate()

        const dom = new JSDOM(data)
        const document = dom.window.document
        const $oldSection = document.getElementById(section)
        if (!$oldSection) throw Error("this section do not exist")

        const initial_prompt = await db.getInitialPrompt()

        const SYSTEM_PROMPT = `You are an expert landing page developer using HTML with a tailwind. You are capable of creating incredible components
        The user will tell you the description to improve the ${section} of their landing page, and you will generate the changes.
        
        This is the template of the section ${$oldSection.outerHTML}
        The general content of the landing page is: ${initial_prompt}, with this information you can have more context and generate the changes that the user wants in the respective section.
        
        The content must be in the Spanish language
        Returns the template that with the respective change in the section. 
        Just deliver the code, do not generate extra text or explanations.
        DO NOT include markdown "\`\`\`" or "\`\`\`html" at the start or end.
        For images, if the images have a URL in its src attribute use that, if it doesn't, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`
        // For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.`

        const completion = await chatCompletion({ system_prompt: SYSTEM_PROMPT, user_prompt: prompt, model: 'gpt-4-0125-preview' })

        if (completion.error) {
            console.log(data);
        }

        const newSection = completion.choices[0].message.content
        $oldSection.outerHTML = newSection

        //Actualizar secciones
        const sectionIds = getSectionsFromLanding(data);
        const sections: { [id: string]: ElementToEdit[] } = {}

        sectionIds.forEach(id => {
            const sectionDOM = document.getElementById(id);
            const sectionElements: ElementToEdit[] = []
            if (sectionDOM) {
                getElementInfo(sectionDOM, sectionElements);
            }

            sections[id] = sectionElements
        })

        await db.saveTemplate(dom.serialize(), completion.usage.total_tokens)
        await db.saveSections(sections)

        const directoryPath = path.join(__dirname, templatesDirectory)
        customWriteFile({ fileName: 'template', content: dom.serialize(), mime: 'html', directoryPath: directoryPath })

        res.json({
            usage: completion.usage,
            data: dom.serialize(),
            sections
        })

    } catch (error) {
        next(error)
    }
}

export const editTemplateCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { template } = req.body as { template: string }

    try {

        await db.saveTemplate(template, 0)
        const sectionsId = getSectionsFromLanding(template)
        const dom = new JSDOM(template)
        const document = dom.window.document

        // Agregar objeto con los elementos de las secciones
        const sections: { [id: string]: ElementToEdit[] } = {}

        await sectionsId.forEach(id => {

            const sectionDOM = document.getElementById(id);
            const sectionElements: ElementToEdit[] = []
            if (sectionDOM) {
                getElementInfo(sectionDOM, sectionElements);
            }

            sections[id] = sectionElements
        })

        await db.saveSections(sections)
        console.log('Template editado')

        res.json({
            sections,
            data: dom.serialize()
        })
    } catch (error) {
        next(error)
    }
}

export const resetCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await db.reset()

        res.json({
            msg: 'landing deleted'
        })

    } catch (error) {
        next(error)
    }
}
