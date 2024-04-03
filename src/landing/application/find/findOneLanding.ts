import { NotFoundError } from "../../../utils/errors";
import { ILandingRepository } from "../../domain";

export const findOneLanding = async (
    landingRepository: ILandingRepository,
    id: string
) => {
    const landing = await landingRepository.findOneById(id);
    if (!landing) throw new NotFoundError('landing not exist');
    return landing;
};