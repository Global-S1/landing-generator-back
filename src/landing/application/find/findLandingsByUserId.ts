import { ILandingRepository } from "../../domain";

export const findLandingsByUserId = async (landingRepository: ILandingRepository, userId: string) => {

    const landings = await landingRepository.findLandingsByUserId(userId);

    return landings
}
