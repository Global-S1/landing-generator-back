import { classifyTypeElement } from "./classifyTypeElement";

export interface ElementToEdit {
    tagName: string;
    type: string;
    text: string;
    attributes: { [key: string]: string };
}

export type ElementType = 'title' | 'subtitle' | 'description' | 'img' | 'link'

const validTagName: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'img']

export const getElementInfo = (element: Element, array: ElementToEdit[]) => {

    const elementeToEdit: ElementToEdit = {
        tagName: element.tagName,
        type: classifyTypeElement(element.tagName),
        text: "",
        attributes: {}
    }

    // Obtener texto solo si el elemento no tiene elementos hijos
    if (!element.children || element.children.length === 0) {
        elementeToEdit.text = element.textContent!.trim();
        if (validTagName.includes(element.tagName.toLocaleLowerCase())) {

            array.push(elementeToEdit)
        }
    }

    // Obtener atributos del elemento
    for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        elementeToEdit.attributes[attribute.nodeName] = attribute.nodeValue ?? '';
    }
    // Obtener información de los elementos
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        getElementInfo(child, array)
    }
};
