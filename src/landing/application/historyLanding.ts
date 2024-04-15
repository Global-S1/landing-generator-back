import { getElementInfo } from "../../helpers";
import { NotFoundError } from "../../utils/errors";
import { ElementToEdit, ILandingRepository } from "../domain"
import { JSDOM } from 'jsdom';

export const historyLanding = async (landingRepository: ILandingRepository, id: string) => {

    const landing = await landingRepository.findOneById(id);

    if (!landing) throw new NotFoundError('landing not exist');

    const newHistory = landing.history.slice(0, -1);
    const lastTemplate = newHistory[newHistory.length - 1];

    const dom = new JSDOM(lastTemplate);
    const document = dom.window.document;

    const sections: { [id: string]: ElementToEdit[] } = {};
    const sectionsId = Object.keys(landing.sections);

    sectionsId.forEach(id => {
        const sectionDOM = document.getElementById(id);
        const sectionElements: ElementToEdit[] = []
        if (sectionDOM) {
            getElementInfo(sectionDOM, sectionElements);
        }

        sections[id] = sectionElements;
    })

    const newData = {
        history: [...newHistory],
        template: dom.serialize(),
        sections
    }

    const updatedLanding = await landingRepository.update(id, newData)

    return updatedLanding
}