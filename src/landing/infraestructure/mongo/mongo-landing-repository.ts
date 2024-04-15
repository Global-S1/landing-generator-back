import { ILandingRepository, LandingEntity, Sections } from '../../domain';
import { UpdateLandingDto } from '../../domain/landing-dto';
import landingSchema from './landing-schema';
import LandingSchema from './landing-schema'

export class MongoLandingRepository implements ILandingRepository {
    async create(newLanding: LandingEntity): Promise<LandingEntity | null> {
        const landing = await LandingSchema.create(newLanding)

        return landing
    }

    async findOneById(id: string): Promise<LandingEntity | null> {
        const landing = await LandingSchema.findOne({ id })

        return landing
    }
    async findLandingsByUserId(userId: string): Promise<LandingEntity[] | null> {
        const landings = await LandingSchema.find({ user_id: userId })

        return landings
    }
    async update(landingId: string, { template, total_tokens, sections, history, title }: UpdateLandingDto): Promise<LandingEntity> {

        const data = {
            title,
            template,
            total_tokens,
            sections,
            history
        }
        
        const updatedLanding = await landingSchema.findOneAndUpdate({id:landingId}, data, { new: true });
        return updatedLanding as LandingEntity;
    }

}