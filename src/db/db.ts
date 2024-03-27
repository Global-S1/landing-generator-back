import fs from "fs"
import path from "path"
import { JSDOM } from "jsdom"
import { ElementToEdit, getElementInfo } from "../helpers/getElementInfo";

interface DBInterface {
    initial_prompt: string;
    template: string;
    history: string[];
    sections: Sections,
    total_tokens: number;
    type: string;
    styles: {};
}

interface Sections { [id: string]: ElementToEdit[] }

export class DB {
    private filepath = path.join(__dirname, 'landing_page.json');
    constructor() { }

    private async getData() {
        const data = await fs.promises.readFile(this.filepath, 'utf8')
        const jsonData: DBInterface = JSON.parse(data)
        return jsonData
    }

    async getTemplate() {
        const data = await fs.promises.readFile(this.filepath, 'utf8')
        const jsonData: DBInterface = JSON.parse(data)
        return {
            data: jsonData.template,
            sections: jsonData.sections
        }
    }

    async earlierVersion() {
        const LANDING_PAGE_DATA = await this.getData()
        const newHistory = LANDING_PAGE_DATA.history.slice(0, -1)
        const newTemplate = newHistory[newHistory.length - 1]

        const dom = new JSDOM(newTemplate)
        const document = dom.window.document

        const sections: { [id: string]: ElementToEdit[] } = {}
        const sectionsId = Object.keys(LANDING_PAGE_DATA.sections)

        sectionsId.forEach(id => {
            const sectionDOM = document.getElementById(id);
            const sectionElements: ElementToEdit[] = []
            if (sectionDOM) {
                getElementInfo(sectionDOM, sectionElements);
            }

            sections[id] = sectionElements
        })

        const newData: DBInterface = {
            ...LANDING_PAGE_DATA,
            history: [...newHistory],
            template: newTemplate,
            sections
        }

        await fs.promises.writeFile(this.filepath, JSON.stringify(newData, null, 2), 'utf8')
    }

    async getInitialPrompt() {
        const data = await fs.promises.readFile(this.filepath, 'utf8')
        const jsonData: DBInterface = JSON.parse(data)
        return jsonData.initial_prompt
    }

    async saveInitialPrompt(prompt: string) {
        const LANDING_PAGE_DATA = await this.getData()

        const newData: DBInterface = {
            ...LANDING_PAGE_DATA,
            initial_prompt: prompt
        }
        await fs.promises.writeFile(this.filepath, JSON.stringify(newData, null, 2), 'utf8')
    }

    async saveTemplate(template: string, tokens: number) {
        const LANDING_PAGE_DATA = await this.getData()


        // Guardar solo 3 vesiones
        const newHistory = [...LANDING_PAGE_DATA.history, template].slice(-3)

        const newData: DBInterface = {
            ...LANDING_PAGE_DATA,
            template,
            history: newHistory,
            total_tokens: LANDING_PAGE_DATA.total_tokens + tokens
        }
        await fs.promises.writeFile(this.filepath, JSON.stringify(newData, null, 2), 'utf8')
    }

    async saveSections(sections: Sections) {
        const LANDING_PAGE_DATA = await this.getData()

        const newData: DBInterface = {
            ...LANDING_PAGE_DATA,
            sections
        }

        await fs.promises.writeFile(this.filepath, JSON.stringify(newData, null, 2), 'utf8')
    }

    async reset() {
        const data: DBInterface = {
            initial_prompt: "",
            template: "",
            history: [],
            sections: {},
            total_tokens: 0,
            type: "",
            styles: {}
        }
        await fs.promises.writeFile(this.filepath, JSON.stringify(data, null, 2), 'utf8')
    }
}