import mongoose from 'mongoose';

export const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_CNN!);
		console.log('DB connected');
	} catch (error) {
		throw new Error('Error en la conexión');
	}
};