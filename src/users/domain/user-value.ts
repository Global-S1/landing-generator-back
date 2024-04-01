import { v4 as uuid } from 'uuid';
import { type UserEntity } from './user-entity';

export class UserValue implements UserEntity {
	uid: string;
	name: string;
	email: string;
	password: string;
	image: string;

	constructor({
		name,
		email,
		password,
		image
	}: {
		name: string;
		email: string;
		password: string;
		image?: string;
	}) {
		this.uid = uuid();
		this.name = name;
		this.email = email;
		this.password = password;
		this.image = image ?? '';
	}
}