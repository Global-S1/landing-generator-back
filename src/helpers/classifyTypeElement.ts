import { ElementType } from "./getElementInfo"

export const classifyTypeElement = (tagName: string): string => {
    let elementeType: ElementType = 'description'

    const subtitleTags = ['h2', 'h3', 'h4', 'h5', 'h6',]
    if ('h1' === tagName.toLowerCase()) {
        elementeType = 'title'
    }
    if (subtitleTags.includes(tagName.toLowerCase())) {
        elementeType = 'subtitle'
    }
    if ('a' === tagName.toLowerCase()) {
        elementeType = 'link'
    }
    if ('img' === tagName.toLowerCase()) {
        elementeType = 'img'
    }

    return elementeType
}
