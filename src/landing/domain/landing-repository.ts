import { UpdateLandingDto } from "./landing-dto";
import { LandingEntity, Sections } from "./landing-entity";

export interface ILandingRepository {
    create: (landing: LandingEntity) => Promise<LandingEntity | null>;

    findOneById: (id: string) => Promise<LandingEntity | null>;

    findLandingsByUserId: (userId: string) => Promise<LandingEntity[] | null>;

    update: (id: string, data: UpdateLandingDto) => Promise<LandingEntity>;
}