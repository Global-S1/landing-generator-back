import { DB } from "../../db";
import { JSDOM } from 'jsdom';
import { NextFunction, Request, Response } from "express";
import { getSectionsFromLanding } from "../../helpers/getSectionsFromTemplate";
import { ElementToEdit, getElementInfo } from "../../helpers/getElementInfo";
import { EditElementContentDto } from "../dto";

const db = new DB();

//* Cambio realizado de sections a sectionsId 
export const getSectionsElementsCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const template = await db.getTemplate();
        const document = new JSDOM(template.data).window.document;
        const sectionIds = getSectionsFromLanding(template.data);

        const id = sectionIds[1]
        const sections: { [id: string]: ElementToEdit[] } = {}

        const sectionDOM = document.getElementById(id);
        const sectionElements: ElementToEdit[] = []
        if (sectionDOM) {
            getElementInfo(sectionDOM, sectionElements);
        }

        sections[id] = sectionElements

        return res.json({
            sections
        });
    } catch (error) {
        next(error);
    }
};

export const updateSectionElementsCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const template = await db.getTemplate();
        const document = new JSDOM(template.data).window.document;
        const sectionIds = getSectionsFromLanding(template.data);

        const sections: { [id: string]: ElementToEdit[] } = {}

        sectionIds.forEach(id => {
            const sectionDOM = document.getElementById(id);
            const sectionElements: ElementToEdit[] = []
            if (sectionDOM) {
                getElementInfo(sectionDOM, sectionElements);
            }

            sections[id] = sectionElements
        })

        await db.saveSections(sections)

        return res.json({
            sections
        });
    } catch (error) {
        next(error);
    }
}

export const editElementContent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { sectionId = 'hero', tagName, oldText, newText, img, link } = req.body as EditElementContentDto

    try {
        const { data, sections } = await db.getTemplate()
        const dom = new JSDOM(data)
        const document = dom.window.document

        const section = document.getElementById(sectionId)

        const $elements = section?.querySelectorAll(tagName.toLowerCase())

        if (tagName.toLowerCase() === 'img' && img) {

            const { oldValues, newValues } = img

            $elements?.forEach(element => {
                const src = element.getAttribute('src')
                const alt = element.getAttribute('alt')
                if (oldValues.src === src) {
                    element.setAttribute("src", newValues.src)
                    element.setAttribute("alt", newValues.alt)
                    sections[sectionId].forEach(element => {
                        if (element.attributes['src'] === oldValues.src) {
                            element.attributes['src'] = newValues.src
                        }
                        if (element.attributes['alt'] === oldValues.alt) {
                            element.attributes['alt'] = newValues.alt
                        }
                    })
                }
            })

        } else if (tagName.toLowerCase() === 'a' && link) {

            const { oldValues, newValues } = link

            $elements?.forEach(element => {
                const href = element.getAttribute('href')
                console.log(element.textContent)
                if (oldValues.href === href || element.textContent?.trim() === oldValues.text){
                    element.setAttribute("href", newValues.href)
                    element.textContent = newValues.text

                    sections[sectionId].forEach(element => {
                        if (element.attributes['href'] === oldValues.href) {
                            element.attributes['href'] = newValues.href
                        }
                        if(element.text === oldValues.text){
                            element.text = newValues.text
                        }

                    })
                }
            })

        }
        else {
            $elements?.forEach(element => {

                if (element.textContent?.trim() === oldText.trim()) {
                    element.textContent = newText.trim()
                    sections[sectionId].forEach(element => {
                        if (element.text === oldText) {
                            element.text = newText
                        }
                    })
                }
            })
        }

        const newTemplate = dom.serialize()
        await db.saveTemplate(newTemplate, 0)
        await db.saveSections(sections)

        res.json({
            data: newTemplate,
            sections
        })
    } catch (error) {
        next(error)
    }

}