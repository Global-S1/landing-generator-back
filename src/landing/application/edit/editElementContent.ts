import { NotFoundError } from "../../../utils/errors";
import { ILandingRepository } from "../../domain"
import { EditElementContentDto } from "../interfaces"
import { JSDOM } from 'jsdom';

export const editElementContent = async (
    landingRepository: ILandingRepository,
    landingId: string,
    { sectionId = 'hero', tagName, oldText, newText, img, link }: EditElementContentDto
) => {

    const landing = await landingRepository.findOneById(landingId)
    if (!landing) throw new NotFoundError('landing not exist');

    const dom = new JSDOM(landing.template)
    const document = dom.window.document
    const sections = landing.sections

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
            if (oldValues.href === href || element.textContent?.trim() === oldValues.text) {
                element.setAttribute("href", newValues.href)
                element.textContent = newValues.text

                sections[sectionId].forEach(element => {
                    if (element.attributes['href'] === oldValues.href) {
                        element.attributes['href'] = newValues.href
                    }
                    if (element.text === oldValues.text) {
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
    const updatedLanding = await landingRepository.update(landingId, {
        template: newTemplate,
        sections
    })

    return updatedLanding
}