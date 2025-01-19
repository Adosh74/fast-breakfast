import { Router, Request, Response } from 'express';
import { Item } from '../../../models/item';

const router = Router();

router.get('/', [
	async (_req: Request, res: Response) => {
		const items = await Item.find({});

		res.status(200).send(items);
	},
]);

export { router as itemsListRouter };
