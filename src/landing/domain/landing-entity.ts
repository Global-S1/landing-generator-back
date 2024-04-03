export interface LandingEntity {
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
    tagName: string;
    type: string;
    text: string;
    attributes: { [key: string]: string };
}