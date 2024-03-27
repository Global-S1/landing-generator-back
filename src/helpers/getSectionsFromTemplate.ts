import { JSDOM } from 'jsdom'
import { SectionType } from '../interfaces'

export const SectionsLanding: SectionType[] = ['header' , 'hero' , 'faq' , 'features' , 'pricing' , 'testimonials' , 'about' , 'contact' , 'cta' , 'footer']

export const getSectionsFromLanding = (template_html: string): SectionType[] => {
    const dom = new JSDOM(template_html)
    const document = dom.window.document

    const idsFromDocument: string[] = []
    document.querySelectorAll('[id]').forEach((element) => {
        idsFromDocument.push(element.id)
    })

    const sections= idsFromDocument.filter(id => SectionsLanding.includes(id as SectionType)) as SectionType[]
    return sections
}
