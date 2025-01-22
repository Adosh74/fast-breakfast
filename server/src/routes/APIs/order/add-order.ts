import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../../middlewares/validate-request';
import { Order } from '../../../models/order';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';

const router = Router();

router.post(
	'/',
	currentUser,
	requireAuth,
	[
		body('userId').isString().withMessage('userId must be a string'),
		body('items').isArray().withMessage('items must be an array'),
		body('items.*.itemId').isString().withMessage('itemId must be a string'),
		body('items.*.quantity').isNumeric().withMessage('quantity must be a number'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { userId, items } = req.body;

		const order = Order.build({ userId, items });

		await order.save();

		res.status(201).send(order);
	}
);

export { router as addOrderRouter };
