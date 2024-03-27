import fs from 'fs'
import path from 'path'
import { getSectionsFromLanding } from './getSectionsFromTemplate'
import { NotFoundError } from '../utils/errors'
import { SectionType } from '../interfaces'

const templatesPath = path.join(__dirname, '../templates')

export const searchTemplate = (templateOption: number): { template_html: string, sectionsId: SectionType[] } => {
    const options: number[] = [] // [1, 2, 3]

    // crear opciones por cada template dentro de la carpeta
    fs.readdirSync(templatesPath).forEach(( _ , idx ) => options.push( idx + 1 ))

    if (!options.includes(templateOption)) throw new NotFoundError(`there's not a template with the option: ${templateOption}`)

    const template_path = path.join(`${templatesPath}/landing-${templateOption}/index.html`)
    const template_html = fs.readFileSync(template_path, 'utf8')
    const sectionsId = getSectionsFromLanding(template_html)

    return {
        template_html,
        sectionsId
    }
}
