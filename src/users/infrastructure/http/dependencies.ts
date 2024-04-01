import { UserUseCase } from '../../application/user-use-case';
import { MongoUserRepository } from '../mongo/mongo-user-repository';
import { UserController } from './user-controller';

const userRepo = MongoUserRepository.getInstance();
const userUseCase = new UserUseCase(userRepo);

export const userCtrl = new UserController(userUseCase);