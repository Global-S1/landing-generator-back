import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	uid: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	image: { type: String, default: '' }
});

export default model('User', userSchema);