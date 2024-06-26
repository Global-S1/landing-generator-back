import bcryptjs from 'bcryptjs';
import { UserValue, IUserRepository, CreateUserDto, LoginUserDto } from '../domain';
import { NotFoundError, ValidationError } from '../../utils/errors';
// import { generateJWT } from '../../helpers/generate-jwt';

export class UserUseCase {
	constructor(private readonly userRepository: IUserRepository) { }

	public register = async (newUser: CreateUserDto) => {
		const userValue = new UserValue(newUser);

		const emailExist = await this.userRepository.findByEmail(userValue.email);

		if (emailExist) throw new ValidationError('The email is already registered');

		const user = await this.userRepository.create(userValue);

		//const token = await generateJWT(user!.uid);

		return {
			uid: user!.uid,
			name: user!.name,
			email: user!.email,
			image: user!.image,
			//token
		};
	};

	public login = async ({ email, password }: LoginUserDto) => {
		const user = await this.userRepository.findByEmail(email);

		if (!user) throw new NotFoundError('User not exist');

		const validatePassword = bcryptjs.compareSync(password, user.password);

		if (!validatePassword)
			throw new ValidationError('Bad credentials - password');

		// const token = await generateJWT(user.uid);

		return {
			uid: user.uid,
			name: user.name,
			email: user.email,
			image: user.image,
			// token
		};
	};

	public findByUid = async (uid: string) => {
		const user = await this.userRepository.findByUid(uid);

		if (!user) throw new NotFoundError('User not exist');

		return user;
	};

	public revalidateJwt = async (uid: string) => {
		const user = await this.userRepository.findByUid(uid);

		if (!user) throw new NotFoundError('User not exist');

		// const token = await generateJWT(user.uid);

		return {
			uid: user.uid,
			name: user.name,
			email: user.email,
			image: user.image,
			//token
		};
	};
}