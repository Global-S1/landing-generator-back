import { NotFoundError } from "../../../utils/errors";
import { ILandingRepository } from "../../domain"
import { EditElementContentDto } from "../interfaces"
import { JSDOM } from 'jsdom';

export const editElementContent = async (
    landingRepository: ILandingRepository,
    landingId: string,
    { sectionId = 'hero', newText, data_id, img, link }: EditElementContentDto
) => {

    const landing = await landingRepository.findOneById(landingId);
    if (!landing) throw new NotFoundError('landing not exist');

    
    const dom = new JSDOM(landing.template)
    const document = dom.window.document
    const sections = landing.sections
    
    const section = document.getElementById(sectionId)
    const $element = section?.querySelector(`[data-id="${data_id}"]`)

    if($element?.tagName.toLowerCase() === 'img' && img){

        $element.setAttribute("alt", img.alt);
        $element.setAttribute("src", img.src);
        for (let element of sections[sectionId]) {
            if(element.id === data_id){
                element.attributes['alt'] = img.alt;
                element.attributes['src'] = img.src;
            }
        }
    }
    else if($element?.tagName.toLowerCase() === 'a' && link){
        
        $element.textContent = link.text;
        $element.setAttribute("href", link.href);
        
        for (let element of sections[sectionId]) {
            if(element.id === data_id){
                element.attributes['href'] = link.href;
                element.text = link.text
            }
        }
    }
    else {
        $element!.textContent = newText.trim();
        
        for (let element of sections[sectionId]) {
            if (element.id === data_id) {
                element.text = newText
            }
        }
    }
    const newTemplate = dom.serialize()
    const history = [...landing.history, newTemplate]
    console.log(history.length)
    const updatedLanding = await landingRepository.update(landingId, {
        template: newTemplate,
        history,
        sections
    })

    return updatedLanding
}