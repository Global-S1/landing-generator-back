export interface EditElementContentDto {
    sectionId: string;
    data_id: string;
    newText: string;
    img?: {
        src: string;
        alt: string;
    },
    link?: {
        text: string;
        href: string;
    }
}