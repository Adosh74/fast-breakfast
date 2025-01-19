import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../../middlewares/validate-request';
import { Item } from '../../../models/item';

const router = Router();

router.post(
	'/',
	[
		body('name').isString().withMessage('Name must be a string'),
		body('price').isNumeric().withMessage('Price must be a number'),
		body('avatar').optional().isString().withMessage('Avatar must be a string'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, price, avatar } = req.body;

		const item = Item.build({ name, price, avatar });

		await item.save();

		res.status(201).send(item);
	}
);

export { router as addItemRouter };
