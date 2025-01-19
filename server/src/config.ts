import { config } from 'dotenv';

config();

const { NODE_NEV, PORT, MONGO_URI, MONGO_TEST_URI, JWT_KEY, PEPPER } = process.env;

if (!JWT_KEY || !PEPPER || !MONGO_URI || !MONGO_TEST_URI || !PORT || !NODE_NEV) {
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
	nodeEnv: NODE_NEV,
	port: PORT,
	mongoURI: MONGO_URI,
	mongoTestURI: MONGO_TEST_URI,
	jwtKey: JWT_KEY,
	pepper: PEPPER,
};

export { serverEnv };
