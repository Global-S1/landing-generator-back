export interface EditElementContentDto {
    sectionId: string;
    tagName: string;
    oldText: string;
    newText: string
    img?: {
        oldValues: OldImgValues;
        newValues: NewImgValues;
    },
    link?: {
        oldValues: OldLinkValues;
        newValues: NewLinkValues;
    }
}
export interface EditElementContentTestDto {
    sectionId: string;
    tagName: string;
    newText: string;
    data_id: string
}

interface OldImgValues {
    src: string;
    alt: string;
}

interface NewImgValues {
    src: string;
    alt: string;
}
interface OldLinkValues {
    text: string;
    href: string;
}

interface NewLinkValues {
    text: string;
    href: string;
}