import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../../../middlewares/validate-request';
import { NotFound } from '../../../errors/not-found-error';
import { Item } from '../../../models/item';

const router = Router();

router.put(
	'/:id',
	[
		param('id').isMongoId().withMessage('Item ID must be a valid MongoDB ObjectId'),
		body('name').optional().isString().withMessage('Name must be a string'),
		body('price').optional().isNumeric().withMessage('Price must be a number'),
		body('avatar').optional().isString().withMessage('Avatar must be a string'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { name, price, avatar } = req.body;

		const item = await Item.findById(id);

		if (!item) {
			throw new NotFound();
		}

		if (name !== undefined) {
			item.name = name;
		}
		if (price !== undefined) {
			item.price = price;
		}
		if (avatar !== undefined) {
			item.avatar = avatar;
		}

		await item.save();

		res.status(200).send(item);
	}
);

export { router as updateItemRouter };
