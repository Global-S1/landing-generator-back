export interface ElementorTemplate {
    title: string;
    content: ElementorElement[];
    page_settings: { [key: string]: any };
    version: string;
    type: string;
}
export interface ElementorElement {
    id: string;
    settings: {};
    elements: ElementorElement[];
    // isInner: boolean; // false
    // elType: string // container
}

export interface ElementSettings {
    tagName: string;
    attributes: { [key: string]: string };
}
