import { LandingEntity } from "./landing-entity";

export interface UpdateLandingDto extends Partial<Omit<LandingEntity, 'id' | 'user_id'>> { }