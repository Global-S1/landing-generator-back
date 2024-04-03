import { v4 as uuid } from 'uuid'
import { LandingEntity, Sections } from './landing-entity';

interface ILandingValue extends Omit<LandingEntity, 'id'> {}

export class LandingValue implements LandingEntity {
    id: string;
    initial_prompt: string;
    template: string;
    history: string[];
    sections: Sections;
    total_tokens: number;

    user_id: string;

    constructor({
        initial_prompt,
        template,
        history,
        sections,
        total_tokens,
        user_id
    }: ILandingValue) {
        this.id = uuid();
        this.initial_prompt = initial_prompt;
        this.template = template;
        this.history = history;
        this.sections = sections;
        this.total_tokens = total_tokens;

        this.user_id = user_id;
    }
}