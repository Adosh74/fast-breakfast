import mongoose from 'mongoose';
import { app } from './app';
import { config } from 'dotenv';

config();

(async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI!);
		console.log('Connected to MongoDB', connection.connection.db?.databaseName);
	} catch (err) {
		console.error(err);
	}

	app.listen(process.env.PORT!, () => {
		console.log(`Server listening on port ${process.env.PORT}!!!!`);
	});
})();
