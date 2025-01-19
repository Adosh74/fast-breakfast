import { serverEnv } from '../config';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';

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
	await mongoose.connect(serverEnv.mongoTestURI);
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
