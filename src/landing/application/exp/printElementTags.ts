export const printElementTags = (element: Element) => {
    console.log(element.tagName);

    // Recorrer los hijos del elemento
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];

        printElementTags(child);
    }
};