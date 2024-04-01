import { Schema, model } from 'mongoose';

const templateSchema = new Schema({
	id: { type: String, required: true, unique: true },
	data: { type: String, required: true },
});

export default model('Template', templateSchema);