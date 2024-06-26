import bcryptjs from 'bcryptjs';
import { UserEntity, IUserRepository } from '../../domain';
import UserSchema from './user-schema';

export class MongoUserRepository implements IUserRepository {
	private static instance: MongoUserRepository | null = null;

	private constructor() { }

	static getInstance() {
		if (!MongoUserRepository.instance) {
			MongoUserRepository.instance = new MongoUserRepository();
		}
		return MongoUserRepository.instance;
	}

	async findByUid(uid: string) {
		const user = await UserSchema.findOne<UserEntity>({ uid });

		return user;
	}

	async findByEmail(email: string) {
		const user = await UserSchema.findOne<UserEntity>({ email });

		return user;
	}

	async create(newUser: UserEntity) {
		const user = await UserSchema.create(newUser);

		const salt = bcryptjs.genSaltSync(10);
		user.password = bcryptjs.hashSync(user.password, salt);

		await user.save();

		return user as unknown as UserEntity;
	}
}