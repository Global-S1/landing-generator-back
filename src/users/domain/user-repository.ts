import { type UserEntity } from './user-entity';

export interface IUserRepository {
	create: (newUser: UserEntity) => Promise<UserEntity | null>;

	findByEmail: (email: string) => Promise<UserEntity | null>;

	findByUid: (uid: string) => Promise<UserEntity | null>;
}