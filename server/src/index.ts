import mongoose from 'mongoose';
import { app } from './app';
import { serverEnv } from './config';
import { LOGGER } from './logging';

(async () => {
	try {
		const connection = await mongoose.connect(serverEnv.mongoURI);
		LOGGER.info('Connected to MongoDB', connection.connection.db?.databaseName);
	} catch (err) {
		LOGGER.error(err);
		process.exit(1);
	}

	app.listen(serverEnv.port, () => {
		LOGGER.info(`Server listening on port ${serverEnv.port}!!!!`);
	});
})();
