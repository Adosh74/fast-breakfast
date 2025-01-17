import mongoose from 'mongoose';
import request from 'supertest';
import { config } from 'dotenv';
config();

import { app } from '../app';

interface GlobalSigninOutput {
	cookie: string[];
	user: {
		name: string;
		email: string;
		password: string;
	};
}

declare global {
	var signin: () => Promise<GlobalSigninOutput>;
}

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf';
	process.env.NODE_ENV = 'test';
	await mongoose.connect(process.env.MONGO_TEST_URI!);
});

beforeEach(async () => {
	if (mongoose.connection.db) {
		const collections = await mongoose.connection.db.collections();
		for (let collection of collections) {
			await collection.deleteMany({});
		}
	}
});

afterAll(async () => {
	await mongoose.connection.close();
});

global.signin = async () => {
	const userData = {
		name: 'Test User',
		email: 'signin@test.com',
		password: 'password',
	};
	const response = await request(app)
		.post('/api/users/signup')
		.send(userData)
		.expect(201);

	const cookie = response.get('Set-Cookie');

	if (!cookie) {
		throw new Error('Expected cookie but got undefined.');
	}

	return {
		cookie,
		user: userData,
	};
};
