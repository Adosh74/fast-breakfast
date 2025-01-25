import { config } from 'dotenv';

config();

const { NODE_ENV, PORT, MONGO_URI, MONGO_TEST_URI, JWT_KEY, PEPPER } = process.env;

if (!JWT_KEY || !PEPPER || !MONGO_URI || !MONGO_TEST_URI || !PORT || !NODE_ENV) {
	throw new Error('Some environment variables are missing');
}

interface ServerEnv {
	nodeEnv: string;
	port: string;
	mongoURI: string;
	mongoTestURI: string;
	jwtKey: string;
	pepper: string;
}

const serverEnv: ServerEnv = {
	nodeEnv: NODE_ENV,
	port: PORT,
	mongoURI: MONGO_URI,
	mongoTestURI: MONGO_TEST_URI,
	jwtKey: JWT_KEY,
	pepper: PEPPER,
};

export { serverEnv };
