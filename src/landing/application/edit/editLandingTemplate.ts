import { getElementInfo, getSectionsFromLanding } from "../../../helpers";
import { NotFoundError } from "../../../utils/errors";
import { ElementToEdit, ILandingRepository } from "../../domain";
import { JSDOM } from 'jsdom';

interface Args {
    id: string,
    editedTemplate: string,
}
export const editLandingTemplate = async (
    landingRepository: ILandingRepository,
    { id, editedTemplate }: Args
) => {

    const landing = await landingRepository.findOneById(id);
    if (!landing) throw new NotFoundError('landing not exist');

    const dom = new JSDOM(editedTemplate)
    const document = dom.window.document

    //Actualizar secciones
    const sectionsId = getSectionsFromLanding(editedTemplate);
    const sections: { [id: string]: ElementToEdit[] } = {}

    sectionsId.forEach(id => {
        const sectionDOM = document.getElementById(id);
        const sectionElements: ElementToEdit[] = []
        if (sectionDOM) {
            getElementInfo(sectionDOM, sectionElements);
        }

        sections[id] = sectionElements
    })
const newTemplate = dom.serialize();
    const updatedLanding = await landingRepository.update(id, { 
        sections, 
        template: newTemplate,
        history:[...landing.history, newTemplate],
     })

    return updatedLanding
};