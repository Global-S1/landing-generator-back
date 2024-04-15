export interface LandingEntity {
    id: string;
    title: string;
    initial_prompt: string;
    template: string;
    history: string[];
    sections: Sections,
    total_tokens: number;
    // type: string;

    user_id: string
}
export interface Sections { [id: string]: ElementToEdit[] }


export interface ElementToEdit {
    id: string;
    tagName: string;
    type: string;
    text: string;
    attributes: { [key: string]: string };
    // status: true | false
}