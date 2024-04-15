import { LandingEntity } from "./landing-entity";

export interface UpdateLandingDto extends Partial<Omit<LandingEntity, 'id' | 'user_id'>> { }
export interface CreateLandingDto {
    user_id: string;
    prompt: string;
    title: string
}