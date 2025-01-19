import request from 'supertest';
import { app } from '../../../../app'; // Assuming you have an Express app instance exported from app.ts
import { Item } from '../../../../models/item';
import { itemsListRouter } from '../items-list';
import { describe, expect, it, jest } from '@jest/globals';

app.use('/api/items', itemsListRouter);

describe('GET /api/items', () => {
	it('should return a list of items', async () => {
		const items = [
			{ name: 'Item 1', price: 100 },
			{ name: 'Item 2', price: 200 },
		];

		// Mock the Item.find method to return the items array
		jest.spyOn(Item, 'find').mockResolvedValueOnce(items);

		const response = await request(app).get('/api/items');

		expect(response.status).toBe(200);
		expect(response.body).toEqual(items);
	});

	it('should return an empty list if no items are found', async () => {
		// Mock the Item.find method to return an empty array
		jest.spyOn(Item, 'find').mockResolvedValueOnce([]);

		const response = await request(app).get('/api/items');

		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);
	});
});
