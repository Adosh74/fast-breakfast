import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { Types } from 'mongoose';
import { BadRequestError } from '../../../errors/bad-request-error';
import { Order } from '../../../models/order';
import { NotFound } from '../../../errors/not-found-error';
import { validateRequest } from '../../../middlewares/validate-request';

const router = Router();

router.get(
	'/:orderId',
	currentUser,
	requireAuth,
	[param('orderId').isString().withMessage('orderId must be a string')],
	validateRequest,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;
		if (!Types.ObjectId.isValid(orderId)) {
			throw new BadRequestError('Invalid order id');
		}

		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFound('Order not found');
		}

		if (order.userId !== req.currentUser!.id || req.currentUser!.role !== 'admin') {
			throw new NotFound('Order not found');
		}

		res.status(200).send(order);
	}
);

export { router as getOrderRouter };
