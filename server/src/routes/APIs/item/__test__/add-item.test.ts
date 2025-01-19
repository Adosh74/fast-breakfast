import request from 'supertest';
import { app } from '../../../../app';
import { it, expect } from '@jest/globals';

it('returns a 201 on successful item creation', async () => {
	const response = await request(app)
		.post('/api/items')
		.send({
			name: 'Test Item',
			price: 100,
			avatar: 'http://example.com/avatar.png',
		})
		.expect(201);

	expect(response.body.name).toEqual('Test Item');
	expect(response.body.price).toEqual(100);
	expect(response.body.avatar).toEqual('http://example.com/avatar.png');
});

it('returns a 400 with an invalid name', async () => {
	await request(app)
		.post('/api/items')
		.send({
			name: 123,
			price: 100,
			avatar: 'http://example.com/avatar.png',
		})
		.expect(400);
});

it('returns a 400 with an invalid price', async () => {
	await request(app)
		.post('/api/items')
		.send({
			name: 'Test Item',
			price: 'invalid-price',
			avatar: 'http://example.com/avatar.png',
		})
		.expect(400);
});

it('returns a 400 with an invalid avatar', async () => {
	await request(app)
		.post('/api/items')
		.send({
			name: 'Test Item',
			price: 100,
			avatar: 123,
		})
		.expect(400);
});

it('returns a 400 with missing required fields', async () => {
	await request(app).post('/api/items').send({}).expect(400);
});
