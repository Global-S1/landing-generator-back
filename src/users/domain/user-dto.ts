import { type UserEntity } from './user-entity';

export interface CreateUserDto extends Omit<UserEntity, 'id'> {}

export interface LoginUserDto extends Pick<UserEntity, 'email' | 'password'> {}