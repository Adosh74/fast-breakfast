import request from 'supertest';
import { app } from '../../../app';

it('clear the cookie after signing out', async () => {
	const signupResponse = await request(app)
		.post('/api/users/signup')
		.send({
			name: 'Test User',
			email: 'signout@test.com',
			password: 'password1234',
		})
		.expect(201);

	const response = await request(app).post('/api/users/signout').send({});

	const cookie = response.get('Set-Cookie');
	if (!cookie) {
		throw new Error('Expected cookie but got undefined.');
	}

	expect(cookie[0]).toEqual(
		'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
	);
});
